import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type BigOutlineButtonProps =
  {} & ButtonHTMLAttributes<HTMLButtonElement>;

export const BigOutlineButton = ({
  children,
  ...props
}: BigOutlineButtonProps) => {
  return (
    <button
      className="border-[3px] border-black px-14 py-2 rounded-md grid place-items-center"
      {...props}
    >
      {children}
    </button>
  );
};

export type BigOutlineLinkProps = {} & AnchorHTMLAttributes<HTMLAnchorElement>;
export const BigOutlineLink = ({ children, ...props }: BigOutlineLinkProps) => {
  return (
    <a
      className="border-[3px] border-black px-14 py-2 rounded-md grid place-items-center"
      {...props}
    >
      {children}
    </a>
  );
};
