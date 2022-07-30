import { AiOutlineRight } from "react-icons/ai";
import { userHomePageActionType } from "~/routes/user/$userId/index";

const StepOne = () => {
  return (
    <div className="card-content home-card-flex flex">
      <div className="card-content-header flex">
        <div>
          <div className="card-title">1&nbsp;&nbsp;New A/B Testing</div>
          <div className="card-subtitle">Select a Video</div>
        </div>
        <div className="flex">
          <div className="card-subtitle">Or Video Link</div>
          <input
            className="home-condition-input"
            type="url"
            name="videoLink"
            id="videoLink"
          />
        </div>
      </div>
      <div className="select-video flex">
        <div className="select-video-card"></div>
        <div className="select-video-card"></div>
        <div className="select-video-card"></div>
        <div className="select-video-card"></div>
        <div className="select-video-card"></div>
        <div className="select-video-card"></div>
      </div>
    </div>
  );
};
const StepTwo = () => {
  return (
    <div className="card-content home-card-flex flex">
      <div className="card-title">2&nbsp;&nbsp;Add Thumbnails</div>
      <div className="card-subtitle">Upto 10 only</div>
      <div className="input-thumbnails-area flex">
        <div className="input-field-area flex">
          <input
            type="file"
            accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
            multiple
            className="input-thumbnail"
            name="thumbnails"
          />
        </div>
        <div className="input-display-area">
          <div className="input-display-cards flex">
            <div className="input-display-card"></div>
            <div className="input-display-card"></div>
            <div className="input-display-card"></div>
          </div>
        </div>
      </div>
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
            name="testDays"
          />
        </div>
        {/* <div className="flex">
          <label className="home-condition-label">
            Start after days of publish
          </label>
          <input
            className="home-condition-input"
            type="number"
            min="0"
            max="5"
          />
        </div> */}
      </div>
      <button
        className="card-button home-start-button"
        name="actionType"
        value={userHomePageActionType.addTest}
      >
        Start{" "}
        <div className="icon">
          <AiOutlineRight />
        </div>
      </button>
    </div>
  );
};

export const Home = () => {
  return (
    // <div className="hero">
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
    // </div>
  );
};
