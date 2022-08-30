import { lstat } from 'fs/promises'
import { cwd } from 'process'
import { ipcRenderer, shell } from 'electron'
import { ChannelPost } from 'electron/main/bot'


ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats)
}).catch(err => {
  console.error(err)
})

export function openURL(url: string) {
  shell.openExternal(url)
}

export async function sendMessage(chatId: string | number, post: ChannelPost) {
  console.log(chatId, post)
  await ipcRenderer.invoke('send-message', chatId, post)
}
