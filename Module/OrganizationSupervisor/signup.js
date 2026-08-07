const connect = require("../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const organizationSupervisorSignup = async(req, res)=>{
    console.log("organizationSupervisorSignup", req.body);
    const email_address = req.body?.email_address
    const password = req.body?.password
    const Contact_Adress = req.body?.Contact_Adress
    const Profile_Img = req.body?.Profile_Img
    const otp_code = req.body?.otp_code
    if (!email_address || !password || !Contact_Adress || !otp_code) {
        return res.status(400).json({message: "Please provide all credentials including OTP code"})
    }
    try {
        const getUserCommand = 'SELECT id,password FROM `Organization_Supervisor` WHERE Email_Address=?'
        const getUserValue = [email_address]
        const [getUser] = await connection.execute(getUserCommand, getUserValue)
        if (getUser?.length == 0) {
            return res.status(400).json({message: "Invalid email address"})
        }
        if (getUser[0]?.password) {
            return res.status(400).json({message: "Account already exist, please log in"})
        }

        // Verify OTP
        const [otpQuery] = await connection.execute('SELECT * FROM `OTP_Verification_Table` WHERE email_address=? AND otp_code=?', [email_address, otp_code])
        if (otpQuery.length === 0) {
            return res.status(400).json({message: "Invalid or expired OTP code"})
        }
        const now = new Date()
        const expiry = new Date(otpQuery[0]?.expires_at)
        if (now > expiry) {
            return res.status(400).json({message: "OTP code has expired"})
        }

        const command = 'UPDATE Organization_Supervisor SET Profile_Img=?, Contact_Adress=?, password=? WHERE id=?'
        const values = [Profile_Img || null, Contact_Adress, password, getUser[0]?.id]
        const [result] = await connection.execute(command, values)

        // Delete OTP
        await connection.execute('DELETE FROM `OTP_Verification_Table` WHERE email_address=?', [email_address])

        res.status(201).json({message: "Supervisor account created successfully"})
    } catch (error) {
        res.status(501).json({message: "Error saving to database"})
        console.log(error);
    }
}

module.exports = organizationSupervisorSignup
