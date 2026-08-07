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
const schoolStudentFetch = async(req, res) =>{
    console.log("schoolStudentFetch", req.body);
    const id = req.body?.id
    if (!id) {
        return res.status(400).json({Message: "Error fetching students"})
    }
    const command = 'SELECT * FROM `Student_Table` WHERE Instituition_Id=?'
    const value = [id]
    const [query] = await connection.execute(command, value)
    console.log(query);
    res.status(201).json({message: query, status: "OK"})
}
module.exports = schoolStudentFetch