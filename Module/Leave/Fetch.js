const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const fetchLeave = async (req, res) => {
    const { student_id } = req.body
    
    if (!student_id) {
        return res.status(400).json({ message: "Please provide student_id" })
    }

    try {
        const command = "SELECT * FROM Leave_Requests_Table WHERE student_id = ? ORDER BY created_at DESC"
        const [query] = await connection.execute(command, [student_id])
        res.status(200).json({ message: query, status: "OK" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching leave requests" })
    }
}

module.exports = fetchLeave
