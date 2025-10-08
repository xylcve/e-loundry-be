require("dotenv").config();
const { format } = require("date-fns")
const fs = require('fs');
const path = require("path");

const LOG_TO_FILE = (process.env.LOGS == 'true')

const log = (message) => {
    const curr_date = Date.now()
    const text = `${format(curr_date, 'yyyy-MM-dd hh:mm:ss')}\t${message}`

    if (LOG_TO_FILE) {
        try {
            if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
                fs.mkdirSync(path.join(__dirname, '..', 'logs'), { recursive: true })
            }

            if (!fs.existsSync(path.join(__dirname, '..', 'logs', `${format(curr_date, 'yyyy-MM-dd')}.log`))) {
                fs.writeFileSync(path.join(__dirname, '..', 'logs', `${format(curr_date, 'yyyy-MM-dd')}.log`), `Log started at: ${format(curr_date, 'yyyy-MM-dd hh:mm:ss')}`)
            }

            fs.appendFile(
                path.join(__dirname, '..', 'logs', `${format(curr_date, 'yyyy-MM-dd')}.log`),
                `\n${text}`,
                (err) => {/* do nothing */ }
            )

            const last_date = new Date()
            last_date.setDate(last_date.getDate() - 30)
            if (fs.existsSync(path.join(__dirname, '..', 'logs', `${format(last_date, 'yyyy-MM-dd')}.log`))) {
                fs.unlinkSync(path.join(__dirname, '..', 'logs', `${format(last_date, 'yyyy-MM-dd')}.log`))
            }
        } catch (error) {
            // do nothing
        }
    }

    console.log(text)
}

const requestLogger = (req, res, next) => {
    const text = `${req.ip}\t${req.protocol}\t${req.method}\t : ${req.originalUrl}`
    res.ip = req.ip
    log(text)
    next()
}

module.exports = { log, requestLogger }