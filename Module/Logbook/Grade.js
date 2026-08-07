const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const logbookGrade = async (req, res) => {
    console.log("logbookGrade", req.body);
    const id = req.body?.id
    const school_supervisor_grade = req.body?.school_supervisor_grade
    const school_supervisor_id = req.body?.school_supervisor_id
    if (!id || !school_supervisor_grade || !school_supervisor_id) {
        return res.status(400).json({ message: "Please provide logbook entry id, grade, and school_supervisor_id" })
    }
    try {
        // First verify the logbook belongs to a student assigned to this school supervisor
        const checkCommand = `
            SELECT l.id FROM Logbook_Table l
            JOIN Student_Table s ON l.student_id = s.id
            WHERE l.id = ? AND s.School_Supervisor_Id = ?
        `
        const [checkResult] = await connection.execute(checkCommand, [id, school_supervisor_id])
        if (checkResult.length === 0) {
            return res.status(403).json({ message: "Unauthorized: You are not assigned to grade this student." })
        }

        const command = 'UPDATE Logbook_Table SET school_supervisor_grade=? WHERE id=?'
        const values = [school_supervisor_grade, id]
        await connection.execute(command, values)
        res.status(200).json({ message: "Logbook entry graded successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error grading logbook entry" })
    }
}

module.exports = logbookGrade
