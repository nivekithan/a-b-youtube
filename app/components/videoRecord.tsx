import { Link } from "@remix-run/react";

export type TimeLineProps = {
  videoName: string | null;
  average: number;
  thumbnailsData: {
    thumbnailResultId: string;
    clickThroughRate: number;
    date: string;
    img: string;
    averageViewDuration: number;
  }[];
};

const Timeline = ({ thumbnailsData, videoName, average }: TimeLineProps) => {
  return (
    <div className="card-content flex">
      <div className="card-content-header flex">
        <div>
          <div className="card-title">{videoName}</div>
          <div className="card-subtitle">Thumbnail's Timeline</div>
        </div>
        <Link to="../results">
          <button className="card-button">Go Back</button>
        </Link>
      </div>
      <div className="card-timeline flex">
        <div className="card-timeline-items flex">
          {thumbnailsData.map((thumbnailRes) => {
            const thumbnailScore =
              thumbnailRes.averageViewDuration * thumbnailRes.clickThroughRate;

            return (
              <div
                key={thumbnailRes.thumbnailResultId}
                className="card-timeline-item flex"
              >
                <div className="card-timeline-item-clicks">
                  {thumbnailScore.toFixed(2)}
                </div>
                <div className="card-timeline-item-date">
                  {thumbnailRes.date}
                </div>
                <div className="card-timeline-item-stats">
                  {((thumbnailScore / average - 1) * 100).toFixed(2)}% from
                  median
                </div>
                <div className="card-timeline-item-gradient"></div>
                <div className="card-timeline-item-image-gradient"></div>
                <img
                  src={thumbnailRes.img}
                  alt="Thumbnail"
                  className="card-timeline-item-image"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export type BestThumbnailProps =
  | {
      type: "avaliable";
      clickThroughRate: number;
      averageViewDuration: number;
      img: string;
    }
  | { type: "notAvaliable" };

const BestThumbnail = (props: BestThumbnailProps) => {
  if (props.type === "notAvaliable") {
    return (
      <div className="card-content-bg flex">Not enough data avaliable</div>
    );
  }

  const { averageViewDuration, clickThroughRate, img } = props;

  const score = averageViewDuration * clickThroughRate;

  return (
    <div
      className="card-content-bg flex"
      style={{
        backgroundImage: `url('${img}')`,
      }}
    >
      <div className="card-best-subtitle card-subtitle">Best Thumbnail</div>
      <div className="card-best-title card-title">{score.toFixed(2)}</div>
      <div className="card-best-accent card-accent">Thumbanil Score</div>
      <div className="card-content-gradient"></div>
    </div>
  );
};

// const ClickGraph = () => {
//   let tempGraph = "";

//   for (let i = 0; i < data.length; i++) {
//     const value = data[i].clickThroughRate;

//     const percent = value / one;

//     tempGraph += `${i * (100 / (data.length - 1))}% ${100 - percent}%, `;
//   }
//   const graph = `polygon( ${tempGraph}100% 100%,0 100%)`;

//   return (
//     <div className="card-content">
//       <div className="card-comparison flex">
//         <div className="card-title">Graph of Clicks</div>
//         <div className="card-comparison-graph-container">
//           <div
//             className="card-comparison-graph"
//             style={{ WebkitClipPath: graph, clipPath: graph }}
//           ></div>
//           <div className="card-comparison-graph-days flex">
//             {data.map((i) => {
//               return (
//                 <div key={i.date} className="card-comparison-graph-day">
//                   {i.date.replace("2022", "")}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export type VideoRecordProps = {
  timelineProps: TimeLineProps;
  bestThumbnailProps: BestThumbnailProps;
};

export const VideoRecord = ({
  timelineProps,
  bestThumbnailProps,
}: VideoRecordProps) => {
  return (
    <div className="hero">
      <div className="videoRecord-main">
        <div className="card one-one">
          <Timeline {...timelineProps} />
        </div>
        <div className="card two-one">
          <BestThumbnail {...bestThumbnailProps} />
        </div>
        <div className="card two-two">{/* <ClickGraph /> */}</div>
      </div>
    </div>
  );
};
