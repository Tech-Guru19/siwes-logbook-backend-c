const connect = require("../../sqlConnection")
const mailer = require("../../Mailer")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const otpSend = async(req, res)=>{
    console.log("otpSend", req.body);
    const email_address = req.body?.email_address
    if (!email_address) {
        return res.status(400).json({message: "Please provide email address"})
    }
    try {
        const deleteCommand = 'DELETE FROM `OTP_Verification_Table` WHERE email_address=?'
        await connection.execute(deleteCommand, [email_address])
        const sendOTP = await mailer(email_address)
        const saveCommand = 'INSERT INTO OTP_Verification_Table (email_address, otp_code) VALUES (?,?)'
        const values = [email_address, sendOTP]
        await connection.execute(saveCommand, values)
        res.status(201).json({message: "OTP sent successfully"})
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Error sending OTP"})
    }
}
module.exports = otpSend
