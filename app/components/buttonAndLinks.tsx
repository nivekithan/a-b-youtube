import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type BigOutlineButtonProps =
  {} & ButtonHTMLAttributes<HTMLButtonElement>;

export const BigOutlineButton = ({
  children,
  ...props
}: BigOutlineButtonProps) => {
  return (
    <button
      className="border-[3px] border-black px-14 py-2 rounded-md"
      {...props}
    >
      {children}
    </button>
  );
};

export type BigOutlineLinkProps = {} & AnchorHTMLAttributes<HTMLAnchorElement>;
export const BigOutlineLink = ({ children, ...props }: BigOutlineLinkProps) => {
  return (
    <a className="border-[3px] border-black px-14 py-2 rounded-md" {...props}>
      {children}
    </a>
  );
};
