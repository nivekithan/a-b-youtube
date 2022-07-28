import "../styles/cards.css";

var thumbnailsList = [
  { clicks: "4000", stats: `+${18}%`, date: "12th july 2022" },
  { clicks: "3000", stats: `+${5}%`, date: "11th july 2022" },
  { clicks: "200;", stats: `+${4}%`, date: "10th july 2022" },
  { clicks: "900", stats: `+${2}%`, date: "9th july 2022" },
  { clicks: "1200", stats: `+${0}%`, date: "8th july 2022" },
];

const AddVideo = () => {
  return (
    <div className="card-content">
      <div>
        <div className="card-title">Add New Thumbnail</div>
      </div>
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
      <div className="card-thumbnailsList flex">
        <div className="card-thumbnailsList-items flex">
          {thumbnailsList.map((el) => {
            return (
              <div key={el.date} className="card-thumbnailsList-item flex">
                <div className="card-thumbnailsList-item-clicks">
                  {el.clicks}
                </div>
                <div className="card-thumbnailsList-item-date">{el.date}</div>
                <div className="card-thumbnailsList-item-stats">
                  {el.stats} than yesterday
                </div>
              </div>
            );
          })}
        </div>
        <div className="card-thumbnailsList-gradient"></div>
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
  return (
    <div className="card-content">
      <div className="card-title">Add New</div>
      <div className="card-subtitle">Thumbnail</div>
      <div className="card-accent">Date available</div>
    </div>
  );
};

const Upcoming = () => {
  return (
    <div className="card-content">
      <div className="card-title">Add New</div>
      <div className="card-subtitle">Thumbnail</div>
      <div className="card-accent">Date available</div>
    </div>
  );
};

export { AddVideo, Timeline, TodayReport, Comparison, Upcoming };
