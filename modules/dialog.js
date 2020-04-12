const defaultOptions = {
    properties: ['openDirectory']
}

/**
 * 
 * @param {Electron.Dialog} dialog 
 * @param {Electron.OpenDialogOptions} options 
 */
const showOpenDialog = (dialog, options = defaultOptions) => {
  return dialog.showOpenDialog(null, options)
}

/**
 * 
 * @param {Electron.Dialog} dialog 
 * @param {String} content 
 */
const showErrorBox = (dialog, content) => {
  dialog.showErrorBox('Error', content)
}

/**
 * 
 * @param {Electron.Dialog} dialog 
 * @param {Electron.OpenDialogOptions} options 
 */
const showMessageBox = (dialog, callback, options = defaultOptions) => {
    return dialog.showMessageBox(options, callback)
}

module.exports = {
    showOpenDialog,
    showErrorBox,
    showMessageBox
}