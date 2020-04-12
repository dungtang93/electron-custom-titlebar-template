/// <reference path='../types.d.ts' />
(() => {
  const { getFileName, getUserDataPath, moveFile } = window.common
  const { hbspawn } = window.hbjs

  const dasharray = 384
  let inProgress = false /*sometimes number turn 100 then somehow `fallback` to a lower number, prevent that with `inProgress` status*/
  let prePerc = -1 /*previous progress number*/

  // received a shuffled array of files after user press 'File > convert files in folder...'
  window.bridge.on('renderer:shuffled-files-convert', async (files) => {
    for (const video of files) {
      setProgressName(`Converting ${video} to MP4...`)
      await convertVideo(video)
      await delay(1200)
    }
  })

  const animate = perc => {
    if (perc < 100 && perc > prePerc) {
      inProgress = true

      if ($('.loader').hasClass('loaded')) {
        $('.loader').removeClass('loaded')
        $('.loader').addClass('loading')
      }

      if (!$('.loaded').hasClass('loading')) {
        $('.loader').addClass('loading')
      }

      $('.circle-loader .progress').css('stroke-dashoffset', dasharray - dasharray * perc / 100)
    }
    else if (perc >= 100 && inProgress) {
      inProgress = false
      prePerc = -1 /*reset this for next progression*/

      $('.loader').removeClass('loading')
      $('.loader').addClass('loaded')
      $('#check-gradient animate').each((i, ele) => {
        ele.beginElement()
      })
      $('.circle-loader .progress').css('stroke-dashoffset', dasharray)
    }

    prePerc = perc
  }

  const setProgressPerc = percentage => {
    animate(percentage)
  }

  const setProgressName = name => {
    $('#loader-title').html(name)
  }


  const delay = ms => new Promise(res => setTimeout(res, ms))

  // convert mkv videos to Chrome supported mp4 format
  const convertVideo = async file => {
    if (!file) throw new Error('File name can not be empty')

    $('.loader').show()
    $('.container').hide()
    setProgressPerc(0)

    const targetFile = file.replace(/\..*/, '.mp4')

    const options = {
      input: file,
      output: targetFile,
      preset: 'Fast 720p30',
      cfr: true,
      quality: 28,
      encoder: 'x264'
    }

    try {
      await hbspawn(options, percent => {
        setProgressPerc(percent)
      })
    } catch (err) {
      console.error('error', err)
      // return original file on error
      return file
    }

    // back up files in %userdata%
    console.log(`%c Moving ${file} to ${getUserDataPath(getFileName(file))}...`, 'background: #222; color: #bada55')
    return moveFile(file, getUserDataPath(getFileName(file)))
  }
})()