const fs = require('fs').promises
const electron = require('electron')
const path = require('path')

/*recursively get all files in a folder*/
/*with async iterators*/
async function* walk(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true })

    for (const dirent of dirents) {
        const file = path.join(dir, dirent.name)
        if (dirent.isDirectory()) {
            yield* walk(file)
        } else {
            yield file
        }
    }
}

/*
options: {
    filters: ['jpg', '.png', 'mp4'...]
}
*/
async function getFiles(
                    dir, 
                    options = {
                        filters: ['mp4', 'webm', 'ogg']
                    }) {
    let files = []

    for await (const file of walk(dir)) {
        for (let ext of options.filters) {
            if(path.extname(file).toLowerCase().match(`.?${ext.toLowerCase()}$`)) {
                files.push(file)
                break;
            }
        }
    }

    return files
}

/**
 * Shuffle elements in an array randomly with Durstenfeld shuffle algorithm (mutate)
 * @param {Array<any>} array 
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function getFileType(file) {
    return path.extname(file).toLowerCase().replace('.', '')
}

function getFileName(file) {
    return path.basename(file)
}

/**
 * @param {String} postfix to join the %USERDATA% path with
 */
function getUserDataPath(postfix) {
    return path.join((electron.app || electron.remote.app).getPath('userData'), postfix)
}

async function moveFile(file, dest) {
    await fs.copyFile(file, dest)
    return fs.unlink(file)
}

module.exports = {
    getFiles,
    shuffle,
    getFileType,
    getFileName,
    getUserDataPath,
    moveFile
}