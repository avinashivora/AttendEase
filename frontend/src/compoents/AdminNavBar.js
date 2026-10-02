import { useAuthStore } from "../store/store";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const AdminNavBar = () => {
  const navigate = useNavigate();

  const setStateUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore.getState().user;
  const handleLogin = () => {
    setStateUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-danger">
      <div className="container-fluid">
        <Link className="navbar-brand text-light" to={"/admin-dashboard"}>
          Admin DashBoard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon "></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
                <Link className="nav-link text-light " to={"/admin-dashboard/register-user"}>Users</Link>
            </li> */}
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/register-teacher"}
              >
                Register Teachers
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/register-student"}
              >
                Register Student
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/defaulters"}
              >
                Defaulters
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/manage-courses"}
              >
                Manage Courses
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/active-attendances"}
              >
                Attendance Details
              </Link>
            </li> */}
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/active-portals"}
              >
                Active Portals
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/aptitude-results"}
              >
                Aptitude Results
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/minor-selection-display"}
              >
                Minor Data
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to={"/admin-dashboard/update-student"}
              >
                Update Student
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to="/password-reset"
                state={user}
              >
                Reset Password
              </Link>
            </li>
          </ul>
          <hr className="text-light" />
          <button
            className="btn btn-danger navbar-text text-light"
            onClick={() => handleLogin()}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
