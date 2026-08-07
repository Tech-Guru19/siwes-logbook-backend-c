const express = require("express")
const app = express();
const cors = require("cors")
const allBasic = require("./BasicFX.js")
const connectSql = require("./sqlConnection.js")
app.use(cors());
app.use(express.json());
const signup = require("./Module/Student/Signup.js")
const signin = require("./Module/Student/Signin.js");
const mailUser = require("./Mailer.js");
const schoolSignup = require("./Module/School/signup.js");
const organizationSignup = require("./Module/Organization/signup.js");
const organizationCreateSupervisor = require("./Module/Organization/CreateSupervisor.js");
const schoolCreateStudent = require("./Module/School/CreateStudent.js");
const studentSignup = require("./Module/Student/Signup.js");
const studentSignin = require("./Module/Student/Signin.js");
const schoolSignin = require("./Module/School/signin.js");
const schoolStudentFetch = require("./Module/School/SchoolFetchStudent.js");
const SchoolDepartmentAdd = require("./Module/School/Department/SchoolDepartmentAdd.js");
const SchoolFetchDepartment = require("./Module/School/Department/SchoolFetchDepartment.js");
const schoolCreateSupervisor = require("./Module/School/Supervisor/CreateSupervisor.js");
const schoolFetchSupervisor = require("./Module/School/Supervisor/fetchSupervisor.js");
const schoolSupervisorSignin = require("./Module/School/Supervisor/signin.js");
const schoolSupervisorSignup = require("./Module/School/Supervisor/signup.js");
const organizationSignin = require("./Module/Organization/signin.js");
const organizationFetchSupervisor = require("./Module/Organization/FetchSupervisor.js");
const organizationSupervisorSignup = require("./Module/OrganizationSupervisor/signup.js");
const organizationSupervisorSignin = require("./Module/OrganizationSupervisor/signin.js");
const studentProfile = require("./Module/Student/Profile.js");
const otpSend = require("./Module/Auth/OTPSend.js");
const otpVerify = require("./Module/Auth/OTPVerify.js");
const organizationAssignSupervisor = require("./Module/Organization/AssignSupervisor.js");

// New CRUD Modules
const schoolDepartmentUpdate = require("./Module/School/Department/SchoolDepartmentUpdate.js");
const schoolDepartmentDelete = require("./Module/School/Department/SchoolDepartmentDelete.js");
const schoolSupervisorUpdate = require("./Module/School/Supervisor/SchoolSupervisorUpdate.js");
const schoolSupervisorDelete = require("./Module/School/Supervisor/SchoolSupervisorDelete.js");
const schoolStudentUpdate = require("./Module/School/SchoolStudentUpdate.js");
const schoolStudentDelete = require("./Module/School/SchoolStudentDelete.js");
const organizationSupervisorUpdate = require("./Module/OrganizationSupervisor/update.js");
const organizationSupervisorDelete = require("./Module/OrganizationSupervisor/delete.js");
const placementApply = require("./Module/Placement/Apply.js");
const placementFetch = require("./Module/Placement/Fetch.js");
const placementStatus = require("./Module/Placement/Status.js");
const logbookCreate = require("./Module/Logbook/Create.js");
const logbookFetch = require("./Module/Logbook/Fetch.js");
const logbookUpdate = require("./Module/Logbook/Update.js");
const logbookDelete = require("./Module/Logbook/Delete.js");
const logbookSign = require("./Module/Logbook/Sign.js");
const logbookGrade = require("./Module/Logbook/Grade.js");

// require('dotenv').config();
let connection
connectSql()
.then(async(output)=>{
    connection = output
    console.log("database is running");
    
})
.catch((error)=>{
    console.log(error);
})
const serverPort = process.env.PORT || 5687
app.post("/school/signup", schoolSignup)
app.post("/school/signin", schoolSignin)
app.post("/school/fetch/student", schoolStudentFetch)
app.post("/school/register/supervisor", schoolCreateSupervisor)
app.post("/school/register/student", schoolCreateStudent)
app.post("/school/register/department", SchoolDepartmentAdd)
app.post("/school/register/department/fetch", SchoolFetchDepartment)
app.post("/organization/signup", organizationSignup)
app.post("/organization/create/supervisor", organizationCreateSupervisor)
app.post("/user/student/signup", studentSignup)
app.post("/user/student/signin", studentSignin)
app.post("/user/student/profile", studentProfile)
app.post("/school/fetch/supervisor", schoolFetchSupervisor)
app.post("/school/supervisor/signin", schoolSupervisorSignin)
app.post("/school/supervisor/signup", schoolSupervisorSignup)
app.post("/organization/signin", organizationSignin)
app.post("/organization/list", require("./Module/Organization/List.js"))
app.post("/organization/search", require("./Module/Organization/Search.js"))
app.post("/organization/fetch/supervisor", organizationFetchSupervisor)
app.post("/organization-supervisor/signup", organizationSupervisorSignup)
app.post("/organization-supervisor/signin", organizationSupervisorSignin)
app.post("/auth/otp/send", otpSend)
app.post("/auth/otp/verify", otpVerify)
app.post("/organization/assign-supervisor", organizationAssignSupervisor)

// New CRUD Routes
app.post("/school/department/update", schoolDepartmentUpdate)
app.post("/school/department/delete", schoolDepartmentDelete)
app.post("/school/supervisor/update", schoolSupervisorUpdate)
app.post("/school/supervisor/delete", schoolSupervisorDelete)
app.post("/school/student/update", schoolStudentUpdate)
app.post("/school/student/delete", schoolStudentDelete)
app.post("/organization-supervisor/update", organizationSupervisorUpdate)
app.post("/organization-supervisor/delete", organizationSupervisorDelete)
app.post("/user/student/placement/apply", placementApply)
app.post("/organization/placements/fetch", placementFetch)
app.post("/organization/placements/status", placementStatus)
app.post("/user/student/logbook/create", logbookCreate)
app.post("/user/student/logbook/fetch", logbookFetch)
app.post("/user/student/logbook/update", logbookUpdate)
app.post("/user/student/logbook/delete", logbookDelete)
app.post("/org-supervisor/logbook/sign", logbookSign)
app.post("/school-supervisor/logbook/grade", logbookGrade)
app.post("/student/fetch-detailed", require("./Module/Student/FetchDetailed.js"))
app.post("/user/student/update-details", require("./Module/Student/UpdateDetails.js"))

const { submitEvaluation, fetchEvaluation } = require("./Module/Evaluation.js")
app.post("/org-supervisor/evaluate", submitEvaluation)
app.post("/student/evaluation/fetch", fetchEvaluation)

// Leave routes
app.post("/leave/request", require("./Module/Leave/Create.js"))
app.post("/leave/fetch/student", require("./Module/Leave/Fetch.js"))
app.post("/leave/update-status", require("./Module/Leave/UpdateStatus.js"))
app.post("/leave/fetch/org-supervisor-all", require("./Module/Leave/FetchSupervisorLeaves.js"))

// Admin routes
app.post("/admin/login", require("./Module/Admin/Login.js"))
app.post("/admin/verify-otp", require("./Module/Admin/OTPVerify.js"))
app.get("/admin/dashboard-stats", require("./Module/Admin/DashboardStats.js"))
app.post("/admin/fetch-all", require("./Module/Admin/FetchAll.js"))
app.post("/admin/delete", require("./Module/Admin/Delete.js"))
app.post("/admin/update", require("./Module/Admin/Update.js"))

// Support routes
app.post("/support/ticket", require("./Module/Support/Ticket.js").submitTicket)
app.get("/admin/tickets", require("./Module/Admin/SupportTickets.js").FetchTickets)
app.post("/admin/tickets/resolve", require("./Module/Admin/SupportTickets.js").ResolveTicket)
app.get("/ping", async (req, res) => {
  try {
    if (!connection) {
      return res.status(503).json({ 
        status: "error", 
        message: "Database connection is still initializing..." 
      });
    }

    // Uses your existing 'connection' variable
    await connection.query("SELECT 1"); 
    
    return res.status(200).json({ 
      status: "ok", 
      message: "Render backend and Aiven DB are active!" 
    });
  } catch (error) {
    console.error("Keep-alive DB ping failed:", error.message);
    return res.status(500).json({ status: "error", message: error.message });
  }
});
app.get("/sendMail", (req, res) => {
    console.log(req.body);
})
app.get('/', (req, res) => {
    res.json({ 'message': "I am running perfectly well" })
})

app.listen(serverPort, () => {
    console.log(`server is running at ${serverPort}`);

})

