const connect = require("../../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const SchoolSupervisorDelete = async (req, res) => {
    console.log("SchoolSupervisorDelete", req.body);
    const id = req.body?.id
    if (!id) {
        return res.status(400).json({ message: "Please provide supervisor id" })
    }
    try {
        const command = 'DELETE FROM School_Supervisor WHERE id=?'
        await connection.execute(command, [id])
        res.status(200).json({ message: "Supervisor deleted successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error deleting supervisor" })
    }
}

module.exports = SchoolSupervisorDelete
