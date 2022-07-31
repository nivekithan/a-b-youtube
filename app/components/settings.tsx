// const data = [
//   {
//     img: "https://images.unsplash.com/photo-1644982648600-4583461837f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=824&q=80",
//     name: "Channel name",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1644982648600-4583461837f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=824&q=80",
//     name: "Channel name",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1644982648600-4583461837f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=824&q=80",
//     name: "Channel name",
//   },
// ];

import { Form } from "@remix-run/react";

export type SettingsProps = {
  accounts: { img: string; name: string; accountId: number }[];
  googleAuthUrl: string;
};

export const Settings = ({ accounts, googleAuthUrl }: SettingsProps) => {
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
          {accounts.map((account) => {
            return (
              <div key={account.accountId} className="list-item flex">
                <div className="flex">
                  <div className="list-item-title">
                    <div className="setting-channel-img flex">
                      <img src={account.img} alt="" />
                      <div className="setting-channel-name">{account.name}</div>
                    </div>
                  </div>
                </div>
                <Form className="flex" method="post">
                  <input
                    hidden
                    type="number"
                    value={account.accountId}
                    readOnly
                    name="accountId"
                  />
                  <button
                    className="card-button"
                    name="actionType"
                    value="removeAccount"
                  >
                    Remove
                  </button>
                </Form>
              </div>
            );
          })}
          <div className="list-item flex">
            <div className="flex">
              <div className="list-item-title setting-add-tilte">
                Link another channel
              </div>
            </div>
            <a href={googleAuthUrl} className="flex">
              <button className="card-button">Add</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
