const { log } = require("../middleware/logger")

/**
 * 
 * @param {Response} res 
 * @param {number} status 
 * @param {string} message 
 * @param {string?} data 
 */
const response = (res, status, message, data) => {
    res.status(status).json({
        message: message,
        data: data
    })

    log(`${res.ip}\tresp \t${status}\t : ${message}`)
}

module.exports = { response }