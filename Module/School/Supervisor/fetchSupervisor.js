const connect = require("../../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})
const SchoolFetchSupervisor = async(req, res) =>{
    console.log("SchoolFetchSupervisor", req.body);
    const id = req.body?.id
    if (!id) {
        return res.status(400).json({Message: "Error fetching supervisors"})
    }
    try {
        const command = 'SELECT * FROM `School_Supervisor` WHERE Instituition_Id=?'
        const value = [id]
        const [query] = await connection.execute(command, value)
        console.log(query);
        res.status(201).json({message: query, status: "OK"})
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Error fetching supervisors"})
    }
}
module.exports = SchoolFetchSupervisor