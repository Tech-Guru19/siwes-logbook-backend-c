const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const placementStatus = async (req, res) => {
    console.log("placementStatus", req.body);
    const placement_id = req.body?.placement_id || req.body?.placementId
    const rawStatus = req.body?.status
    if (!placement_id || !rawStatus) {
        return res.status(400).json({ message: "Please provide placement_id and status" })
    }
    const status = rawStatus.toLowerCase()
    if (status !== 'approved' && status !== 'rejected') {
        return res.status(400).json({ message: "Invalid status value. Must be 'approved' or 'rejected'" })
    }
    try {
        const command = 'UPDATE Placement_Request_Table SET status=?, response_date=CURRENT_TIMESTAMP WHERE id=?'
        const values = [status, placement_id]
        await connection.execute(command, values)

        // Automatically update Student_Table's Organization_Id
        if (status === 'approved') {
            const [placement] = await connection.execute('SELECT student_id, organization_id FROM Placement_Request_Table WHERE id=?', [placement_id]);
            if (placement.length > 0) {
                const { student_id, organization_id } = placement[0];
                await connection.execute('UPDATE Student_Table SET Organization_Id=? WHERE id=?', [organization_id, student_id]);
            }
        } else if (status === 'rejected') {
            const [placement] = await connection.execute('SELECT student_id FROM Placement_Request_Table WHERE id=?', [placement_id]);
            if (placement.length > 0) {
                const { student_id } = placement[0];
                await connection.execute('UPDATE Student_Table SET Organization_Id=NULL, Organization_Supervisor_Id=NULL WHERE id=?', [student_id]);
            }
        }

        res.status(200).json({ message: `Placement request status updated to ${status} successfully`, status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error updating placement status" })
    }
}

module.exports = placementStatus
