const connect = require("../../../sqlConnection")
const crypto = require("crypto")
const mailer = require("../../../Mailer")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const schoolCreateSupervisor = async(req, res)=>{
    console.log("create school supervisor",req.body);
    const Full_Name = req.body?.Full_Name
    const Email_Address = req.body?.Email_Address
    const Instituition_Id = req.body?.Instituition_Id
    const department = req.body.department
    if (!Full_Name || !Email_Address || !Instituition_Id ||!department) {        
            return res.status(400).json({message: "Please provide all parameters"})
    }
    try {
        const command = 'INSERT INTO  School_Supervisor (Instituition_Id,department,Full_Name, Email_Address) VALUES (?,?,?,?)'
        const values = [Instituition_Id, department, Full_Name, Email_Address]
        const [result] = await connection.execute(command, values)
        res.status(200).json({message: result?.insertId})
    } catch (error) {
        if (error?.sqlMessage.includes("Duplicate entry")) {
            res.status(501).json({message: "Email address is already registered"})
        }
        res.status(501).json({message: error})
        console.log(error);
    }
}

module.exports = schoolCreateSupervisor