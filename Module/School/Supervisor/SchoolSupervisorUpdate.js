const connect = require("../../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const SchoolSupervisorUpdate = async (req, res) => {
    console.log("SchoolSupervisorUpdate", req.body);
    const id = req.body?.id
    const Full_Name = req.body?.Full_Name
    const Email_Address = req.body?.Email_Address
    const department = req.body?.department
    if (!id || !Full_Name || !Email_Address || !department) {
        return res.status(400).json({ message: "Please provide all parameters" })
    }
    try {
        const command = 'UPDATE School_Supervisor SET Full_Name=?, Email_Address=?, department=? WHERE id=?'
        const values = [Full_Name, Email_Address, department, id]
        await connection.execute(command, values)
        res.status(200).json({ message: "Supervisor updated successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error updating supervisor" })
    }
}

module.exports = SchoolSupervisorUpdate
