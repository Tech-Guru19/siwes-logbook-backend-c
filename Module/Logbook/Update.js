const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const logbookUpdate = async (req, res) => {
    console.log("logbookUpdate", req.body);
    const id = req.body?.id
    const activity_description = req.body?.activity_description
    const image_attachment = req.body?.image_attachment
    if (!id || !activity_description) {
        return res.status(400).json({ message: "Please provide logbook entry id and activity_description" })
    }
    try {
        // Check if already signed or day has passed
        const checkCommand = 'SELECT org_supervisor_signed, date FROM Logbook_Table WHERE id=?'
        const [existing] = await connection.execute(checkCommand, [id])
        if (existing.length === 0) {
            return res.status(404).json({ message: "Logbook entry not found" })
        }
        if (existing[0]?.org_supervisor_signed === 1) {
            return res.status(400).json({ message: "Cannot edit logbook entry that has already been signed by supervisor" })
        }
        const logTime = new Date(existing[0]?.date).setHours(0, 0, 0, 0)
        const todayTime = new Date().setHours(0, 0, 0, 0)
        if (logTime < todayTime) {
            return res.status(400).json({ message: "Cannot edit logbook entry after the logged day has passed" })
        }
        
        const command = 'UPDATE Logbook_Table SET activity_description=?, image_attachment=? WHERE id=?'
        const values = [activity_description, image_attachment || null, id]
        await connection.execute(command, values)
        res.status(200).json({ message: "Logbook entry updated successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error updating logbook entry" })
    }
}

module.exports = logbookUpdate
