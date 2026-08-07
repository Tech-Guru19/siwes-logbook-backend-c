const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const logbookSign = async (req, res) => {
    console.log("logbookSign", req.body);
    const id = req.body?.id
    const org_supervisor_comment = req.body?.org_supervisor_comment
    const org_supervisor_rating = req.body?.org_supervisor_rating
    const org_supervisor_id = req.body?.org_supervisor_id
    if (!id || !org_supervisor_id) {
        return res.status(400).json({ message: "Please provide logbook entry id and org_supervisor_id" })
    }
    try {
        // First verify the logbook belongs to a student assigned to this supervisor
        const checkCommand = `
            SELECT l.id FROM Logbook_Table l
            JOIN Student_Table s ON l.student_id = s.id
            WHERE l.id = ? AND s.Organization_Supervisor_Id = ?
        `
        const [checkResult] = await connection.execute(checkCommand, [id, org_supervisor_id])
        if (checkResult.length === 0) {
            return res.status(403).json({ message: "Unauthorized: You are not assigned to this student." })
        }

        const command = 'UPDATE Logbook_Table SET org_supervisor_signed=1, org_supervisor_comment=?, org_supervisor_rating=? WHERE id=?'
        const values = [org_supervisor_comment || null, org_supervisor_rating || null, id]
        await connection.execute(command, values)
        res.status(200).json({ message: "Logbook entry signed off successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error signing off logbook entry" })
    }
}

module.exports = logbookSign
