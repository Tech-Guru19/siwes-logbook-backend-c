const connect = require("../../sqlConnection")
let connection
connect()
    .then((output) => {
        connection = output
    })
    .catch((error) => {
        console.log(error);
    })

const fetchDetailed = async (req, res) => {
    console.log("fetchDetailed student", req.body);
    const { student_id, instituition_id, organization_id, school_supervisor_id, organization_supervisor_id } = req.body

    try {
        let command = `
            SELECT 
                s.id,
                s.Full_Name,
                s.email_address,
                s.Matriculation_No,
                s.department,
                s.Start_Date,
                s.End_Date,
                s.Contact_Adress,
                s.School_Supervisor_Id,
                s.Organization_Supervisor_Id,
                s.Organization_Id,
                s.bank_name,
                s.account_number,
                s.account_name,
                s.acceptance_letter_url,
                s.itf_form8_url,
                s.id as student_id,
                s.Full_Name as student_name,
                s.email_address as student_email,
                s.Matriculation_No as student_matric,
                s.department as student_department,
                s.Start_Date as student_start_date,
                s.End_Date as student_end_date,
                s.Contact_Adress as student_contact,
                inst.Name as institution_name,
                inst.Location as institution_location,
                inst.Mail as institution_mail,
                inst.Contact_Adress as institution_contact,
                ss.Full_Name as school_supervisor_name,
                ss.Email_Address as school_supervisor_email,
                ss.Contact_Adress as school_supervisor_contact,
                ss.department as school_supervisor_department,
                org.Name as organization_name,
                org.Location as organization_location,
                org.Email_Address as organization_email,
                org.Contact_Address as organization_contact,
                os.Full_Name as org_supervisor_name,
                os.Email_Address as org_supervisor_email,
                os.Contact_Adress as org_supervisor_contact
            FROM Student_Table s
            LEFT JOIN Instituition_Table inst ON s.Instituition_Id = inst.id
            LEFT JOIN School_Supervisor ss ON s.School_Supervisor_Id = ss.id
            LEFT JOIN Organization_Table org ON s.Organization_Id = org.id
            LEFT JOIN Organization_Supervisor os ON s.Organization_Supervisor_Id = os.id
        `
        let values = []

        if (student_id) {
            command += " WHERE s.id = ?"
            values = [student_id]
        } else if (instituition_id) {
            command += " WHERE s.Instituition_Id = ?"
            values = [instituition_id]
        } else if (organization_id) {
            command += " WHERE s.Organization_Id = ?"
            values = [organization_id]
        } else if (school_supervisor_id) {
            command += " WHERE s.School_Supervisor_Id = ?"
            values = [school_supervisor_id]
        } else if (organization_supervisor_id) {
            command += " WHERE s.Organization_Supervisor_Id = ?"
            values = [organization_supervisor_id]
        } else {
            return res.status(400).json({ message: "Please provide a valid filter ID" })
        }

        const [query] = await connection.execute(command, values)
        res.status(200).json({ message: query, status: "OK" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching student details" })
    }
}

module.exports = fetchDetailed
