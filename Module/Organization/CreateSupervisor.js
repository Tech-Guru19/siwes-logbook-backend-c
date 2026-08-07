const connect = require("../../sqlConnection")
const crypto = require("crypto")
const mailer = require("../../Mailer")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const organizationCreateSupervisor = async (req, res) => {
    console.log("create school supervisor", req.body);
    const Full_Name = req.body?.Full_Name
    const Email_Address = req.body?.Email_Address
    const Organization_Mail = req.body?.Organization_Mail
    const Organization_Id = req.body?.Organization_Id
    if (!Full_Name || !Email_Address || !Organization_Id || !Organization_Mail) {
        return res.status(400).json({ message: "Please provide all parameters" })
    }
    try {
        const command = 'INSERT INTO  Organization_Supervisor (Organization_Id, 	Organization_Mail,Full_Name, Email_Address) VALUES (?,?,?,?)'
        const values = [Organization_Id, Organization_Mail, Full_Name, Email_Address]
        const [result] = await connection.execute(command, values)
        res.status(200).json({ message: "Supervisor created successfully" })
    } catch (error) {
        if (error?.sqlMessage.includes("Duplicate entry")) {
            res.status(501).json({ message: "Email address is already registered" })
        }
        res.status(501).json({ message: error })
        console.log(error);
    }
}

module.exports = organizationCreateSupervisor