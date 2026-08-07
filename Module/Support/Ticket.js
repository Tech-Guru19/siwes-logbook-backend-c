const connectSql = require("../../sqlConnection");

const submitTicket = async (req, res) => {
    try {
        const { user_type, user_email, issue_type, subject, description } = req.body;

        if (!issue_type || !subject || !description) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const db = await connectSql();
        const command = "INSERT INTO Support_Tickets_Table (user_type, user_email, issue_type, subject, description) VALUES (?, ?, ?, ?, ?)";
        const values = [user_type || null, user_email || null, issue_type, subject, description];

        const [result] = await db.query(command, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ success: true, message: "Support ticket submitted successfully." });
        } else {
            return res.status(500).json({ success: false, message: "Failed to submit ticket." });
        }
    } catch (err) {
        console.error("Support Ticket Error:", err);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports = { submitTicket };
