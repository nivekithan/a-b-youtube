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

export type ResultsProps = {
  results: { jobId: string; title: string; img: string; daysLeft: number }[];
};

export const Results = ({ results }: ResultsProps) => {
  const isResultEmpty = results.length === 0;
  console.log({ isResultEmpty });

  return (
    <div className="hero">
      <div className="list-main flex">
        <div className="list-heading">Test Results</div>
        <div className="list-items">
          {!isResultEmpty ? (
            results.map((res) => {
              return (
                <div key={res.title} className="list-item flex">
                  <div className="flex">
                    <img
                      src={res.img}
                      alt="videos"
                      className="list-item-image"
                    />
                    <div className="list-item-title">{res.title}</div>
                  </div>
                  <div className="flex">
                    {res.daysLeft === 0 ? (
                      <div className="list-status-complete">Completed</div>
                    ) : (
                      <div className="list-status-ongoing">
                        {res.daysLeft} days left
                      </div>
                    )}
                    <Link to={`../record?jobId=${res.jobId}`}>
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
            })
          ) : (
            <div className="no-list-item list-item">
              <div className="flex">
                It seems you have not started any test. Start a test from
                dashboard then check back later
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
