import "../styles/home.css";
import {
  AddVideo,
  Timeline,
  TodayReport,
  Comparison,
  Upcoming,
} from "../calls/cards";

export const Home = () => {
  return (
    <div className="hero">
      <div className="main">
        <div className="card one-one">
          <AddVideo />
        </div>
        <div className="card one-two">
          <Timeline />
        </div>
        <div className="card two-one">
          <TodayReport />
        </div>
        <div className="card two-two">
          <Comparison />
        </div>
        <div className="card three-one">
          <Upcoming />
        </div>
        <div className="card three-two">More Analytics</div>
      </div>
    </div>
  );
};
