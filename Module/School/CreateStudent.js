const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const schoolCreateStudent = async (req, res) => {
    console.log("schoolCreateStudent", req.body);
    const Full_Name = req.body?.Full_Name
    const Instituition_Id = req.body?.Instituition_Id
    const School_Supervisor_Id = req.body?.School_Supervisor_Id
    const email_address = req.body?.email_address
    const Matriculation_No = req.body?.Matriculation_No
    const department = req.body?.department
    const Instituition_Mail = req.body?.Instituition_Mail
    const Start_Date = req.body?.Start_Date
    const End_Date = req.body?.End_Date
    if (!Full_Name || !Instituition_Id || !School_Supervisor_Id || !email_address || !Matriculation_No
        || !department ||! Instituition_Mail ||!Start_Date || !End_Date) {
        return res.status(400).json({ message: "Please provide all parameters" })
    }
    try {
        const command = 'INSERT INTO   Student_Table (Full_Name,Instituition_Id, School_Supervisor_Id, email_address, Matriculation_No, department, Instituition_Mail, Start_Date, End_Date) VALUES (?,?,?,?,?,?,?,?,?)'
        const values = [Full_Name, Instituition_Id, School_Supervisor_Id, email_address, Matriculation_No, department, Instituition_Mail, Start_Date, End_Date]
        const [result] = await connection.execute(command, values)
        res.status(200).json({ message: result })
    } catch (error) {
        if (error?.sqlMessage.includes("Duplicate entry")) {
            res.status(501).json({ message: "Email address is already registered" })
        }
        res.status(501).json({ message: error })
        console.log(error);
    }
}

module.exports = schoolCreateStudent