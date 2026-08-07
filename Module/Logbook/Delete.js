const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const logbookDelete = async (req, res) => {
    console.log("logbookDelete", req.body);
    const id = req.body?.id
    if (!id) {
        return res.status(400).json({ message: "Please provide logbook entry id" })
    }
    try {
        const checkCommand = 'SELECT org_supervisor_signed, date FROM Logbook_Table WHERE id=?'
        const [existing] = await connection.execute(checkCommand, [id])
        if (existing.length === 0) {
            return res.status(404).json({ message: "Logbook entry not found" })
        }
        if (existing[0]?.org_supervisor_signed === 1) {
            return res.status(400).json({ message: "Cannot delete logbook entry that has already been signed by supervisor" })
        }
        const logTime = new Date(existing[0]?.date).setHours(0, 0, 0, 0)
        const todayTime = new Date().setHours(0, 0, 0, 0)
        if (logTime < todayTime) {
            return res.status(400).json({ message: "Cannot delete logbook entry after the logged day has passed" })
        }
        
        const command = 'DELETE FROM Logbook_Table WHERE id=?'
        await connection.execute(command, [id])
        res.status(200).json({ message: "Logbook entry deleted successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error deleting logbook entry" })
    }
}

module.exports = logbookDelete
