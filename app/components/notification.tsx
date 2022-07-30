import { RiErrorWarningFill } from "react-icons/ri";

export type ErrorProps = {
  results: { err: string }[];
};

export const Notification = () => {
  const err = "error 101";

  return (
    <>
      <div className="notification">
        <div className="notification-icon icon">
          <RiErrorWarningFill />
        </div>
        <div className="notification-text">{err}</div>
      </div>
    </>
  );
};
