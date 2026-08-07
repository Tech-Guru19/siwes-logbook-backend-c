const connect = require('./sqlConnection');

async function migrate() {
    const connection = await connect();
    try {
        console.log("Starting DB migration...");

        // Support Tickets Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Support_Tickets_Table (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        console.log("Support_Tickets_Table created.");

        // Fix Foreign Keys for Student_Table
        await connection.query('ALTER TABLE Student_Table DROP FOREIGN KEY student_to_organization;');
        await connection.query('ALTER TABLE Student_Table ADD CONSTRAINT student_to_organization FOREIGN KEY (Organization_Id) REFERENCES Organization_Table (id) ON DELETE CASCADE;');
        
        await connection.query('ALTER TABLE Student_Table DROP FOREIGN KEY student_to_organization_supervisor;');
        await connection.query('ALTER TABLE Student_Table ADD CONSTRAINT student_to_organization_supervisor FOREIGN KEY (Organization_Supervisor_Id) REFERENCES Organization_Supervisor (id) ON DELETE CASCADE;');

        await connection.query('ALTER TABLE Student_Table DROP FOREIGN KEY student_to_school_supervisor;');
        await connection.query('ALTER TABLE Student_Table ADD CONSTRAINT student_to_school_supervisor FOREIGN KEY (School_Supervisor_Id) REFERENCES School_Supervisor (id) ON DELETE CASCADE;');

        console.log("Student_Table constraints updated.");

        // Fix Foreign Keys for School_Supervisor
        await connection.query('ALTER TABLE School_Supervisor DROP FOREIGN KEY supervisor_to_school;');
        await connection.query('ALTER TABLE School_Supervisor ADD CONSTRAINT supervisor_to_school FOREIGN KEY (Instituition_Id) REFERENCES Instituition_Table (id) ON DELETE CASCADE;');

        console.log("School_Supervisor constraints updated.");

        // Fix Foreign Keys for Organization_Supervisor
        try {
            await connection.query('ALTER TABLE Organization_Supervisor DROP FOREIGN KEY org_sup_to_org;');
            await connection.query('ALTER TABLE Organization_Supervisor ADD CONSTRAINT org_sup_to_org FOREIGN KEY (Organization_Id) REFERENCES Organization_Table (id) ON DELETE CASCADE;');
            console.log("Organization_Supervisor constraints updated.");
        } catch(e) {
            console.log("Organization_Supervisor constraints might already be CASCADE or named differently. Skipping...", e.message);
        }

        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit(0);
    }
}

migrate();
