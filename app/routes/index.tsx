import { Signin } from "../components/signin.jsx";
import { Navbar } from "../components/navbar.jsx";
import { Home } from "../components/home.jsx";
import { Results } from "../components/results.jsx";
import { VideoRecord } from "../components/videoRecord";
import { Settings } from "../components/settings.jsx";
import { Notification } from "../components/notification.js";
import "../styles/variables.css";

export default function Page() {

  return (
    <div className="App flex">
      {/* <Signin /> */}

      <Navbar />

      {/* <Home /> */}
      {/* <div className="notification-panel">
        <Notification />
      </div> */}
      {/* <Results /> */}
      {/* <VideoRecord/> */}
      <Settings />
    </div>
  );
}
