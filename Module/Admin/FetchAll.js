const connect = require("../../sqlConnection");

const FetchAll = async (req, res) => {
    try {
        const { type } = req.body;
        
        if (!type) {
            return res.status(400).json({ message: "Type is required (students, schools, organizations)" });
        }
        
        const connection = await connect();
        
        let query = "";
        
        if (type === "students") {
            query = "SELECT id, Full_Name, Matriculation_No, email_address, department FROM Student_Table ORDER BY id DESC";
        } else if (type === "schools") {
            query = "SELECT id, Name, Mail, Location FROM Instituition_Table ORDER BY id DESC"; // no created_at in Instituition_Table
        } else if (type === "organizations") {
            query = "SELECT id, Name, Email_Address, Contact_Address FROM Organization_Table ORDER BY id DESC";
        } else {
            return res.status(400).json({ message: "Invalid type requested" });
        }
        
        const [results] = await connection.execute(query);
        
        res.status(200).json({ message: results, status: "OK" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching entities" });
    }
};

module.exports = FetchAll;
