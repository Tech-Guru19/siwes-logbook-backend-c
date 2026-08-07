const mysql = require("mysql2/promise");

const runUpdate = async () => {
    try {
        const connection = await mysql.createConnection({
            user: "root",
            password: "",
            host: "localhost",
            database: "ethereal_company"
        });

        console.log("Adding columns to Student_Table...");
        
        try {
            await connection.execute(`
                ALTER TABLE Student_Table
                ADD COLUMN bank_name VARCHAR(255) NULL,
                ADD COLUMN account_number VARCHAR(255) NULL,
                ADD COLUMN account_name VARCHAR(255) NULL,
                ADD COLUMN acceptance_letter_url VARCHAR(255) NULL,
                ADD COLUMN itf_form8_url VARCHAR(255) NULL
            `);
            console.log("Added columns successfully.");
        } catch (e) {
            console.log("Error adding columns (might already exist):", e.message);
        }

        console.log("Creating Leave_Requests_Table...");
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Leave_Requests_Table (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id BIGINT UNSIGNED NOT NULL,
                org_supervisor_id INT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                reason TEXT NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES Student_Table(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Leave_Requests_Table created successfully.");

        await connection.end();
        console.log("Done.");
    } catch (error) {
        console.error("Connection failed:", error);
    }
};

runUpdate();
