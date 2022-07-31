import { useState, useEffect, useRef } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { userHomePageActionType } from "~/routes/user/$userId/index";
import { FileInput } from "./fileInput";

const StepOne = () => {
  return (
    <div className="card-content home-card-flex flex">
      <div className="card-content-header flex">
        <div>
          <div className="card-title">1&nbsp;&nbsp;New A/B Testing</div>
        </div>
      </div>
      <div className="select-video flex">
        <div className="card-title">Enter a youtube video link:</div>
        <input
          className="home-condition-input home-link-input"
          type="url"
          name="videoLink"
          id="videoLink"
          placeholder="https://youtu.be/dQw4w9WgXcQ"
        />
      </div>
    </div>
  );
};

const StepTwo = () => {
  const [uploadedThumbnails, setUploadedThumbnails] = useState({length: 0});

  const showPreview = useRef(false);

  useEffect(() => {
    if (uploadedThumbnails.length > 0) {
      showPreview.current = true;
    } else {
      showPreview.current = false;
    }
    console.log(uploadedThumbnails)
  }, [uploadedThumbnails]);

  return (
    <div className="card-content home-card-flex flex">
      <div className="card-title">2&nbsp;&nbsp;Add Thumbnails</div>
      <div className="card-subtitle">Upto 10 only</div>
      <div className="input-thumbnails-area flex">
        <div className="input-field-area flex">
          <FileInput name="thumbnails" setUploads={setUploadedThumbnails} />
        </div>
        <div className="input-display-area">
          <div className="input-display-cards flex">    
            {/* {showPreview ? (
              uploadedThumbnails.map((el) => {
                return <div key={el.name} className="input-display-card"><img src={el.file}/></div>;
              })
            ) : (
              <div className="input-display-card"></div>
            )} */}
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
