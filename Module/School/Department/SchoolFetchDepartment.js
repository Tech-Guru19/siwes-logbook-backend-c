const connect = require("../../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
    console.log("connection live on signup");
})
.catch((error)=>{
    console.log(error);
})
const SchoolFetchDepartment = async(req, res) =>{
    console.log("SchoolFetchDepartment", req.body);
    const id = req.body?.id
    if (!id) {
        return res.status(400).json({Message: "Error fetching students"})
    }
    try {
        const command = 'SELECT * FROM `Department_Table` WHERE Instituition_Id=?'
        const value = [id]
        const [query] = await connection.execute(command, value)
        console.log(query);
        res.status(201).json({message: query, status: "OK"})
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Error fetching department"})
    }
}
module.exports = SchoolFetchDepartment