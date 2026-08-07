const connect = require("../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const organizationSupervisorSignin = async(req, res)=>{
    console.log("organizationSupervisorSignin", req.body);
    const email_address = req.body?.email_address
    const password = req.body?.password
    if (!email_address || !password) {
        return res.status(400).json({Message: "Please input all value"})
    }
    try {
        const command = 'SELECT * FROM `Organization_Supervisor` WHERE Email_Address=?'
        const value = [email_address]
        const [query] = await connection.execute(command, value)
        console.log(query);
        if (query.length == 0) {
            return res.status(400).json({message: "No account found with the email address"})
        }
        if (!query[0]?.password) {
            return res.status(400).json({message: "Sign up your account to have access to login"})
        }
        if (query[0]?.password != password) {
            return res.status(400).json({message: "incorrect password"})
        }
        res.status(201).json({message: {...query[0], password: null}, status: "OK"})
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Error signing in"})
    }
}
module.exports = organizationSupervisorSignin
