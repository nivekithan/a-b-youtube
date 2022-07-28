import "../styles/navbar.css";

export const Navbar = () => {
  return (
    <div className="nav flex">
      <div className="nav-top">
        <div className="nav-title">Project Name</div>
        <div className="nav-links">
          <div className="nav-link active">Dashboard</div>
          <div className="nav-link">Analytics</div>
          <div className="nav-link">History</div>
          <div className="nav-link">Settings</div>
        </div>
      </div>
      <div className="nav-bottom">Sign Out</div>
    </div>
  );
}
