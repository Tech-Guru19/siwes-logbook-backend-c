const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const updateLeaveStatus = async (req, res) => {
    const { leave_id, status, org_supervisor_id } = req.body;
    
    if (!leave_id || !status || !org_supervisor_id) {
        return res.status(400).json({ message: "Please provide leave_id, status, and org_supervisor_id" });
    }

    try {
        // Fetch the leave request
        const [leaveRes] = await connection.execute("SELECT * FROM Leave_Requests_Table WHERE id = ?", [leave_id]);
        if (leaveRes.length === 0) {
            return res.status(404).json({ message: "Leave request not found" });
        }
        
        const leaveReq = leaveRes[0];
        
        // Ensure the supervisor is assigned to this student (or owns this request)
        if (leaveReq.org_supervisor_id !== org_supervisor_id) {
            return res.status(403).json({ message: "Unauthorized to manage this leave request" });
        }

        // Update the leave status
        await connection.execute("UPDATE Leave_Requests_Table SET status = ? WHERE id = ?", [status, leave_id]);

        // If approved, create daily logbooks for each weekday in the date range
        if (status === "approved") {
            const startDate = new Date(leaveReq.start_date);
            const endDate = new Date(leaveReq.end_date);
            const student_id = leaveReq.student_id;
            
            // Get student start date to calculate week number
            const [studentRes] = await connection.execute("SELECT Start_Date FROM Student_Table WHERE id = ?", [student_id]);
            const programStartDate = studentRes.length > 0 ? new Date(studentRes[0].Start_Date) : new Date();

            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                // Skip weekends (Saturday = 6, Sunday = 0)
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    const logDate = currentDate.toISOString().split('T')[0];
                    
                    // Calculate week number
                    const diffTime = currentDate - programStartDate;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    let week_number = Math.floor(diffDays / 7) + 1;
                    if (week_number < 1) week_number = 1;
                    
                    const activity = `LEAVE: ${leaveReq.reason}`;
                    const comment = "Approved Leave";
                    const rating = 5; // Default full rating for leave days

                    // Insert if not already exists for this date
                    const [dupCheck] = await connection.execute("SELECT id FROM Logbook_Table WHERE student_id=? AND DATE(date)=?", [student_id, logDate]);
                    if (dupCheck.length === 0) {
                        await connection.execute(
                            "INSERT INTO Logbook_Table (student_id, date, week_number, activity_description, org_supervisor_signed, org_supervisor_comment, org_supervisor_rating) VALUES (?, ?, ?, ?, ?, ?, ?)",
                            [student_id, logDate, week_number, activity, 1, comment, rating]
                        );
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        res.status(200).json({ message: "Leave status updated successfully", status: "OK" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating leave status" });
    }
}

module.exports = updateLeaveStatus;
