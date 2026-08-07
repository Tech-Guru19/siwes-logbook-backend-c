const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const createLeave = async (req, res) => {
    const { student_id, start_date, end_date, reason } = req.body
    
    if (!student_id || !start_date || !end_date || !reason) {
        return res.status(400).json({ message: "Please provide all leave request details" })
    }

    try {
        // Find the org supervisor id for this student
        const [studentRes] = await connection.execute("SELECT Organization_Supervisor_Id FROM Student_Table WHERE id = ?", [student_id]);
        const org_supervisor_id = studentRes[0]?.Organization_Supervisor_Id || null;

        const command = "INSERT INTO Leave_Requests_Table (student_id, org_supervisor_id, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)"
        const values = [student_id, org_supervisor_id, start_date, end_date, reason]
        
        await connection.execute(command, values)
        res.status(200).json({ message: "Leave request submitted successfully", status: "OK" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error submitting leave request" })
    }
}

module.exports = createLeave
