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
          <div className={isHome ? "nav-link active" : "nav-link"}>
            <Link to={`/user/${userId}`}>
              <div className="icon">
                <MdSpaceDashboard />
              </div>
              Dashboard
            </Link>
          </div>
          <div className={isResults ? "nav-link active" : "nav-link"}>
            <Link to={`/user/${userId}/results`}>
              <div className="icon">
                <FaTasks />
              </div>
              Results
            </Link>
          </div>
          {/* <div className="nav-link">Notifications</div> */}
          <div className={isSettings ? "nav-link active" : "nav-link"}>
            <Link to={`/user/${userId}/settings`}>
              <div className="icon">
                <MdSettings />
              </div>
              Settings
            </Link>
          </div>
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
