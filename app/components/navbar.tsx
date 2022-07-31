import { MdSpaceDashboard, MdSettings } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { Link } from "@remix-run/react";

export type NavbarProps = {
  active: "home" | "results" | "settings" | "";
  userId: string;
};

export const Navbar = ({ active, userId }: NavbarProps) => {
  const isHome = active === "home";
  const isResults = active === "results";
  const isSettings = active === "settings";

  return (
    <div className="nav flex">
      <div className="nav-top">
        <div className="nav-title">Project Name</div>
        <div className="nav-links">
          <Link to={`/user/${userId}`}>
            <div className={isHome ? "nav-link active" : "nav-link"}>
              <div className="icon">
                <MdSpaceDashboard />
              </div>
              Dashboard
            </div>
          </Link>
          <Link to={`/user/${userId}/results`}>
            <div className={isResults ? "nav-link active" : "nav-link"}>
              <div className="icon">
                <FaTasks />
              </div>
              Results
            </div>
          </Link>
          {/* <div className="nav-link">Notifications</div> */}
          <Link to={`/user/${userId}/settings`}>
            <div className={isSettings ? "nav-link active" : "nav-link"}>
              <div className="icon">
                <MdSettings />
              </div>
              Settings
            </div>
          </Link>
        </div>
      </div>
      <Link to="/logout">
        <div className="nav-bottom">
          <div className="icon">
            <GoSignOut />
          </div>
          Sign Out
        </div>
      </Link>
    </div>
  );
};
