/// <reference path='../types.d.ts' />
(() => {
  const { showMessageBox } = window.dialog
  const { getFileType, getFileName } = window.common

  let currentIndex = 0
  let videos = []

  const keyCode = {
    pageDown: 34, // move on next video
    pageUp: 33, // go back to previous video
    esc: 27, // pause and minimize
    left: 37, // backward
    right: 39, // forward
  }
  
  // received a shuffled array of files after user press 'File > open...'
  window.bridge.on('renderer:shuffled-files', async (files) => {
    videos = files
    playVideo(videos[currentIndex])
  })

  $(document).on('keyup', event => {
    switch (event.keyCode) {
      case keyCode.pageDown:
        playVideo(videos[++currentIndex])
        break
      case keyCode.pageUp:
        playVideo(videos[--currentIndex])
        break
      case keyCode.esc:
        pauseVideo()
        break
    }
  })

  $(document).on('keydown', event => {
    switch (event.keyCode) {
      case keyCode.left:
        event.preventDefault()
        backward(7)
        break
      case keyCode.right:
        event.preventDefault()
        forward(5)
        break
    }
  })

  const playVideo = file => {
    if (!file) throw new Error('File name can not be empty')
    $('.flex-container').show()
    $('.loader').hide()
    const fileName = getFileName(file)

    $('#video-element')
      .attr({
        src: `file:///${file}`,
        type: `video/${getFileType(file)}`
      })
      .unbind() //unbind all previously attached listeners to prevent events bubling up
      .trigger('play')
      .on('error', e => {
        showMessageBox({
          type: 'error',
          title: e.target.error.message,
          message: `Delete ${fileName} ?`,
          buttons: ['Delete', 'Skip'],
          defaultId: 1
        }, response => {
          if (response === 1) { // skip
            videos.splice(currentIndex, 1)
            playVideo(videos[currentIndex])
          } else {
            videos.splice(currentIndex, 1)
            /*TODO: delete file*/

            playVideo(videos[currentIndex])
          }
        })
        return false
      })
      .on('play', () => {
        $('.flex-container #video-name').html(fileName)
        return true
      })
  }

  const pauseVideo = () => {
    $('#video-element')
      .unbind() //unbind all previously attached listeners to prevent events bubling up
      .trigger('pause');
    window.ipcRenderer.send('main:pause')
  }

  const forward = (s) => {
    $('#video-element')[0].currentTime += s
  }

  const backward = (s) => {
    $('#video-element')[0].currentTime -= s
  }
})()