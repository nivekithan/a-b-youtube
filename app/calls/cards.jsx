import "../styles/cards.css";

var data = [
  {
    clicks: "4000",
    stats: `+${18}%`,
    date: "12th july 2022",
    img: "https://images.unsplash.com/photo-1658901742285-a5cba478b576?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=918&q=80",
  },
  {
    clicks: "3000",
    stats: `+${5}%`,
    date: "11th july 2022",
    img: "https://images.unsplash.com/photo-1658932501338-c4e396dc76aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  { clicks: "200;", stats: `+${4}%`, date: "10th july 2022", img: "" },
  { clicks: "900", stats: `+${2}%`, date: "9th july 2022", img: "" },
  { clicks: "1200", stats: `+${0}%`, date: "8th july 2022", img: "" },
];

const AddVideo = () => {
  return (
    <div className="card-content">
      <div className="card-title">Add New Thumbnail</div>
      <div className="card-accent">Available Date</div>
    </div>
  );
};

const Timeline = () => {
  return (
    <div className="card-content flex">
      <div className="card-content-header flex">
        <div>
          <div className="card-title">Video name</div>
          <div className="card-subtitle">Thumbnail's Timeline</div>
        </div>
        <button className="card-button">Change Video</button>
      </div>
      <div className="card-timeline flex">
        <div className="card-timeline-items flex">
          {data.map((el) => {
            return (
              <div key={el.date} className="card-timeline-item flex">
                <div className="card-timeline-item-clicks">{el.clicks}</div>
                <div className="card-timeline-item-date">{el.date}</div>
                <div className="card-timeline-item-stats">
                  {el.stats} than yesterday
                </div>
                <div className="card-timeline-item-gradient"></div>
                <div className="card-timeline-item-image-gradient"></div>
                <img
                  src={el.img}
                  alt="Thumbnail"
                  className="card-timeline-item-image"
                />
              </div>
            );
          })}
        </div>
        <div className="card-timeline-gradient"></div>
      </div>
    </div>
  );
};

const TodayReport = () => {
  return (
    <div className="card-content">
      <div className="card-title">Add New</div>
      <div className="card-subtitle">Thumbnail</div>
      <div className="card-accent">Date available</div>
    </div>
  );
};

const Comparison = () => {
  const graphBest = [90, 43, 97, 82, 45];
  const graphLive = [60, 23, 75, 97, 25];

  return (
    <div className="card-content">
      <div className="card-comparison flex">
        <div className="card-title">Best or Latest</div>
        <div className="card-comparison-graph-container">
          <div
            className="card-comparison-graph-best"
            style={{
              webkitClipPath: `polygon(0 ${100 - graphBest[0]}%, 25% ${
                100 - graphBest[1]
              }% , 50% ${100 - graphBest[2]}% , 75% ${
                100 - graphBest[3]
              }% , 100% ${100 - graphBest[4]}%, 100% 100%, 0 100%)`,
              clipPath: `polygon(0 ${100 - graphBest[0]}%, 25% ${
                100 - graphBest[1]
              }% , 50% ${100 - graphBest[2]}% , 75% ${
                100 - graphBest[3]
              }% , 100% ${100 - graphBest[4]}%,100% 100%, 0 100%)`,
            }}
          ></div>
          <div
            className="card-comparison-graph-latest"
            style={{
              webkitClipPath: `polygon(0 ${100 - graphLive[0]}%, 25% ${
                100 - graphLive[1]
              }% , 50% ${100 - graphLive[2]}% , 75% ${
                100 - graphLive[3]
              }% , 100% ${100 - graphLive[4]}%, 100% 100%, 0 100%)`,
              clipPath: `polygon(0 ${100 - graphLive[0]}%, 25% ${
                100 - graphLive[1]
              }% , 50% ${100 - graphLive[2]}% , 75% ${
                100 - graphLive[3]
              }% , 100% ${100 - graphLive[4]}%,100% 100%, 0 100%)`,
            }}
          ></div>
          <div className="card-comparison-graph-day flex">
            {[0, 1, 2, 3, 4].map((i) => {
              return (
                <div className="card-comparison-graphg-time">{i * 6}:00</div>
              );
            })}
          </div>
        </div>
        <div className="card-comparison-bottom flex">
          <div className="card-comparison-bottom-left">
            <div className="flex">
              <div className="comparison-bottom-color"></div>
              <div className="comparison-bottom-date">{data[0].date}</div>
            </div>
            <div className="comparison-bottom-text card-subtitle">
              Best Thumbnail
            </div>
          </div>
          <div className="card-comparison-bottom-right">
            <div className="flex">
              <div className="comparison-bottom-color"></div>
              <div className="comparison-bottom-date">{data[1].date}</div>
            </div>
            <div className="comparison-bottom-text card-subtitle">
              Live Thumbnail
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Upcoming = () => {
  return (
    <div
      className="card-content-bg flex"
      style={{
        backgroundImage: `url('${data[1].img}')`,
      }}
    >
      <div className="card-subtitle">Nest Thumbnail</div>
      <div className="card-title">Date</div>
      <div className="card-accent">Time left</div>
      <div className="card-content-gradient"></div>
    </div>
  );
};

export { AddVideo, Timeline, TodayReport, Comparison, Upcoming };
