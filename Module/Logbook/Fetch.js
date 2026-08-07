const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const logbookFetch = async (req, res) => {
    console.log("logbookFetch", req.body);
    const student_id = req.body?.student_id
    const school_supervisor_id = req.body?.school_supervisor_id
    const org_supervisor_id = req.body?.org_supervisor_id
    
    if (!student_id && !school_supervisor_id && !org_supervisor_id) {
        return res.status(400).json({ message: "Please provide student_id, school_supervisor_id or org_supervisor_id" })
    }
    
    try {
        let command = ''
        let values = []
        
        if (student_id) {
            command = 'SELECT * FROM Logbook_Table WHERE student_id=? ORDER BY date DESC'
            values = [student_id]
        } else if (school_supervisor_id) {
            command = 'SELECT l.*, s.Full_Name as Student_Name, s.Matriculation_No FROM Logbook_Table l JOIN Student_Table s ON l.student_id = s.id WHERE s.School_Supervisor_Id=? ORDER BY l.date DESC'
            values = [school_supervisor_id]
        } else if (org_supervisor_id) {
            command = 'SELECT l.*, s.Full_Name as Student_Name, s.Matriculation_No FROM Logbook_Table l JOIN Student_Table s ON l.student_id = s.id WHERE s.Organization_Supervisor_Id=? ORDER BY l.date DESC'
            values = [org_supervisor_id]
        }
        
        const [query] = await connection.execute(command, values)
        res.status(200).json({ message: query, status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error fetching logbook entries" })
    }
}

module.exports = logbookFetch
