const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const Helper = require('./nodeApp/Helper.js')
const SearchHelper = require('./nodeApp/SearchHelper.js')

let cachedSearchData = undefined
let selectedDirectoryPath = undefined

if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow = undefined
const createWindow = () => {
  mainWindow = new BrowserWindow({

    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  //mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

//////////////////////
// handlers

ipcMain.handle("double", async (event, arg)=>{
  return arg*2
})

ipcMain.handle("getAccountNamesAndFilenames", async (event, arg)=>{
  let newpath = path.join(__dirname, "data/fake-data")
  return await Helper.getAccountNamesAndFilenames(newpath)
})

ipcMain.handle("getAccountFull", async (event, arg)=>{
  //let newpath = path.join(__dirname, "data/fake-data", arg)
  let newpath = path.join(selectedDirectoryPath, arg)
  let obj = await Helper.getJSONObj(newpath)
  return obj
})

ipcMain.handle("selectDirectory", async(event, arg)=>{
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if (result.filePaths && result.filePaths.length > 0) {
    selectedDirectoryPath = result.filePaths[0]
  }

  return await Helper.getAccountNamesAndFilenames(selectedDirectoryPath)//result.filePaths
})

ipcMain.handle("search", async(event, arg)=>{
  try {
    if (!cachedSearchData && (selectedDirectoryPath != undefined)) {
      cachedSearchData = await SearchHelper.createCachedSearchData(selectedDirectoryPath)
    }
    let results = await SearchHelper.search(arg, cachedSearchData)
    return results
  } catch(err) {
    console.error(err)
  }
})
