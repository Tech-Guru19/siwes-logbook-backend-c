const connect = require("../../sqlConnection");

const DashboardStats = async (req, res) => {
    try {
        const connection = await connect();
        
        // Count Students
        const [studentCount] = await connection.execute('SELECT COUNT(*) as total FROM Student_Table');
        
        // Count Organizations
        const [orgCount] = await connection.execute('SELECT COUNT(*) as total FROM Organization_Table');
        
        // Count Schools
        const [schoolCount] = await connection.execute('SELECT COUNT(*) as total FROM Instituition_Table');

        res.status(200).json({
            message: {
                students: studentCount[0].total,
                organizations: orgCount[0].total,
                schools: schoolCount[0].total
            },
            status: "OK"
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};

module.exports = DashboardStats;
