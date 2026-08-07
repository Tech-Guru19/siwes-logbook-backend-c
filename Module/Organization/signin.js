const connect = require("../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const organizationSignin = async(req, res)=>{
    console.log("organizationSignin", req.body);
    const Email_Address = req.body?.Email_Address
    const password = req.body?.password
    if (!Email_Address || !password) {
        return res.status(400).json({Message: "Please input all value"})
    }
    try {
        const command = 'SELECT * FROM `Organization_Table` WHERE Email_Address=?'
        const value = [Email_Address]
        const [query] = await connection.execute(command, value)
        console.log(query);
        if (query.length == 0) {
            return res.status(400).json({message: "No account found with the email address"})
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
module.exports = organizationSignin
