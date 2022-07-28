import { Home } from "../components/home.jsx";
import { Navbar } from "../components/navbar.jsx";
import "../styles/variables.css";

export default function Page() {
  return (
    <div className="App flex">
      <Navbar />
      <Home />
    </div>
  );
}
