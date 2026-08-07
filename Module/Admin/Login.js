const connect = require("../../sqlConnection");
const mailer = require("../../Mailer");

const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const connection = await connect();
        
        // 1. Verify against SuperAdmin_Table
        const [rows] = await connection.execute(
            'SELECT * FROM SuperAdmin_Table WHERE email_address = ? AND password = ?', 
            [email, password]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials or unauthorized" });
        }
        
        // 2. Generate and store OTP
        const otp = await mailer(email);
        
        // Delete any existing OTP for this email
        await connection.execute('DELETE FROM OTP_Verification_Table WHERE email_address = ?', [email]);
        
        // Insert new OTP
        await connection.execute(
            'INSERT INTO OTP_Verification_Table (email_address, otp_code) VALUES (?, ?)',
            [email, otp]
        );
        
        res.status(200).json({ message: "OTP sent successfully to your email", status: "OK", adminData: { email: rows[0].email_address, id: rows[0].id } });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during admin login" });
    }
};

module.exports = AdminLogin;
