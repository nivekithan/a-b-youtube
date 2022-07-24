import type { ClientUser } from "~/zSchemas/zSchema";
import { Avatar, Typography } from "@mui/material";

export type UserCardProps = {
  clientUser: ClientUser;
};
export const UserCard = ({ clientUser }: UserCardProps) => {
  return (
    <div className="flex gap-x-2 items-center border-b border-black px-3 py-2">
      <Avatar
        alt={clientUser.name}
        src={clientUser.pictureUrl}
        className="border border-black"
      />
      <Typography variant="body2">{clientUser.name}</Typography>
    </div>
  );
};
