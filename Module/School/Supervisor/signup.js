const connect = require("../../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const schoolSupervisorSignup = async(req, res)=>{
    console.log("schoolSupervisorSignup", req.body);
    const email_address = req.body?.Email_Address || req.body?.email_address
    const password = req.body?.password
    const contact_address = req.body?.Contact_Adress || ""
    const profile_img = req.body?.Profile_Img || ""
    const otp_code = req.body?.otp_code

    if (!email_address || !password || !otp_code) {
        return res.status(400).json({message: "Please enter your email address, password, and OTP code"})
    }

    try {
        // Check if supervisor email exists in database
        const checkCommand = 'SELECT * FROM `School_Supervisor` WHERE Email_Address=?'
        const [query] = await connection.execute(checkCommand, [email_address])

        if (query.length === 0) {
            return res.status(400).json({message: "No supervisor record found for this email address. Please ask your School Administrator to register you first."})
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

        // Update password and profile details
        const updateCommand = 'UPDATE `School_Supervisor` SET password=?, Contact_Adress=?, Profile_Img=? WHERE Email_Address=?'
        await connection.execute(updateCommand, [password, contact_address, profile_img, email_address])

        // Delete OTP
        await connection.execute('DELETE FROM `OTP_Verification_Table` WHERE email_address=?', [email_address])

        res.status(200).json({message: "Account activated successfully! You can now sign in.", status: "OK"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error activating supervisor account"})
    }
}

module.exports = schoolSupervisorSignup
