const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const organizationSupervisorUpdate = async (req, res) => {
    console.log("organizationSupervisorUpdate", req.body);
    const id = req.body?.id
    const Full_Name = req.body?.Full_Name
    const Email_Address = req.body?.Email_Address
    const department = req.body?.department
    const capacity = req.body?.capacity
    const focus_areas = req.body?.focus_areas
    if (!id || !Full_Name || !Email_Address) {
        return res.status(400).json({ message: "Please provide id, Full Name and Email" })
    }
    try {
        const command = 'UPDATE Organization_Supervisor SET Full_Name=?, Email_Address=?, department=?, capacity=?, focus_areas=? WHERE id=?'
        const values = [Full_Name, Email_Address, department || null, capacity || 5, focus_areas || null, id]
        await connection.execute(command, values)
        res.status(200).json({ message: "Supervisor updated successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error updating supervisor" })
    }
}

module.exports = organizationSupervisorUpdate
