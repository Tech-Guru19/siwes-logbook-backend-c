const connect = require("../../sqlConnection");

const AdminDelete = async (req, res) => {
    try {
        const { type, id } = req.body;
        
        if (!type || !id) {
            return res.status(400).json({ message: "Type and ID are required" });
        }
        
        const connection = await connect();
        let query = "";
        
        if (type === "students") {
            query = "DELETE FROM Student_Table WHERE id = ?";
        } else if (type === "schools") {
            query = "DELETE FROM Instituition_Table WHERE id = ?";
        } else if (type === "organizations") {
            query = "DELETE FROM Organization_Table WHERE id = ?";
        } else {
            return res.status(400).json({ message: "Invalid type requested" });
        }
        
        const [result] = await connection.execute(query, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Record not found" });
        }
        
        res.status(200).json({ message: "Deleted successfully", status: "OK" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during deletion" });
    }
};

module.exports = AdminDelete;
