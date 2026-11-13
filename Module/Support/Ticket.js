const connection = require("../../sqlConnection");

const submitTicket = async (req, res) => {
    try {
        const {
            user_type,
            user_email,
            issue_type,
            subject,
            description,
            name,
            email,
            message
        } = req.body;

        const resolvedSubject = (subject || "").trim();
        const resolvedMessage = (description || message || "").trim();
        const resolvedEmail = (user_email || email || "").trim() || null;
        const resolvedName = (name || "").trim() || (user_type ? `${user_type} User` : "Anonymous User");
        const resolvedType = (user_type || "").trim() || "Guest";
        const resolvedIssue = (issue_type || "").trim() || "Technical Issue";

        if (!resolvedSubject || !resolvedMessage) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide both a subject and a description for your ticket." 
            });
        }

        const command = `
            INSERT INTO Support_Tickets_Table 
            (user_type, user_email, issue_type, name, email, subject, description, message, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            resolvedType,
            resolvedEmail,
            resolvedIssue,
            resolvedName,
            resolvedEmail,
            resolvedSubject,
            resolvedMessage,
            resolvedMessage,
            'Pending'
        ];

        const [result] = await connection.execute(command, values);

        if (result && result.affectedRows > 0) {
            return res.status(200).json({ 
                success: true, 
                message: "Support ticket submitted successfully.",
                ticketId: result.insertId
            });
        } else {
            return res.status(500).json({ 
                success: false, 
                message: "Failed to submit ticket. Please try again." 
            });
        }
    } catch (err) {
        console.error("Support Ticket Error:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error submitting ticket." 
        });
    }
};

module.exports = { submitTicket };
