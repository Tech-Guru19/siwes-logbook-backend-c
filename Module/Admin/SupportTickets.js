const connect = require("../../sqlConnection");

const FetchTickets = async (req, res) => {
    try {
        const connection = await connect();
        const query = "SELECT * FROM Support_Tickets_Table ORDER BY id DESC";
        const [results] = await connection.execute(query);
        
        res.status(200).json({ message: results, status: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching tickets" });
    }
};

const ResolveTicket = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: "Ticket ID is required" });
        }
        
        const connection = await connect();
        const query = "UPDATE Support_Tickets_Table SET status = 'Resolved' WHERE id = ?";
        const [result] = await connection.execute(query, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        
        res.status(200).json({ message: "Ticket marked as resolved", status: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error resolving ticket" });
    }
};

module.exports = { FetchTickets, ResolveTicket };
