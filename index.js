const { app, BrowserWindow } = require('electron/main');
const host = require('/system/display/host.json');

const host_ = require('./host.js');
const path = require('node:path')

function createWindow () {
  const win = new BrowserWindow({
    webPreferences: {
       zoomFactor: 1.0,
     // preload: path.join(__dirname, 'preload.js')
     nodeIntegration: true,
     contextIsolation: false, // Set this to false to enable 'require'
    },
    frame: true,
    fullscreen: true,
    
    
  })
  win.loadURL(`http://localhost:${host.port}`)
}



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
