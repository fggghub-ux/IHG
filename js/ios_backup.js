(function () {
    window.u2InitIosBackup = function ({
        showOperation: showOperation,
        updateOperation: updateOperation,
        hideOperation: hideOperation,
        refreshStorageHealth: refreshStorageHealth,
    }) {
        const bridge = window.u2NativeBridge;
        const group = document.getElementById('ios-icloud-backup-group');
        if (!group || !bridge?.isNativeIOS?.()) return;
        group.hidden = false;
        const exportButton = document.getElementById('ios-icloud-export-btn');
        const importButton = document.getElementById('ios-icloud-import-btn');
        const changeFileButton = document.getElementById('ios-icloud-change-file');
        const preview = document.getElementById('ios-icloud-import-preview');
        let selectedBackup = null;
        let busy = false;
        function setBusy(enabled) {
            busy = enabled;
            for (const button of [exportButton, importButton, changeFileButton])
                button.disabled = enabled;
        }
        function resetPreview() {
            selectedBackup = null;
            preview.hidden = true;
        }
        function renderPreview(file, summary) {
            const setPreviewText = (field, value) => {
                document.getElementById('ios-icloud-import-' + field).textContent = String(value);
            };
            setPreviewText('file-name', file.name);
            setPreviewText('version', 'v' + (summary.schemaVersion || '-'));
            setPreviewText('records', summary.recordCount || 0);
            setPreviewText('assets', summary.assetCount || 0);
            setPreviewText('size', window.appStorage.formatBytes(file.size));
            preview.hidden = false;
        }
        exportButton.addEventListener('click', async () => {
            if (busy) return;
            setBusy(true);
            try {
                showOperation('正在准备完整备份...');
                const blob = await window.appStorage.exportAllData(updateOperation);
                updateOperation({
                    message: '请选择“iCloud 云盘”保存备份...',
                    progress: 99,
                });
                const status = await bridge.exportFile({
                    blob: blob,
                    fileName:
                        'u2phone_backup_' +
                        new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) +
                        '.json',
                    title: 'U2 完整数据备份',
                });
                if (status === 'downloaded')
                    window.showToast('备份文件已保存；如已选择 iCloud 云盘，上传由 iOS 完成', 5000);
                else {
                    if (status !== 'cancelled') throw new Error('备份保存失败，请重试');
                }
            } catch (error) {
                window.showToast(error?.message || '备份失败，请重试');
            } finally {
                hideOperation();
                setBusy(false);
            }
        });
        async function selectBackupFile() {
            if (busy) return;
            resetPreview();
            setBusy(true);
            try {
                showOperation('请在“iCloud 云盘”中选择备份，云端文件可能需要下载...');
                const file = await bridge.importBackupFile(updateOperation);
                if (!file) return;
                updateOperation({
                    message: '正在校验备份...',
                    progress: 30,
                });
                const payload = JSON.parse(await file.blob.text());
                const summary = window.appStorage.inspectBackupPayload(payload);
                selectedBackup = {
                    file: {
                        name: file.name,
                        size: file.size,
                    },
                    payload: payload,
                };
                renderPreview(file, summary);
                window.showToast('备份已校验，请再次点击还原');
            } catch (error) {
                resetPreview();
                window.showToast(error?.message || '文件格式错误或备份已损坏');
            } finally {
                hideOperation();
                setBusy(false);
            }
        }
        changeFileButton.addEventListener('click', selectBackupFile);
        importButton.addEventListener('click', async () => {
            if (busy) return;
            if (!selectedBackup) return selectBackupFile();
            if (
                !window.confirm(
                    '将用「' +
                        selectedBackup.file.name +
                        '」完整替换当前手机里的应用数据和配置。此操作不可撤销，确定继续？',
                )
            )
                return;
            setBusy(true);
            try {
                showOperation('正在还原完整备份...');
                const result = await window.appStorage.importAllData(
                    selectedBackup.payload,
                    updateOperation,
                );
                const skippedStickers = Math.max(0, Number(result?.stickers?.skippedItems) || 0);
                updateOperation({
                    message: skippedStickers
                        ? '还原成功，已跳过 ' + skippedStickers + ' 张无法恢复的表情，正在重启...'
                        : '还原成功，正在重启...',
                    progress: 100,
                });
                window.setTimeout(() => window.location.reload(), 1200);
            } catch (error) {
                hideOperation();
                setBusy(false);
                window.showToast(error?.message || '还原失败，当前数据未替换');
                await refreshStorageHealth();
            }
        });
    };
})();
