import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./authFlow/Login";
import AdminDashboard from "./adminFlow/Dashboard";
import TeacherDashboard from "./TeacherFlow/Dashboard";
import StudentDashBoard from "./studentFlow/Dashboard";
import NoMatch from "./authFlow/NoMatch";
import RegisterUsers from "./adminFlow/RegistrationUsers";
import RegisterStudent from "./adminFlow/RegisterStudent"
import RegisterTeacher from "./adminFlow/RegisterTeacher";
import AddNewStudent from "./TeacherFlow/AddNewStudent";
import OpenAttendancePortal from "./TeacherFlow/OpenAttendancePortal";
import UpdateTeacher from "./adminFlow/UpdateTeacher";
import AttendanceDetails from "./adminFlow/AttendanceDetails";
import Attendance from "./TeacherFlow/Attendance";
import Defaulters from "./adminFlow/Defaulters";
import ManageCourses from "./adminFlow/ManageCourses";
import PasswordReset from "./compoents/PasswordReset";
import ForgotPassword from "./compoents/ForgotPassword";
import Issues from "./compoents/Issues";
import AptitudeResults from "./adminFlow/AptitudeResults";
import ActivePortals from "./adminFlow/ActivePortals"
import MinorForm from "./freeFlow/MinorForm";
import DisplayMinorData from "./adminFlow/DisplayMinorData";
import UpdateMinorStudent from "./adminFlow/UpdateMinorStudent";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="student-dashboard" element={<StudentDashBoard />} />
        <Route
          path="admin-dashboard/register-student"
          element={<RegisterStudent />}
        />
        <Route
          path="admin-dashboard/register-teacher"
          element={<RegisterTeacher />}
        />
        <Route
          path="admin-dashboard/update-teacher"
          element={<UpdateTeacher />}
        />
        <Route
          path="admin-dashboard/manage-courses"
          element={<ManageCourses />}
        />
        {/* <Route
          path="admin-dashboard/active-attendances"
          element={<AttendanceDetails />}
        /> */}
        <Route
          path="admin-dashboard/aptitude-results"
          element={<AptitudeResults />}
        />
        <Route
          path="admin-dashboard/active-portals"
          element={<ActivePortals />}
        />
        <Route path="teacher-dashboard" element={<OpenAttendancePortal />} />
        <Route
          path="teacher-dashboard/add-new-student"
          element={<AddNewStudent />}
        />
        <Route
          path="teacher-dashboard/open-attendance-portal"
          element={<OpenAttendancePortal />}
        />
        <Route path="teacher-dashboard/attendance" element={<Attendance />} />
        <Route path="admin-dashboard/defaulters" element={<Defaulters />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/issue" element={<Issues />} />
        <Route path="/minor-selection-form" element={<MinorForm />} />
        <Route path="/admin-dashboard/minor-selection-display" element={<DisplayMinorData />} />
        <Route path="/admin-dashboard/update-student" element={<UpdateMinorStudent />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      <footer className="fixed-bottom">
        <div className="p-3 text-center bg-white">
          <div>
            <span className="fs-4 text-danger">
              <b>AttendEase</b>{" "}
            </span>{" "}
            v0.1.0
          </div>
          <div>by Developers Cell Somaiya</div>
        </div>
      </footer>
    </>
  );
};

export default App;
