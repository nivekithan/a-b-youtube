import { Signin } from "../components/signin.jsx";
import { Navbar } from "../components/navbar.jsx";
import { Home } from "../components/home.jsx";
import { Results } from "../components/results.jsx";
import { VideoRecord } from "../components/videoRecord";
import { Settings } from "../components/Settings.jsx";
import "../styles/variables.css";

export default function Page() {
  return (
    <div className="App flex">
      <Signin />

      {/* <Navbar /> */}

      {/* <Home /> */}
      {/* <Results /> */}
      {/* <VideoRecord/> */}
      {/* <Settings /> */}
    </div>
  );
}
