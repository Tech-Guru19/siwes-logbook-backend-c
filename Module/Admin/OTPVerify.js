const connect = require("../../sqlConnection");

const AdminOTPVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        
        const connection = await connect();
        
        const [rows] = await connection.execute(
            'SELECT * FROM OTP_Verification_Table WHERE email_address = ? AND otp_code = ? AND expires_at > NOW()',
            [email, otp]
        );
        
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        
        // Delete OTP after successful verification
        await connection.execute('DELETE FROM OTP_Verification_Table WHERE email_address = ?', [email]);
        
        res.status(200).json({ message: "OTP Verified Successfully", status: "OK" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error verifying OTP" });
    }
};

module.exports = AdminOTPVerify;
