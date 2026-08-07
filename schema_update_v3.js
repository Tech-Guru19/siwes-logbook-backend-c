const connectSql = require('./sqlConnection');

const run = async () => {
    const db = await connectSql();

    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS \`Support_Tickets_Table\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`user_type\` VARCHAR(50) NULL,
                \`user_email\` VARCHAR(255) NULL,
                \`issue_type\` VARCHAR(100) NOT NULL,
                \`subject\` VARCHAR(255) NOT NULL,
                \`description\` TEXT NOT NULL,
                \`status\` VARCHAR(50) DEFAULT 'Open',
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Created Support_Tickets_Table successfully.");
    } catch(err) {
        console.log("Error creating Support_Tickets_Table:", err.message);
    }

    db.end();
};

run();
