const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const logbookCreate = async (req, res) => {
    console.log("logbookCreate", req.body);
    const student_id = req.body?.student_id
    const date = req.body?.date
    const week_number = req.body?.week_number
    const activity_description = req.body?.activity_description
    const image_attachment = req.body?.image_attachment
    if (!student_id || !date || !week_number || !activity_description) {
        return res.status(400).json({ message: "Please provide student_id, date, week_number and activity_description" })
    }
    try {
        // Query student's SIWES timeline and supervisor assignments
        const [studentQuery] = await connection.execute('SELECT Start_Date, End_Date, School_Supervisor_Id, Organization_Supervisor_Id, Organization_Id FROM Student_Table WHERE id=?', [student_id]);
        if (studentQuery.length === 0) {
            return res.status(404).json({ message: "Student record not found" });
        }
        
        const { Start_Date, End_Date, School_Supervisor_Id, Organization_Supervisor_Id, Organization_Id } = studentQuery[0];
        if (!School_Supervisor_Id || !Organization_Supervisor_Id || !Organization_Id) {
            return res.status(400).json({ message: "Logbook entry blocked: You must be accepted by a company and assigned both school and company supervisors before you can write logbook entries." });
        }
        if (!Start_Date || !End_Date) {
            return res.status(400).json({ message: "Your SIWES start and end dates are not configured yet. Please contact your coordinator." });
        }
        
        const logTime = new Date(date).setHours(0, 0, 0, 0);
        const startTime = new Date(Start_Date).setHours(0, 0, 0, 0);
        const endTime = new Date(End_Date).setHours(0, 0, 0, 0);
        const todayTime = new Date().setHours(0, 0, 0, 0);
        
        if (logTime < startTime) {
            const formattedStart = new Date(Start_Date).toLocaleDateString();
            return res.status(400).json({ message: `Cannot submit logbook entry before your SIWES start date (${formattedStart}).` });
        }
        if (logTime > endTime) {
            const formattedEnd = new Date(End_Date).toLocaleDateString();
            return res.status(400).json({ message: `Cannot submit logbook entry after your SIWES end date (${formattedEnd}).` });
        }
        if (logTime > todayTime) {
            return res.status(400).json({ message: "Cannot submit a logbook entry for a future date." });
        }

        // Prevent duplicate logs for the same date
        const [dupQuery] = await connection.execute('SELECT id FROM Logbook_Table WHERE student_id=? AND DATE(date)=DATE(?)', [student_id, date]);
        if (dupQuery.length > 0) {
            return res.status(400).json({ message: "An entry has already been recorded for this date." });
        }

        const command = 'INSERT INTO Logbook_Table (student_id, date, week_number, activity_description, image_attachment) VALUES (?,?,?,?,?)'
        const values = [student_id, date, week_number, activity_description, image_attachment || null]
        const [result] = await connection.execute(command, values)
        res.status(200).json({ message: "Logbook entry created successfully", id: result?.insertId, status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error creating logbook entry" })
    }
}

module.exports = logbookCreate
