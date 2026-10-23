// Isolated lifecycle regression: image providers return fixture pixels; no API is called.
// Requires Playwright. CHROMIUM_PATH may select an installed Chromium binary.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

(async () => {
  const root = path.resolve(__dirname, "..");
  const pixels = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGOscOthwAaYsIoOWgkABj8BWkljeFQAAAAASUVORK5CYII=",
    "base64",
  );
  const requests = [];
  const errors = [];
  const server = http.createServer((request, response) => {
    const relative =
      decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      ).replace(/^\//, "") || "index.html";
    const file = path.join(root, relative);
    response.setHeader(
      "Content-Type",
      {
        ".js": "text/javascript",
        ".html": "text/html",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
      }[path.extname(file)] || "application/octet-stream",
    );
    fs.createReadStream(file)
      .on("error", () => {
        response.statusCode = 404;
        response.end();
      })
      .pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage({
    viewport: { width: 820, height: 1148 },
    isMobile: true,
    hasTouch: true,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1") return route.continue();
    if (
      ["picsum.photos", "api.dicebear.com", "media.example.test"].includes(
        url.hostname,
      )
    ) {
      requests.push({
        url: url.href,
        referer: route.request().headers().referer,
      });
      return route.fulfill({
        status: 200,
        contentType: "image/png",
        body: pixels,
      });
    }
    return route.abort();
  });
  async function load() {
    await page.goto("http://127.0.0.1:" + server.address().port, {
      waitUntil: "load",
    });
    await page.waitForFunction(
      () =>
        window.tkRenderHome &&
        window.tkRenderProfile &&
        window.tkRenderChat &&
        window.tkDataReadyPromise,
    );
    await page.evaluate(async () => {
      await window.tkDataReadyPromise;
      document.getElementById("u2-login-screen")?.remove();
      document.body.classList.remove("u2-login-locked");
      window.showToast = () => {};
    });
  }
  async function check(name, callback) {
    assert.equal(await page.evaluate(callback), true, name);
    console.log("PASS", name);
  }
  try {
    await load();
    await check("First launch renders both original default videos", () => {
      document.getElementById("app-tiktok-btn").click();
      return (
        window.tkState.videos.map((video) => video.id).join(",") ===
          "v_default_1,v_default_2" &&
        document.querySelectorAll(".tk-video-card").length === 2
      );
    });
    await page.waitForFunction(() => {
      const images = [
        ...document.querySelectorAll(".tk-avatar-action img"),
      ].filter((image) => image.getAttribute("src"));
      return (
        images.length === 2 &&
        images.every((image) => image.complete && image.naturalWidth)
      );
    });
    assert(
      requests.some(
        (request) =>
          request.url === "https://picsum.photos/seed/user_default_1/150/150" &&
          !request.referer,
      ),
    );
    await page.evaluate(() => window.saveGlobalData());
    await load();
    await check(
      "Defaults survive reload",
      () => window.tkState.videos.length === 2,
    );
    await check("Settings use APK typography and requested colors", () => {
      document.getElementById("app-tiktok-btn").click();
      document.getElementById("tk-profile-settings-btn").click();
      const sheet = document.getElementById("tk-profile-settings-sheet");
      const titles = [...sheet.querySelectorAll(".tk-settings-row-title")];
      const fonts = titles.map((element) => {
        const style = getComputedStyle(element);
        return [style.fontFamily, style.fontSize, style.fontWeight].join("|");
      });
      const background = (kind) =>
        getComputedStyle(
          sheet.querySelector(
            '[data-tk-clear="' + kind + '"] .tk-settings-icon',
          ),
        ).backgroundColor;
      return (
        titles.length === 4 &&
        new Set(fonts).size === 1 &&
        getComputedStyle(titles[0]).fontSize === "15px" &&
        getComputedStyle(titles[0]).fontWeight === "550" &&
        background("videos") === background("all") &&
        background("dms") === "rgb(52, 199, 89)" &&
        background("all") === "rgb(255, 59, 48)" &&
        sheet.querySelector('[data-tk-clear="dms"] svg').children.length === 1
      );
    });
    await check(
      "NPCs, comments, replies and covers keep their own image URLs",
      () => {
        window.tkState.chars = [
          {
            id: "media-npc",
            name: "NPC",
            avatar: "https://media.example.test/npc.png",
          },
        ];
        window.tkState.videos = [
          window.tkNormalizeVideoPayload({
            id: "media-video",
            authorId: "media-npc",
            authorName: "NPC",
            mediaType: "image",
            cover: "https://media.example.test/cover.png",
            desc: "Photo",
            opening: "A scene",
            comments: [
              {
                id: "media-comment",
                authorName: "Reader",
                authorAvatar: "https://media.example.test/comment.png",
                text: "Comment",
                replies: [
                  {
                    id: "media-reply",
                    authorName: "Reply",
                    text: "Reply",
                    authorAvatar: "https://media.example.test/reply.png",
                  },
                ],
              },
            ],
          }),
        ];
        window.tkPersistState();
        window.tkRenderHome();
        window.tkOpenSubProfile("media-npc");
        window.tkOpenComments("media-video");
        return (
          window.tkResolveAvatar("media-npc", "NPC") ===
          "https://media.example.test/npc.png"
        );
      },
    );
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll("#tk-sub-profile-avatar-img, #tk-feed-container img, #tk-comments-list img")].filter(
        (image) => image.src.includes("media.example.test"),
      );
      return (
        images.length >= 4 &&
        images.every((image) => image.complete && image.naturalWidth)
      );
    });
    assert(
      requests
        .filter((request) => request.url.includes("media.example.test"))
        .every((request) => !request.referer),
    );
    await check(
      "Saved local assets restore NPC and nested comment avatars",
      async () => {
        await window.appStorage.saveAssetFromDataUrl(
          "tk-regression-avatar",
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGOscOthwAaYsIoOWgkABj8BWkljeFQAAAAASUVORK5CYII=",
          { ownerType: "tiktok" },
        );
        const char = window.tkState.chars[0];
        const comment = window.tkState.videos[0].comments[0];
        for (const [owner, field] of [
          [char, "avatar"],
          [comment, "authorAvatar"],
        ]) {
          owner[field] = null;
          owner[field + "AssetId"] = "tk-regression-avatar";
        }
        await window.tkHydrateVideoAssets();
        return (
          char.avatar?.startsWith("blob:") &&
          comment.authorAvatar?.startsWith("blob:")
        );
      },
    );
    for (const kind of ["videos", "all"]) {
      await page.evaluate(async (kind) => {
        await window.tkClearData(kind);
        await window.saveGlobalData();
      }, kind);
      await load();
      await check(
        "Explicit " + kind + " clearing stays empty after reload",
        () => window.tkState.videos.length === 0,
      );
    }
    for (const initialized of [false, true]) {
      await page.evaluate(async (initialized) => {
        const state = {
          profile: { name: "Legacy", posts: [] },
          chars: [{ id: "kept-contact", name: "Kept" }],
          videos: [],
          dms: [],
        };
        if (initialized)
          state.activity = {
            followers: [],
            likes: [],
            saves: [],
            comments: [],
          };
        window.setAppState("tiktok", state);
        await window.saveGlobalData();
      }, initialized);
      await load();
      assert.equal(
        await page.evaluate(() => window.tkState.videos.length),
        initialized ? 0 : 2,
      );
      await check(
        "Legacy migration preserves profile and contacts",
        () =>
          window.tkState.profile.name === "Legacy" &&
          window.tkState.chars[0].id === "kept-contact",
      );
    }
    assert.deepEqual(errors, [], "No runtime errors");
  } catch (error) {
    console.error("IMAGE DEBUG", await page.evaluate(() => [...document.querySelectorAll("#tk-sub-profile-avatar-img, #tk-feed-container img, #tk-comments-list img")].map(i => ({src:i.src, width:i.naturalWidth, loading:i.loading, complete:i.complete}))), requests);
    throw error;
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
