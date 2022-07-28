import "../styles/videoRecord.css";
import {
  Timeline,
  BestThumbnail,
  ClickGraph,
} from "../calls/cards";

export const VideoRecord = () => {
  return (
    <div className="hero">
      <div className="videoRecord-main">
        <div className="card one-one">
          <Timeline />
        </div>
        <div className="card two-one">
          <BestThumbnail />
        </div>
        <div className="card two-two">
          <ClickGraph />
        </div>
      </div>
    </div>
  );
};
