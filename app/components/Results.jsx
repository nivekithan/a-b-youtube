import "../styles/list.css";

const data = [
  {
    title: "My Vlog#05 | Trip to EUROPE!!",
    status: false,
    img: "https://images.unsplash.com/photo-1658901742285-a5cba478b576?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=918&q=80",
  },
  {
    title: "How to survive in Italy",
    status: true,
    img: "https://images.unsplash.com/photo-1658932501338-c4e396dc76aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    title: "You won't believe where I went!!!!",
    status: false,
    img: "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    title: "Got Lost in Wood for 24 HOurs",
    status: true,
    img: "https://images.unsplash.com/photo-1658860842042-1e1332cd63ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80",
  },
  {
    title: "My Vlog#02 | Japan here I come",
    status: true,
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    title: "My setup tour | $40,000 wasted",
    status: true,
    img: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    title: "Got Lost in Wood for 24 HOurs",
    status: true,
    img: "https://images.unsplash.com/photo-1658860842042-1e1332cd63ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80",
  },
  {
    title: "How to survive in Italy",
    status: true,
    img: "https://images.unsplash.com/photo-1658932501338-c4e396dc76aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
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
              <div className="list-item flex">
                <div className="flex">
                  <img
                    src={el.img}
                    alt="video image"
                    className="list-item-image"
                  />
                  <div className="list-item-title">{el.title}</div>
                </div>
                <div className="flex">
                  {el.status ? (
                    <div className="list-status-complete">Completed</div>
                  ) : (
                    <div className="list-status-ongoing">Ongoing</div>
                  )}
                  <div className="card-button">View Details</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
