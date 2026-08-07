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

const schoolSignup = async(req, res)=>{
    console.log("here",req.body);
    const Name = req.body?.Name
    const Mail = req.body?.Mail
    const password = req.body?.	password
    const Location = req.body?.Location
    const CAC_Image = req.body?.CAC_Image
    const Certificte = req.body?.Certificte
    const Contact_Adress = req.body?.Contact_Adress
    const Profile_Img = req.body?.Profile_Img
    const otp_code = req.body?.otp_code
    if (!Name || !Mail || !password || !Location || !CAC_Image 
        || !Certificte || !Contact_Adress || !otp_code) {
            return res.status(400).json({message: "Please provide all parameters including OTP code"})
    }
    try {
        // Verify OTP
        const [otpQuery] = await connection.execute('SELECT * FROM `OTP_Verification_Table` WHERE email_address=? AND otp_code=?', [Mail, otp_code])
        if (otpQuery.length === 0) {
            return res.status(400).json({message: "Invalid or expired OTP code"})
        }
        const now = new Date()
        const expiry = new Date(otpQuery[0]?.expires_at)
        if (now > expiry) {
            return res.status(400).json({message: "OTP code has expired"})
        }

        const command = 'INSERT INTO  Instituition_Table (Name, Mail,password, Location, CAC_Image, Certificte, Contact_Adress, Profile_Img) VALUES (?,?,?,?,?,?,?,?)'
        const values = [Name, Mail, password, Location, CAC_Image, Certificte, Contact_Adress, Profile_Img || null]
        const [result] = await connection.execute(command, values)

        // Delete OTP
        await connection.execute('DELETE FROM `OTP_Verification_Table` WHERE email_address=?', [Mail])

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
        console.log("Institution Signup Error:", error);
        if (error?.sqlMessage && error.sqlMessage.includes("Duplicate entry")) {
            return res.status(400).json({message: "Email address is already registered"});
        }
        return res.status(500).json({message: error?.sqlMessage || error?.message || "An internal server error occurred during registration."});
    }
}

module.exports = schoolSignup