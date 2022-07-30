const active = {
  img: "https://images.unsplash.com/photo-1644982648600-4583461837f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=824&q=80",
  name: "Channel name",
};

const data = [
  {
    img: "https://images.unsplash.com/photo-1644982648600-4583461837f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=824&q=80",
    name: "Channel name",
  },
  {
    img: "https://images.unsplash.com/photo-1644982648600-4583461837f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=824&q=80",
    name: "Channel name",
  },
  {
    img: "https://images.unsplash.com/photo-1644982648600-4583461837f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=824&q=80",
    name: "Channel name",
  },
];

export const Settings = () => {
  return (
    <div className="hero">
      <div className="list-main flex">
        <div className="list-heading">Settings</div>
        <div className="list-items">
          {/* <div className="list-item flex">
            <div className="setting-active-flex flex">
              <div className="setting-channel-active-img flex">
                <img src={active.img} alt="" />
              </div>
              <div className="setting-channel-name">
                {active.name}
                <div className="setting-active-status">Active</div>
              </div>
            </div>
          </div> */}
          {data.map((el) => {
            return (
              <>
                <div className="list-item flex">
                  <div className="flex">
                    <div className="list-item-title">
                      <div className="setting-channel-img flex">
                        <img
                          src="https://images.unsplash.com/photo-1644982648600-4583461837f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=824&q=80"
                          alt=""
                        />
                        <div className="setting-channel-name">Channel 101</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <button className="card-button">Remove</button>
                  </div>
                </div>
              </>
            );
          })}
          <div className="list-item flex">
            <div className="flex">
              <div className="list-item-title setting-add-tilte">Link another channel</div>
            </div>
            <div className="flex">
              <button className="card-button">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
