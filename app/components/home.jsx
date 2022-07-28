import "../styles/home.css";

const StepOne = () => {
  return (
    <div className="card-content">
      <div className="card-title">1&nbsp;&nbsp;New A/B Testing</div>
      <div className="card-subtitle">Select a Video</div>
    </div>
  );
};
const StepTwo = () => {
  return (
    <div className="card-content">
      <div className="card-title">2&nbsp;&nbsp;Add Thumbnails</div>
      <div className="card-subtitle">Upto 10 only</div>
    </div>
  );
};

const StepThree = () => {
  return (
    <div className="card-content home-card-flex flex">
      <div className="card-title">3&nbsp;&nbsp;Run Testing</div>
      <div className="home-conditions">
        <div className="flex">
          <label className="home-condition-label">Number of Days</label>
          <input
            className="home-condition-input"
            type="number"
            min="1"
            max="10"
          />
        </div>
        <div className="flex">
          <label className="home-condition-label">
            Start after days of publish
          </label>
          <input
            className="home-condition-input"
            type="number"
            min="0"
            max="5"
          />
        </div>
      </div>
      <div className="card-button home-start-button">Start</div>
    </div>
  );
};

export const Home = () => {
  return (
    <div className="hero">
      <div className="main">
        <div className="card one-one">
          <StepOne />
        </div>
        <div className="card two-one">
          <StepTwo />
        </div>
        <div className="card two-two">
          <StepThree />
        </div>
      </div>
    </div>
  );
};
