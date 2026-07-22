const { contextBridge, ipcRenderer } = require('electron')

const desktopApi = Object.freeze({
  platform: process.platform,
  getCompanionCapabilities: () => ipcRenderer.invoke('companion:get-capabilities'),
  transcribeWithCompanion: ({ name, type, bytes }) => ipcRenderer.invoke(
    'companion:transcribe',
    { name, type, bytes },
  ),
})

contextBridge.exposeInMainWorld('inHouseRxDesktop', desktopApi)

