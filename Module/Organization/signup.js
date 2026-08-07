const connect = require("../../sqlConnection")
const crypto = require("crypto")
const mailer = require("../../Mailer")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const organizationSignup = async(req, res)=>{
    console.log("organizationSignup",req.body);
    const Name = req.body?.Name
    const Email_Address = req.body?.Email_Address
    const password = req.body?.password
    const Location = req.body?.Location
    const CAC_Image = req.body?.CAC_Image
    const Contact_Adress = req.body?.Contact_Adress
    const Profile_Img = req.body?.Profile_Img
    const otp_code = req.body?.otp_code
    if (!Name || !Email_Address || !password || !Location || !CAC_Image || !Contact_Adress || !otp_code) {
        console.log(Name, Email_Address, password, Location, CAC_Image, Contact_Adress);
        
            return res.status(400).json({message: "Please provide all parameters including OTP code"})
    }
    try {
        // Verify OTP
        const [otpQuery] = await connection.execute('SELECT * FROM `OTP_Verification_Table` WHERE email_address=? AND otp_code=?', [Email_Address, otp_code])
        if (otpQuery.length === 0) {
            return res.status(400).json({message: "Invalid or expired OTP code"})
        }
        const now = new Date()
        const expiry = new Date(otpQuery[0]?.expires_at)
        if (now > expiry) {
            return res.status(400).json({message: "OTP code has expired"})
        }

        const command = 'INSERT INTO  Organization_Table (Name, CAC_Image, Email_Address, Contact_Address, Location, profileImg, password) VALUES (?,?,?,?,?,?,?)'
        const values = [Name, CAC_Image, Email_Address,  Contact_Adress, Location, Profile_Img || null, password]
        const [result] = await connection.execute(command, values)

        // Delete OTP
        await connection.execute('DELETE FROM `OTP_Verification_Table` WHERE email_address=?', [Email_Address])

        res.status(200).json({message: result})
        // const sendOTP = await mailer(email)
        // if (sendOTP?.error) {
        //     res.status(400).json({message: sendOTP?.error})
        // }
        // console.log("omoh",sendOTP);
        
        // const saveUserOTPCommand = ('INSERT INTO OTP_Verication_Table (email_address, OTP_Code) VALUES  (?,?)')
        // const value = [email, sendOTP]
        // const executeMail = await connection.execute(saveUserOTPCommand, value)
        // res.status(201).json({message: "Account created successfully, please check your mail to confirm"})
        // console.log(result);
        
    } catch (error) {
        if (error?.sqlMessage.includes("Duplicate entry")) {
            res.status(501).json({message: "Email address is already registered"})
        }
        res.status(501).json({message: error})
        console.log(error);
    }
}

module.exports = organizationSignup