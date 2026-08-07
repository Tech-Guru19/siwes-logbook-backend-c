const connect = require("../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
    console.log("connection live on signup");
})
.catch((error)=>{
    console.log(error);
})
const studentSignin = async(req, res) =>{
    console.log("studentSignim", req.body);
    const email_address = req.body?.email_address
    const password = req.body?.password
    if (!email_address || !password) {
        return res.status(400).json({Message: "Please input all value"})
    }
    const command = 'SELECT * FROM `Student_Table` WHERE email_address=?'
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
}
module.exports = studentSignin