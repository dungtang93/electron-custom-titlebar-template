const defaultOptions = {
    properties: ['openDirectory']
}

const { remote } = require('electron');

(remote => {
  const showOpenDialog = (options = defaultOptions) => remote.dialog.showOpenDialog(null, options)

  const showErrorBox = (content) => remote.dialog.showErrorBox('Error', content)

  const showMessageBox = (options = defaultOptions) => remote.dialog.showMessageBoxSync(options)

  module.exports = {
    showOpenDialog,
    showErrorBox,
    showMessageBox
  }
})(remote)