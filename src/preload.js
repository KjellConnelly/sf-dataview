const { ipcRenderer, contextBridge } = require("electron")
const { platform } = require("os")

contextBridge.exposeInMainWorld('nodeApp', {
  double: (arg)=>ipcRenderer.invoke("double", arg),
  getAccountNames: (arg)=>ipcRenderer.invoke("getAccountNames",arg),
  getAccountNamesAndFilenames: (arg)=>ipcRenderer.invoke("getAccountNamesAndFilenames",arg),
  getAccountFull: (arg)=>ipcRenderer.invoke("getAccountFull",arg),
  selectDirectory: (arg)=>ipcRenderer.invoke("selectDirectory",arg),
  search: (arg)=>ipcRenderer.invoke("search",arg),
})
