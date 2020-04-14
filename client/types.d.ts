import { getFileName, getFileType, getFiles, getUserDataPath, moveFile, shuffle } from '../modules/common'
import { showErrorBox, showMessageBox, showOpenDialog } from '../modules/dialog'

export declare global {
  interface Window {
    hbjs: { hbspawn: (options: Object, onProgress: (percent: Number) => void) => Promise },
    bridge: {
      send: Electron.IpcRenderer.send,
      on: (channel: String, callback: VoidFunction) => void
    }
    common: {
      getFileName: typeof getFileName,
      getFileType: typeof getFileType,
      getFiles: typeof getFiles,
      getUserDataPath: typeof getUserDataPath,
      moveFile: typeof moveFile,
      shuffle: typeof shuffle
    },
    dialog: {
      showErrorBox: typeof showErrorBox,
      showMessageBox: typeof showMessageBox,
      showOpenDialog: typeof showOpenDialog
    }
  }
}