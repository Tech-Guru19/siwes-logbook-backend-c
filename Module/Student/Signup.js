const connect = require("../../sqlConnection")
const crypto = require("crypto")
const mailer = require("../../Mailer")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const studentSignup = async (req, res) => {
    console.log("student signup", req.body);
    const email_address = req.body?.email_address
    const Instituition_Mail = req.body?.Instituition_Mail
    const password = req.body?.password
    const Contact_Adress = req.body?.Contact_Adress
    const Profile_Img = req.body?.Profile_Img
    const otp_code = req.body?.otp_code
    if (!email_address || !Instituition_Mail || !password || !Contact_Adress || !otp_code) {
        res.status(501).json({ message: "Please provide all credentials including OTP code" })
        return
    }
    try {
        const getUserCommand = 'SELECT id,password FROM `Student_Table` WHERE Instituition_Mail=? AND email_address=?'
        const getUserValue = [Instituition_Mail, email_address]
        const [getUser] = await connection.execute(getUserCommand, getUserValue)
        if (getUser?.length == 0) {
            return res.status(400).json({ message: "Invalid email address or instituition mail" })
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

        const command = 'UPDATE Student_Table SET Profile_Img=?, Contact_Adress=?, password=? WHERE id=?'
        const values = [Profile_Img || null, Contact_Adress, password, getUser[0]?.id]
        const [result] = await connection.execute(command, values)
        
        // Delete OTP after successful signup
        await connection.execute('DELETE FROM `OTP_Verification_Table` WHERE email_address=?', [email_address])

        res.status(201).json({message: "Student account created successfully"})

    } catch (error) {
        res.status(501).json({ message: "Error saving to database" })
        console.log(error);
    }
}

module.exports = studentSignup