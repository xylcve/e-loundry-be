require("dotenv").config()
const mysql = require("mysql2/promise");

const dbPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    namedPlaceholders: true,
    decimalNumbers: true,
     ssl: {
    rejectUnauthorized: true,
  },
})

module.exports = { dbPool }
