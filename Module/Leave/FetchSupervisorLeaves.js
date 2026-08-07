const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const fetchSupervisorLeaves = async (req, res) => {
    const org_supervisor_id = req.body?.org_supervisor_id;
    
    if (!org_supervisor_id) {
        return res.status(400).json({ message: "Please provide org_supervisor_id" });
    }

    try {
        // Fetch all leave requests for this supervisor, joining with Student_Table to get student names
        const query = `
            SELECT l.*, s.Full_Name as student_name, s.Matriculation_No as matric_no
            FROM Leave_Requests_Table l
            JOIN Student_Table s ON l.student_id = s.id
            WHERE l.org_supervisor_id = ?
            ORDER BY l.created_at DESC
        `;
        
        const [results] = await connection.execute(query, [org_supervisor_id]);
        
        res.status(200).json({ message: results, status: "OK" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching leave requests" });
    }
}

module.exports = fetchSupervisorLeaves;
