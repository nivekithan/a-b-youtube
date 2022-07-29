import { Link } from "@remix-run/react";
import { AiOutlineRight } from "react-icons/ai";

const data = [
  {
    jobId: "243435353",
    title: "My Vlog#05 | Trip to EUROPE!!",
    img: "https://images.unsplash.com/photo-1658901742285-a5cba478b576?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=918&q=80",
    daysLeft: 0,
  },
  {
    jobId: "35668",
    title: "How to survive in Italy",
    img: "https://images.unsplash.com/photo-1658932501338-c4e396dc76aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    daysLeft: 5,
  },
];

export const Results = () => {
  return (
    <div className="hero">
      <div className="list-main flex">
        <div className="list-heading">Test Results</div>
        <div className="list-items">
          {data.map((el) => {
            return (
              <div key={el.title} className="list-item flex">
                <div className="flex">
                  <img src={el.img} alt="videos" className="list-item-image" />
                  <div className="list-item-title">{el.title}</div>
                </div>
                <div className="flex">
                  {el.daysLeft === 0 ? (
                    <div className="list-status-complete">Completed</div>
                  ) : (
                    <div className="list-status-ongoing">
                      {el.daysLeft} days left
                    </div>
                  )}
                  <Link to={`../record?jobId=${el.jobId}`}>
                    <div className="card-button">
                      View Details{" "}
                      <div className="icon">
                        <AiOutlineRight />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
