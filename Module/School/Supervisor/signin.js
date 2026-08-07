const connect = require("../../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const schoolSupervisorSignin = async(req, res)=>{
    console.log("schoolSupervisorSignin", req.body);
    const email_address = req.body?.email_address
    const password = req.body?.password
    if (!email_address || !password) {
        return res.status(400).json({message: "Please input all fields"})
    }
    try {
        const command = 'SELECT * FROM `School_Supervisor` WHERE Email_Address=?'
        const value = [email_address]
        const [query] = await connection.execute(command, value)
        if (query.length == 0) {
            return res.status(400).json({message: "No supervisor account found with this email address"})
        }
        if (!query[0]?.password || query[0]?.password.toString().trim() === "") {
            return res.status(400).json({message: "Supervisor account not activated yet. Please set up your password via the activation/signup page."})
        }
        if (query[0]?.password != password) {
            return res.status(400).json({message: "Incorrect password"})
        }
        res.status(200).json({message: {...query[0], password: null}, status: "OK"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error signing in supervisor"})
    }
}

module.exports = schoolSupervisorSignin
