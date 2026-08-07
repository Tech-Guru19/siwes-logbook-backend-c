const connect = require("../../sqlConnection");

const AdminUpdate = async (req, res) => {
    try {
        const { type, id, data } = req.body;
        
        if (!type || !id || !data) {
            return res.status(400).json({ message: "Type, ID, and data are required" });
        }
        
        const connection = await connect();
        
        let table = "";
        let allowedFields = [];
        
        if (type === "students") {
            table = "Student_Table";
            allowedFields = ["Full_Name", "Matriculation_No", "email_address", "department"];
        } else if (type === "schools") {
            table = "Instituition_Table";
            allowedFields = ["Name", "Mail", "Location"];
        } else if (type === "organizations") {
            table = "Organization_Table";
            allowedFields = ["Name", "Email_Address", "Contact_Address"];
        } else {
            return res.status(400).json({ message: "Invalid type requested" });
        }
        
        // Build query dynamically based on allowed fields provided in data
        const updates = [];
        const values = [];
        
        Object.keys(data).forEach(key => {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(data[key]);
            }
        });
        
        if (updates.length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }
        
        const query = `UPDATE ${table} SET ${updates.join(', ')} WHERE id = ?`;
        values.push(id);
        
        const [result] = await connection.execute(query, values);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Record not found" });
        }
        
        res.status(200).json({ message: "Updated successfully", status: "OK" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during update" });
    }
};

module.exports = AdminUpdate;
