(function () {
    const SUPABASE_URL = 'https://xesofmxgvsnpldrjtxur.supabase.co',
        apikey_2 = 'sb_publishable_CbaMneYIuVFIvUNiTtTgHQ_ouUMzmI5',
        AUTH_SESSION_KEY = 'u2_auth_session_v1',
        AUTH_LOGOUT_EVENT_KEY = 'u2_auth_logout_event_v1',
        OLD_ACTIVATION_KEY = 'u2_activation_granted_v1',
        AUTH_REQUEST_TIMEOUT_MS = 12000,
        AUTH_RECOVERY_DELAYS = [1000, 3000, 8000, 15000, 30000],
        USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/,
        ACTIVATION_CODE_PATTERN = /^U2(?:-[A-Z2-9]{4}){4}$/;
    let dom = null,
        mode = 'signin',
        currentSession = null,
        loginFocusTimer = null,
        value_7 = null,
        authRecoveryTimer = null,
        authRecoveryAttempt = 0;
    function collectDom() {
        return {
            screen: document.getElementById('u2-login-screen'),
            title: document.getElementById('u2-login-title'),
            form: document.getElementById('u2-login-form'),
            signinMode: document.getElementById('u2-login-mode-signin'),
            registerMode: document.getElementById('u2-login-mode-register'),
            accountField: document.getElementById('u2-login-account-field'),
            accountInput: document.getElementById('u2-login-account'),
            passwordField: document.getElementById('u2-login-password-field'),
            passwordInput: document.getElementById('u2-login-password'),
            passwordToggle: document.getElementById('u2-login-password-toggle'),
            confirmField: document.getElementById('u2-login-confirm-field'),
            confirmInput: document.getElementById('u2-login-confirm'),
            codeField: document.getElementById('u2-login-code-field'),
            codeInput: document.getElementById('u2-login-code'),
            noticeRow: document.getElementById('u2-login-notice-row'),
            noticeAccepted: document.getElementById('u2-login-notice-accepted'),
            noticeLink: document.getElementById('u2-login-notice-link'),
            error: document.getElementById('u2-login-error'),
            submit: document.getElementById('u2-login-submit'),
            submitLabel: document.getElementById('u2-login-submit-label'),
        };
    }
    function normalizeUsername(value_2) {
        return String(value_2 || '')
            .trim()
            .toLowerCase();
    }
    function normalizeActivationCode(value_3) {
        const raw_2 = String(value_3 || '')
                .trim()
                .toUpperCase(),
            compact = raw_2.replace(/[^A-Z0-9]/g, '');
        if (!compact.startsWith('U2')) return raw_2;
        const groups = compact.slice(2, 18).match(/.{1,4}/g) || [];
        return ['U2', ...groups].join('-');
    }
    function setLoginLocked(locked) {
        document.body?.classList.toggle('u2-login-locked', !!locked);
    }
    function showLoginScreen_2(value_23 = {}) {
        if (!dom?.screen) return;
        clearTimeout(loginFocusTimer);
        dom.screen.classList.remove('is-checking', 'is-hidden');
        dom.screen.inert = false;
        dom.screen.setAttribute('aria-hidden', 'false');
        setLoginLocked(true);
        value_23.focus !== false &&
            (loginFocusTimer = setTimeout(() => {
                if (!dom?.screen?.classList.contains('is-hidden')) dom.accountInput?.focus();
            }, 80));
    }
    function hideLoginScreen_2() {
        if (!dom?.screen) return;
        clearTimeout(loginFocusTimer);
        if (dom.screen.contains(document.activeElement)) document.activeElement.blur();
        dom.screen.inert = true;
        dom.screen.setAttribute('aria-hidden', 'true');
        dom.screen.classList.remove('is-checking');
        dom.screen.classList.add('is-hidden');
        setLoginLocked(false);
        window.dispatchEvent(
            new CustomEvent('u2:main-interface-ready', {
                detail: {
                    username: currentSession?.username || readSession()?.username || '',
                },
            }),
        );
    }
    function readSession() {
        try {
            const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed?.access_token || !parsed?.refresh_token) return null;
            return parsed;
        } catch {
            return null;
        }
    }
    function saveSession(session_2, username_2 = '') {
        return (
            (currentSession = {
                access_token: session_2.access_token,
                refresh_token: session_2.refresh_token,
                expires_at: Number(
                    session_2.expires_at ||
                        Math.floor(Date.now() / 1000) + Number(session_2.expires_in || 3600),
                ),
                token_type: session_2.token_type || 'bearer',
                username: normalizeUsername(username_2 || currentSession?.username),
            }),
            window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(currentSession)),
            window.localStorage.removeItem(OLD_ACTIVATION_KEY),
            currentSession
        );
    }
    function clearSession() {
        currentSession = null;
        window.localStorage.removeItem(AUTH_SESSION_KEY);
        window.localStorage.removeItem(OLD_ACTIVATION_KEY);
    }
    async function request(value_26, options_2 = {}) {
        const controller = new AbortController(),
            timeout = setTimeout(
                () => controller.abort(),
                Number(options_2.timeoutMs) || AUTH_REQUEST_TIMEOUT_MS,
            ),
            headers_2 = {
                apikey: apikey_2,
                'Content-Type': 'application/json',
                ...(options_2.headers || {}),
            };
        let response;
        try {
            response = await fetch('' + SUPABASE_URL + value_26, {
                method: options_2.method || 'POST',
                headers: headers_2,
                body: options_2.body === undefined ? undefined : JSON.stringify(options_2.body),
                signal: controller.signal,
            });
        } catch (cause_2) {
            if (cause_2?.name === 'AbortError') {
                const timeoutError = new Error('AUTH_REQUEST_TIMEOUT');
                timeoutError.code = 'AUTH_REQUEST_TIMEOUT';
                timeoutError.cause = cause_2;
                throw timeoutError;
            }
            throw cause_2;
        } finally {
            clearTimeout(timeout);
        }
        let payload_2 = {};
        try {
            payload_2 = await response.json();
        } catch {
            payload_2 = {};
        }
        if (!response.ok) {
            const error_2 = new Error(
                payload_2?.msg ||
                    payload_2?.message ||
                    payload_2?.error_description ||
                    payload_2?.error ||
                    'HTTP ' + response.status,
            );
            error_2.status = response.status;
            error_2.payload = payload_2;
            throw error_2;
        }
        return payload_2;
    }
    function internalEmail(value_34) {
        return normalizeUsername(value_34) + '@accounts.u2phone.invalid';
    }
    async function signIn(username_3, password_2) {
        const data_2 = await request('/auth/v1/token?grant_type=password', {
            body: {
                email: internalEmail(username_3),
                password: password_2,
            },
        });
        return saveSession(data_2, username_3);
    }
    async function refreshSession(session_3) {
        try {
            const data = await request('/auth/v1/token?grant_type=refresh_token', {
                body: {
                    refresh_token: session_3.refresh_token,
                },
            });
            return saveSession(data, session_3.username);
        } catch (error_3) {
            error_3.authPhase = 'refresh';
            throw error_3;
        }
    }
    async function ensureFreshSession(session_4) {
        const expiresAt = Number(session_4?.expires_at || 0);
        if (expiresAt > Math.floor(Date.now() / 1000) + 60) return session_4;
        return refreshSession(session_4);
    }
    async function handleAction_12(value_41) {
        return request('/rest/v1/rpc/u2_check_device', {
            headers: {
                Authorization: 'Bearer ' + value_41.access_token,
            },
            body: {
                p_device_hash: null,
            },
        });
    }
    async function authorizeSession(value_42) {
        const freshSession = await ensureFreshSession(value_42),
            state = await handleAction_12(freshSession);
        if (!state?.allowed) {
            const error_4 = new Error(state?.reason || 'AUTHORIZATION_FAILED');
            error_4.code = state?.reason || 'AUTHORIZATION_FAILED';
            throw error_4;
        }
        if (state.username && state.username !== freshSession.username)
            saveSession(freshSession, state.username);
        return state;
    }
    function isPermanentSessionError(error_5) {
        const code_2 = error_5?.code || error_5?.payload?.code || '';
        if (
            [
                'ACCOUNT_DISABLED',
                'ACCOUNT_EXPIRED',
                'PROFILE_MISSING',
                'NOT_AUTHENTICATED',
            ].includes(code_2)
        )
            return true;
        if (Number(error_5?.status) === 401) return true;
        return error_5?.authPhase === 'refresh' && Number(error_5?.status) === 400;
    }
    function cancelAuthRecovery() {
        clearTimeout(authRecoveryTimer);
        authRecoveryTimer = null;
        authRecoveryAttempt = 0;
    }
    function scheduleAuthRecovery() {
        if (authRecoveryTimer || !(currentSession || readSession())) return;
        const delay =
            AUTH_RECOVERY_DELAYS[Math.min(authRecoveryAttempt, AUTH_RECOVERY_DELAYS.length - 1)];
        authRecoveryAttempt += 1;
        authRecoveryTimer = setTimeout(() => {
            authRecoveryTimer = null;
            if (document.visibilityState === 'hidden') return;
            recoverSession({
                releaseGateOnTransient: false,
            });
        }, delay);
    }
    async function recoverSession(options_3 = {}) {
        if (value_7) return value_7;
        const session_5 = currentSession || readSession();
        if (!session_5) {
            if (options_3.showLoginWhenMissing !== false)
                showLoginScreen_2({
                    focus: false,
                });
            return false;
        }
        return (
            (currentSession = session_5),
            (value_7 = (async () => {
                try {
                    return (
                        await authorizeSession(currentSession || session_5),
                        cancelAuthRecovery(),
                        hideLoginScreen_2(),
                        true
                    );
                } catch (error_6) {
                    if (isPermanentSessionError(error_6))
                        return (
                            cancelAuthRecovery(),
                            clearSession(),
                            showLoginScreen_2({
                                focus: false,
                            }),
                            setMode('signin', {
                                focus: false,
                            }),
                            setMessage(messageForError(error_6)),
                            false
                        );
                    currentSession = readSession() || currentSession || session_5;
                    if (options_3.releaseGateOnTransient) hideLoginScreen_2();
                    return (
                        scheduleAuthRecovery(),
                        console.warn(
                            '[auth] Temporary authorization failure; session retained:',
                            error_6,
                        ),
                        false
                    );
                } finally {
                    value_7 = null;
                }
            })()),
            value_7
        );
    }
    function setBusy(busy) {
        [
            dom?.submit,
            dom?.signinMode,
            dom?.registerMode,
            dom?.accountInput,
            dom?.passwordInput,
            dom?.confirmInput,
            dom?.codeInput,
            dom?.noticeAccepted,
        ].forEach((element) => {
            if (element) element.disabled = !!busy;
        });
    }
    function setMessage(textContent_2 = '', success = false) {
        if (!dom?.error) return;
        dom.error.textContent = textContent_2;
        dom.error.classList.toggle('is-success', !!success);
    }
    function clearValidation() {
        [
            dom?.accountField,
            dom?.passwordField,
            dom?.confirmField,
            dom?.codeField,
            dom?.noticeRow,
        ].forEach((element_2) => element_2?.classList.remove('is-invalid'));
        setMessage('');
    }
    function setMode(nextMode, value_54 = {}) {
        mode = nextMode === 'register' ? 'register' : 'signin';
        const registering = mode === 'register';
        dom?.screen?.classList.toggle('is-register-mode', registering);
        dom?.signinMode?.classList.toggle('is-active', !registering);
        dom?.registerMode?.classList.toggle('is-active', registering);
        dom?.signinMode?.setAttribute('aria-selected', String(!registering));
        dom?.registerMode?.setAttribute('aria-selected', String(registering));
        if (dom?.title) dom.title.textContent = registering ? '创建账号' : '欢迎回来';
        if (dom?.submitLabel) dom.submitLabel.textContent = registering ? '注册并进入' : '登录';
        if (dom?.passwordInput)
            dom.passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
        clearValidation();
        clearTimeout(loginFocusTimer);
        value_54.focus !== false &&
            (loginFocusTimer = setTimeout(() => {
                if (!dom?.screen?.classList.contains('is-hidden')) dom.accountInput?.focus();
            }, 30));
    }
    function messageForError(error_7) {
        const code_3 = error_7?.code || error_7?.payload?.code || '',
            messages = {
                USERNAME_INVALID: '账号需为 3–24 位小写字母、数字或下划线。',
                USERNAME_TAKEN: '这个账号已经被注册。',
                PASSWORD_INVALID: '密码长度需为 6–72 位。',
                CODE_INVALID: '激活码无效，请检查后重试。',
                CODE_DISABLED: '这个激活码已被停用。',
                CODE_USED: '这个激活码已经被使用。',
                CODE_EXPIRED: '这个激活码已经过期。',
                ACCOUNT_DISABLED: '账号已被停用，请联系管理员。',
                ACCOUNT_EXPIRED: '账号已到期，请联系管理员。',
                PROFILE_MISSING: '账号尚未完成激活，请联系管理员。',
                NOT_AUTHENTICATED: '登录状态已失效，请重新登录。',
                AUTH_REQUEST_TIMEOUT: '授权服务响应较慢，请稍后重试。',
            };
        if (messages[code_3]) return messages[code_3];
        if (error_7?.status === 400 && /credentials|login/i.test(error_7.message || ''))
            return '账号或密码错误。';
        if (/Invalid login credentials/i.test(error_7?.message || '')) return '账号或密码错误。';
        if (error_7 instanceof TypeError || /fetch|network|failed/i.test(error_7?.message || ''))
            return '无法连接授权服务，请检查网络后重试。';
        return '操作失败，请稍后重试。';
    }
    function handleAction_15() {
        const username_4 = normalizeUsername(dom?.accountInput?.value),
            password_3 = String(dom?.passwordInput?.value || '');
        if (dom?.accountInput) dom.accountInput.value = username_4;
        if (!USERNAME_PATTERN.test(username_4)) {
            dom?.accountField?.classList.add('is-invalid');
            dom?.accountInput?.focus();
            throw Object.assign(new Error('USERNAME_INVALID'), {
                code: 'USERNAME_INVALID',
            });
        }
        if (password_3.length < 6 || password_3.length > 72) {
            dom?.passwordField?.classList.add('is-invalid');
            dom?.passwordInput?.focus();
            throw Object.assign(new Error('PASSWORD_INVALID'), {
                code: 'PASSWORD_INVALID',
            });
        }
        if (mode !== 'register')
            return {
                username: username_4,
                password: password_3,
            };
        const confirmPassword = String(dom?.confirmInput?.value || ''),
            activationCode_2 = normalizeActivationCode(dom?.codeInput?.value);
        if (dom?.codeInput) dom.codeInput.value = activationCode_2;
        if (password_3 !== confirmPassword) {
            dom?.confirmField?.classList.add('is-invalid');
            dom?.confirmInput?.focus();
            throw Object.assign(new Error('PASSWORD_MISMATCH'), {
                code: 'PASSWORD_MISMATCH',
            });
        }
        if (!ACTIVATION_CODE_PATTERN.test(activationCode_2)) {
            dom?.codeField?.classList.add('is-invalid');
            dom?.codeInput?.focus();
            throw Object.assign(new Error('CODE_INVALID'), {
                code: 'CODE_INVALID',
            });
        }
        if (!dom?.noticeAccepted?.checked) {
            dom?.noticeRow?.classList.add('is-invalid');
            dom?.noticeAccepted?.focus();
            throw Object.assign(new Error('NOTICE_REQUIRED'), {
                code: 'NOTICE_REQUIRED',
            });
        }
        return {
            username: username_4,
            password: password_3,
            activationCode: activationCode_2,
        };
    }
    async function handleAction_16(event) {
        event.preventDefault();
        clearValidation();
        let value_62;
        try {
            value_62 = handleAction_15();
        } catch (error_8) {
            if (error_8?.code === 'PASSWORD_MISMATCH') setMessage('两次输入的密码不一致。');
            else {
                if (error_8?.code === 'NOTICE_REQUIRED')
                    setMessage('请先阅读并勾选《u2phone食用须知》。');
                else setMessage(messageForError(error_8));
            }
            return;
        }
        setBusy(true);
        try {
            if (mode === 'register') {
                const result = await request('/functions/v1/register-account', {
                    body: value_62,
                });
                if (!result?.ok)
                    throw Object.assign(new Error(result?.code || 'REGISTRATION_FAILED'), {
                        code: result?.code,
                    });
                result.session
                    ? saveSession(result.session, value_62.username)
                    : await signIn(value_62.username, value_62.password);
            } else await signIn(value_62.username, value_62.password);
            await authorizeSession(currentSession);
            if (dom?.passwordInput) dom.passwordInput.value = '';
            if (dom?.confirmInput) dom.confirmInput.value = '';
            if (dom?.codeInput) dom.codeInput.value = '';
            if (dom?.noticeAccepted) dom.noticeAccepted.checked = false;
            hideLoginScreen_2();
        } catch (error_9) {
            console.error('[auth] Authentication failed:', error_9);
            clearSession();
            setMessage(messageForError(error_9));
        } finally {
            setBusy(false);
        }
    }
    async function logout_2() {
        const session_6 = currentSession || readSession();
        clearSession();
        window.localStorage.setItem(
            AUTH_LOGOUT_EVENT_KEY,
            JSON.stringify({
                at: Date.now(),
            }),
        );
        showLoginScreen_2();
        setMode('signin');
        if (!session_6?.access_token) return;
        try {
            await request('/auth/v1/logout?scope=local', {
                headers: {
                    Authorization: 'Bearer ' + session_6.access_token,
                },
                body: {},
            });
        } catch (error_10) {
            console.warn('[auth] Remote sign out failed:', error_10);
        }
    }
    function bindEvents() {
        dom?.form?.addEventListener('submit', handleAction_16);
        dom?.signinMode?.addEventListener('click', () => setMode('signin'));
        dom?.registerMode?.addEventListener('click', () => setMode('register'));
        dom?.passwordToggle?.addEventListener('click', () => {
            const reveal = dom.passwordInput?.type === 'password';
            if (dom.passwordInput) dom.passwordInput.type = reveal ? 'text' : 'password';
            const icon = dom.passwordToggle.querySelector?.('i');
            icon?.classList.toggle('fa-eye', !reveal);
            icon?.classList.toggle('fa-eye-slash', reveal);
            dom.passwordToggle.setAttribute('aria-label', reveal ? '隐藏密码' : '显示密码');
        });
        dom?.accountInput?.addEventListener('input', () => {
            dom.accountField?.classList.remove('is-invalid');
            setMessage('');
        });
        dom?.codeInput?.addEventListener('input', () => {
            const normalized = normalizeActivationCode(dom.codeInput.value);
            if (normalized !== dom.codeInput.value) dom.codeInput.value = normalized;
            dom.codeField?.classList.remove('is-invalid');
            setMessage('');
        });
        [dom?.passwordInput, dom?.confirmInput].forEach((input) =>
            input?.addEventListener('input', () => setMessage('')),
        );
        dom?.noticeAccepted?.addEventListener('change', () => {
            dom.noticeRow?.classList.remove('is-invalid');
            setMessage('');
        });
        dom?.noticeLink?.addEventListener('click', () =>
            window.u2AboutInfoModal?.open('disclaimer'),
        );
        window.addEventListener('storage', (event_2) => {
            if (event_2.key === AUTH_SESSION_KEY && event_2.newValue) {
                currentSession = readSession();
                return;
            }
            event_2.key === AUTH_LOGOUT_EVENT_KEY &&
                event_2.newValue &&
                (cancelAuthRecovery(), clearSession(), showLoginScreen_2(), setMode('signin'));
        });
        const resumeAuth = () => {
            if (!(currentSession || readSession())) return;
            recoverSession({
                releaseGateOnTransient: false,
                showLoginWhenMissing: false,
            });
        };
        window.addEventListener('pageshow', resumeAuth);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') resumeAuth();
        });
    }
    async function initializeAuthGate() {
        dom = collectDom();
        if (!dom.screen || !dom.form || !dom.accountInput || !dom.passwordInput) {
            window.markAuthGateSettled?.();
            return;
        }
        setLoginLocked(true);
        bindEvents();
        setMode('signin', {
            focus: false,
        });
        try {
            const savedSession = readSession();
            if (!savedSession) {
                showLoginScreen_2();
                return;
            }
            currentSession = savedSession;
            await recoverSession({
                releaseGateOnTransient: true,
            });
        } finally {
            window.markAuthGateSettled?.();
        }
    }
    window.u2Auth = {
        logout: logout_2,
        getSession: () => currentSession || readSession(),
        isLoggedIn: () => !!(currentSession || readSession()),
        showLoginScreen: showLoginScreen_2,
        hideLoginScreen: hideLoginScreen_2,
    };
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', initializeAuthGate, {
              once: true,
          })
        : initializeAuthGate();
})();
