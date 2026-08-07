const connect = require("../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const studentProfile = async(req, res)=>{
    console.log("studentProfile", req.body);
    const id = req.body?.id
    if (!id) {
        return res.status(400).json({Message: "Please provide student id"})
    }
    try {
        const command = 'SELECT * FROM `Student_Table` WHERE id=?'
        const value = [id]
        const [query] = await connection.execute(command, value)
        if (query.length == 0) {
            return res.status(400).json({message: "No student found"})
        }
        res.status(201).json({message: {...query[0], password: null}, status: "OK"})
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Error fetching profile"})
    }
}
module.exports = studentProfile
