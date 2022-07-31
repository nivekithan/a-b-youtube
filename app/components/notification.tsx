import { useEffect, useState } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import { ImCross } from "react-icons/im";

export type NotificationProps = {
  error?: string;
};

export const Notification = ({ error }: NotificationProps) => {
  const [show, setShow] = useState(error !== undefined);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setShow(false);
    }, 3_000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  return (
    <>
      {show ? (
        <div className="notification flex">
          <div className="notification-icon icon">
            <RiErrorWarningFill />
          </div>
          <div className="notification-text">{error}</div>
          <button
            className="notification-cancel"
            onClick={() => setShow(false)}
          >
            <ImCross />
          </button>
        </div>
      ) : null}
    </>
  );
};
