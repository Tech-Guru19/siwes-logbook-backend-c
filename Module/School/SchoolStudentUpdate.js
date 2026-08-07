const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const SchoolStudentUpdate = async (req, res) => {
    console.log("SchoolStudentUpdate", req.body);
    const id = req.body?.id
    const Full_Name = req.body?.Full_Name
    const email_address = req.body?.email_address
    const Matriculation_No = req.body?.Matriculation_No
    const department = req.body?.department
    const Start_Date = req.body?.Start_Date
    const End_Date = req.body?.End_Date
    if (!id || !Full_Name || !email_address || !Matriculation_No || !department || !Start_Date || !End_Date) {
        return res.status(400).json({ message: "Please provide all parameters" })
    }
    try {
        const command = 'UPDATE Student_Table SET Full_Name=?, email_address=?, Matriculation_No=?, department=?, Start_Date=?, End_Date=? WHERE id=?'
        const values = [Full_Name, email_address, Matriculation_No, department, Start_Date, End_Date, id]
        await connection.execute(command, values)
        res.status(200).json({ message: "Student updated successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error updating student" })
    }
}

module.exports = SchoolStudentUpdate
