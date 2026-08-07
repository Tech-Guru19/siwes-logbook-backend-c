const connect = require("../../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const SchoolDepartmentAdd = async (req, res) => {
    console.log("SchoolDepartmentAdd", req.body);
    const departmentName = req.body?.departmentName
    const instituitionId = req.body?.instituitionId
    const facultyName = req.body?.facultyName
    const HODName = req.body?.HODName
    if (!departmentName || !instituitionId || !facultyName || !HODName) {
        return res.status(400).json({ message: "Please provide all parameters" })
    }
    try {
        const command = 'INSERT INTO   Department_Table (instituition_id,department_name, faculty_name, Hod_name) VALUES (?,?,?,?)'
        const values = [instituitionId, departmentName, facultyName, HODName]
        const [result] = await connection.execute(command, values)
        res.status(200).json({ message: result?.insertId})
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error adding department" })
    }
}

module.exports = SchoolDepartmentAdd