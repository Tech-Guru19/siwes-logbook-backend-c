const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const updateDetails = async (req, res) => {
    console.log("updateDetails student", req.body);
    const { student_id, bank_name, account_number, account_name, acceptance_letter_url, itf_form8_url } = req.body

    if (!student_id) {
        return res.status(400).json({ message: "Please provide student_id" })
    }

    try {
        let command = "UPDATE Student_Table SET "
        let values = []
        let updates = []

        if (bank_name !== undefined) {
            updates.push("bank_name = ?")
            values.push(bank_name)
        }
        if (account_number !== undefined) {
            updates.push("account_number = ?")
            values.push(account_number)
        }
        if (account_name !== undefined) {
            updates.push("account_name = ?")
            values.push(account_name)
        }
        if (acceptance_letter_url !== undefined) {
            updates.push("acceptance_letter_url = ?")
            values.push(acceptance_letter_url)
        }
        if (itf_form8_url !== undefined) {
            updates.push("itf_form8_url = ?")
            values.push(itf_form8_url)
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" })
        }

        command += updates.join(", ") + " WHERE id = ?"
        values.push(student_id)

        await connection.execute(command, values)
        res.status(200).json({ message: "Details updated successfully", status: "OK" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error updating student details" })
    }
}

module.exports = updateDetails
