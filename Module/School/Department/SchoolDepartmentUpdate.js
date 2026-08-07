const connect = require("../../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const SchoolDepartmentUpdate = async (req, res) => {
    console.log("SchoolDepartmentUpdate", req.body);
    const id = req.body?.id
    const departmentName = req.body?.departmentName
    const facultyName = req.body?.facultyName
    const HODName = req.body?.HODName
    if (!id || !departmentName || !facultyName || !HODName) {
        return res.status(400).json({ message: "Please provide all parameters" })
    }
    try {
        const command = 'UPDATE Department_Table SET department_name=?, faculty_name=?, Hod_name=? WHERE id=?'
        const values = [departmentName, facultyName, HODName, id]
        await connection.execute(command, values)
        res.status(200).json({ message: "Department updated successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error updating department" })
    }
}

module.exports = SchoolDepartmentUpdate
