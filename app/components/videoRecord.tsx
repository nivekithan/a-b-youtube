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

            const differenceFromMedian = (thumbnailScore / average - 1) * 100;

            const isInvalidAverage =
              Number.isNaN(differenceFromMedian) || !differenceFromMedian;

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
                {isInvalidAverage ? null : (
                  <div className="card-timeline-item-stats">
                    {differenceFromMedian}% from median
                  </div>
                )}
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
      <div className="card-content-bg flex record-not-avaliable">
        Not enough data avaliable. Check back later
      </div>
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
var data = [
  {
    clicks: 4000,
    date: "12th july 2022",
    img: "https://images.unsplash.com/photo-1658901742285-a5cba478b576?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=918&q=80",
  },
  {
    clicks: 5000,
    date: "11th july 2022",
    img: "https://images.unsplash.com/photo-1658932501338-c4e396dc76aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    clicks: 700,
    date: "10th july 2022",
    img: "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    clicks: 8700,
    date: "9th july 2022",
    img: "https://images.unsplash.com/photo-1658860842042-1e1332cd63ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80",
  },
  {
    clicks: 4200,
    date: "8th july 2022",
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 2324,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "7th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 5100,
    date: "43143th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "14314rth july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  }, {
    clicks: 6200,
    date: "1323th july 2022",
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
];

var maxClicks = data[0].clicks;
var totalClicks = 0;

for (let i = 0; i < data.length; i++) {
  let val = data[i].clicks;
  totalClicks += val;
  if (maxClicks < val) {
    maxClicks = val;
  }
}

var one = maxClicks / 95;
var midean = totalClicks / data.length;

const ClickGraph = () => {
  let tempGraph = "";

  for (let i = 0; i < data.length; i++) {
    const value = data[i].clicks;

    const percent = value / one;

    tempGraph += `${i * (100 / (data.length - 1))}% ${100 - percent}%, `;
  }
  const graph = `polygon( ${tempGraph}100% 100%,0 100%)`;

  return (
    <div className="card-content">
      <div className="card-comparison flex">
        <div className="card-title">Graph of Clicks</div>
        <div className="card-comparison-graph-container">
          <div
            className="card-comparison-graph"
            style={{ WebkitClipPath: graph, clipPath: graph }}
          ></div>
          <div className="card-comparison-graph-days flex">
            {data.map((i) => {
              return (
                <div key={i.date} className="card-comparison-graph-day">
                  {i.date.replace("2022", "")}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <div className="card two-two"><ClickGraph /></div>
      </div>
    </div>
  );
};
