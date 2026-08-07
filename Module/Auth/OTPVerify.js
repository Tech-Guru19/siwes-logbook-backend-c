const connect = require("../../sqlConnection")
let connection
connect()
.then((output)=>{
    connection = output
})
.catch((error)=>{
    console.log(error);
})

const otpVerify = async(req, res)=>{
    console.log("otpVerify", req.body);
    const email_address = req.body?.email_address
    const otp_code = req.body?.otp_code
    if (!email_address || !otp_code) {
        return res.status(400).json({message: "Please provide email and OTP code"})
    }
    try {
        const command = 'SELECT * FROM `OTP_Verification_Table` WHERE email_address=? AND otp_code=?'
        const values = [email_address, otp_code]
        const [query] = await connection.execute(command, values)
        if (query.length == 0) {
            return res.status(400).json({message: "Invalid OTP code"})
        }
        const now = new Date()
        const expiry = new Date(query[0]?.expires_at)
        if (now > expiry) {
            return res.status(400).json({message: "OTP code has expired"})
        }
        res.status(200).json({message: "OTP verified successfully", status: "OK"})
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Error verifying OTP"})
    }
}
module.exports = otpVerify
