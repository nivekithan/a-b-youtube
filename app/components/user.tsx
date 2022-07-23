import type { ClientUser } from "~/zSchemas/zSchema";
import { Link } from "@remix-run/react";

export type UserCardProps = {
  clientUser: ClientUser;
};
export const UserCard = ({ clientUser }: UserCardProps) => {
  return <p>Return Something</p>;
};
