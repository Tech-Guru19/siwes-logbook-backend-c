require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");

const connectSql = async () => {
    console.log("avien");
    try {
        const connection = await mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                ca: fs.readFileSync('./ca.pem'),
                rejectUnauthorized: true
            }
        }
        )

        return connection

    } catch (error) {
        console.log(error);

    }
}
module.exports = connectSql