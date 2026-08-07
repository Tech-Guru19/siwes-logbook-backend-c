const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const organizationSearch = async (req, res) => {
    try {
        const queryVal = req.body?.query || ""
        const command = `
            SELECT id, Name, Location, Email_Address, Contact_Address 
            FROM Organization_Table 
            WHERE Name LIKE ? OR Location LIKE ? 
            LIMIT 10
        `
        const wildCard = `%${queryVal}%`
        const [query] = await connection.execute(command, [wildCard, wildCard])
        res.status(200).json({ message: query, status: "OK" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error searching organizations" })
    }
}

module.exports = organizationSearch
