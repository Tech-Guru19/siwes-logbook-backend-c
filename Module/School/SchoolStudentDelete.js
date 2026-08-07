const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const SchoolStudentDelete = async (req, res) => {
    console.log("SchoolStudentDelete", req.body);
    const id = req.body?.id
    if (!id) {
        return res.status(400).json({ message: "Please provide student id" })
    }
    try {
        const command = 'DELETE FROM Student_Table WHERE id=?'
        await connection.execute(command, [id])
        res.status(200).json({ message: "Student deleted successfully", status: "OK" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error deleting student" })
    }
}

module.exports = SchoolStudentDelete
