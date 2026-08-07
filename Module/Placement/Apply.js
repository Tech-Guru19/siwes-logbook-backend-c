const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const placementApply = async (req, res) => {
    console.log("placementApply", req.body);
    const student_id = req.body?.student_id
    const organization_id = req.body?.organization_id
    if (!student_id || !organization_id) {
        return res.status(400).json({ message: "Please provide student id and organization id" })
    }
    try {
        // Check if there is an active/pending placement request already
        const checkCommand = 'SELECT * FROM Placement_Request_Table WHERE student_id=? AND (status=? OR status=?)'
        const [existing] = await connection.execute(checkCommand, [student_id, 'pending', 'approved'])
        if (existing.length > 0) {
            return res.status(400).json({ message: "You already have a pending or approved placement request" })
        }
        
        const command = 'INSERT INTO Placement_Request_Table (student_id, organization_id, status) VALUES (?,?,?)'
        const values = [student_id, organization_id, 'pending']
        const [result] = await connection.execute(command, values)
        res.status(200).json({ message: "Placement request submitted successfully", id: result?.insertId, status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error submitting placement request" })
    }
}

module.exports = placementApply
