const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const placementFetch = async (req, res) => {
    console.log("placementFetch", req.body);
    const organization_id = req.body?.organization_id || req.body?.organizationId
    const student_id = req.body?.student_id || req.body?.studentId
    if (!organization_id && !student_id) {
        return res.status(400).json({ message: "Please provide organization_id or student_id" })
    }
    try {
        let command = ''
        let values = []
        if (organization_id) {
            command = 'SELECT p.*, s.Full_Name as Student_Name, s.Matriculation_No, s.email_address as Student_Email, s.department, s.Start_Date, s.End_Date FROM Placement_Request_Table p JOIN Student_Table s ON p.student_id = s.id WHERE p.organization_id=?'
            values = [organization_id]
        } else {
            command = 'SELECT p.*, o.Name as Organization_Name, o.Email_Address as Organization_Email FROM Placement_Request_Table p JOIN Organization_Table o ON p.organization_id = o.id WHERE p.student_id=?'
            values = [student_id]
        }
        const [query] = await connection.execute(command, values)
        res.status(200).json({ message: query, status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error fetching placement requests" })
    }
}

module.exports = placementFetch
