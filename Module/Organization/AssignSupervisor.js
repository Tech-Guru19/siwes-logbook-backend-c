const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const assignSupervisor = async (req, res) => {
    console.log("assignSupervisor", req.body);
    const student_id = req.body?.student_id || req.body?.studentId
    const supervisor_id = req.body?.supervisor_id || req.body?.supervisorId
    
    if (!student_id) {
        return res.status(400).json({ message: "Please provide student_id" })
    }
    
    try {
        const command = 'UPDATE Student_Table SET Organization_Supervisor_Id=? WHERE id=?'
        const values = [supervisor_id || null, student_id]
        await connection.execute(command, values)
        res.status(200).json({ message: "Supervisor assigned successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error assigning supervisor" })
    }
}

module.exports = assignSupervisor
