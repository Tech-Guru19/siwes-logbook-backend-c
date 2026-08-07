const connect = require("./sqlConnection");

async function setupAdmin() {
    try {
        const connection = await connect();
        
        console.log("Creating SuperAdmin_Table...");
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS SuperAdmin_Table (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email_address VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        const admins = [
            { email: "israeladekola8@gmail.com", password: "Adekola@Israel2020" },
            { email: "chizaramesther298@gmail.com", password: "Irene@19" }
        ];

        console.log("Inserting admins...");
        for (const admin of admins) {
            // Check if exists
            const [rows] = await connection.execute('SELECT * FROM SuperAdmin_Table WHERE email_address = ?', [admin.email]);
            if (rows.length === 0) {
                await connection.execute('INSERT INTO SuperAdmin_Table (email_address, password) VALUES (?, ?)', [admin.email, admin.password]);
                console.log(`Inserted admin: ${admin.email}`);
            } else {
                console.log(`Admin already exists: ${admin.email}`);
            }
        }
        
        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

setupAdmin();
