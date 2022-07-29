import { Home } from "../components/home.jsx";
import { Results } from "../components/Results.jsx";
import { VideoRecord } from "../components/videoRecord";
import { Navbar } from "../components/navbar.jsx";
import "../styles/variables.css";

export default function Page() {
  return (
    <div className="App flex">
      <Navbar />
      {/* <Home /> */}
      <Results />
      {/* <VideoRecord/> */}
    </div>
  );
}
