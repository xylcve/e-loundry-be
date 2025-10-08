const allowedOrigins = (process.env.APP_ENV == 'PROD')
    ? [`http://localhost:${process.env.APP_PORT}`, 'https://dev.higenncy.com']
    : [`http://localhost:${process.env.APP_PORT}`, `http://localhost:4000`, `https://localhost:4000`]

module.exports = { allowedOrigins }