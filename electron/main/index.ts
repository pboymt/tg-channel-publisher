import { app, BrowserWindow, shell, ipcMain, protocol } from 'electron'
import { mkdir } from 'fs/promises'
import { release } from 'os'
import { join } from 'path'
import { URL, parse } from 'url'
import { ChannelPost, sendMessage, startBot } from './bot'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function registerProtocol() {
  // protocol.sche
  const IMAGE_PATH = join(app.getPath('userData'), 'images')
  await mkdir(IMAGE_PATH, { recursive: true })
  protocol.registerFileProtocol('ryukyu', (request, callback) => {
    const url = new URL(request.url)
    console.log(url)
    // { path: join(app.getPath('userData'),request.method)}
  });
  // protocol.registerHttpProtocol('ryukyu', (request, callback) => {
  //   console.log('http')
  //   console.log(request)
  //   callback({
  //     mimeType: 'text/html',
  //     method: request.method,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //     },
  //     data: '<h1>Hello World</h1>'
  //   })
  // })
  // protocol.registerStreamProtocol('ryukyu', (request, callback) => {

  // })
}

async function createWindow() {
  console.log('新建窗口')
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
    minWidth: 1280,
    minHeight: 800,
  })
  win.setMenu(null)

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

// protocol.registerSchemesAsPrivileged([
//   { scheme: 'ryukyu', privileges: { standard: true, bypassCSP: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
// ])
// .then(registerProtocol)

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})

ipcMain.handle('start-bot', (event, token: string, proxy: string) => {
  startBot(token, proxy)
})

ipcMain.handle('send-message', (event, chatId: string | number, post: ChannelPost) => {
  console.log(chatId, post)
  sendMessage(chatId, post)
})
