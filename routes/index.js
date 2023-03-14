const express = require('express')
const router = express.Router()
const fs = require('fs')

const pathRouter = `${__dirname}`

const removeExtension = (fileName) => {
    return fileName.split('.').shift()
}

fs.readdirSync(pathRouter).filter((file) => {
    const fileWithOutExt = removeExtension(file)
    const skip = ['index'].includes(fileWithOutExt)
    if (!skip) {
        router.use(`/${fileWithOutExt}`, require(`./${fileWithOutExt}`))
        console.log('CARGAR RUTA ---->', fileWithOutExt)
    }
})


module.exports = router
