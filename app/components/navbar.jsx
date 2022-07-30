import "../styles/navbar.css";
import { MdSpaceDashboard, MdSettings } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";

export const Navbar = () => {
  return (
    <div className="nav flex">
      <div className="nav-top">
        <div className="nav-title">Project Name</div>
        <div className="nav-links">
          <div className="nav-link active">
            <div className="icon">
              <MdSpaceDashboard />
            </div>
            Dashboard
          </div>
          <div className="nav-link">
            <div className="icon">
              <FaTasks />
            </div>
            Results
          </div>
          {/* <div className="nav-link">Notifications</div> */}
          <div className="nav-link">
            <div className="icon">
              <MdSettings />
            </div>
            Settings
          </div>
        </div>
      </div>
      <div className="nav-bottom">
        <div className="icon">
          <GoSignOut />
        </div>
        Sign Out
      </div>
    </div>
  );
};
