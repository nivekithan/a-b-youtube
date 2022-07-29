import { Link } from "@remix-run/react";
import { FaGoogle, FaUserAlt } from "react-icons/fa";

const Svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      id="visual"
      viewBox="0 0 960 540"
      version="1.1"
    >
      <path
        d="M0 82L40 88.3C80 94.7 160 107.3 240 110C320 112.7 400 105.3 480 99.8C560 94.3 640 90.7 720 80.8C800 71 880 55 920 47L960 39L960 0L920 0C880 0 800 0 720 0C640 0 560 0 480 0C400 0 320 0 240 0C160 0 80 0 40 0L0 0Z"
        fill="#171821"
      />
      <path
        d="M0 114L40 124C80 134 160 154 240 157.7C320 161.3 400 148.7 480 146.8C560 145 640 154 720 145.8C800 137.7 880 112.3 920 99.7L960 87L960 37L920 45C880 53 800 69 720 78.8C640 88.7 560 92.3 480 97.8C400 103.3 320 110.7 240 108C160 105.3 80 92.7 40 86.3L0 80Z"
        fill="#37414e"
      />
      <path
        d="M0 201L40 214.5C80 228 160 255 240 260.3C320 265.7 400 249.3 480 266.3C560 283.3 640 333.7 720 338.2C800 342.7 880 301.3 920 280.7L960 260L960 85L920 97.7C880 110.3 800 135.7 720 143.8C640 152 560 143 480 144.8C400 146.7 320 159.3 240 155.7C160 152 80 132 40 122L0 112Z"
        fill="#59707e"
      />
      <path
        d="M0 471L40 468.3C80 465.7 160 460.3 240 454.8C320 449.3 400 443.7 480 449.8C560 456 640 474 720 471.3C800 468.7 880 445.3 920 433.7L960 422L960 258L920 278.7C880 299.3 800 340.7 720 336.2C640 331.7 560 281.3 480 264.3C400 247.3 320 263.7 240 258.3C160 253 80 226 40 212.5L0 199Z"
        fill="#7da3ad"
      />
      <path
        d="M0 541L40 541C80 541 160 541 240 541C320 541 400 541 480 541C560 541 640 541 720 541C800 541 880 541 920 541L960 541L960 420L920 431.7C880 443.3 800 466.7 720 469.3C640 472 560 454 480 447.8C400 441.7 320 447.3 240 452.8C160 458.3 80 463.7 40 466.3L0 469Z"
        fill="#a9d9d8"
      />
    </svg>
  );
};

export type SignInProps = {
  googleAuthUrl: string;
};

export const Signin = ({ googleAuthUrl }: SignInProps) => {
  return (
    <div className="signin">
      <div className="bg-svg">
        <Svg />
      </div>
      <div className="signin-card flex">
        <div className="signin-card-title">A/B Testing Made Easy</div>
        <div>
          <div className="signin-card-button">
            <a href={googleAuthUrl}>
              <div className="icon">
                <FaGoogle />
              </div>
              Continue with Google
            </a>
          </div>
          <div className="signin-card-button">
            <Link to="/api/v1/demo">
              <div className="icon">
                <FaUserAlt />
              </div>
              Checkout with demo account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
