const connect = require("../../sqlConnection");

const SubmitTicket = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const connection = await connect();
        
        const query = "INSERT INTO Support_Tickets_Table (name, email, subject, message) VALUES (?, ?, ?, ?)";
        await connection.execute(query, [name, email, subject, message]);
        
        res.status(200).json({ message: "Ticket submitted successfully", status: "OK" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error submitting ticket" });
    }
};

module.exports = SubmitTicket;
