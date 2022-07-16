import type { ClientUser } from "~/zSchemas/zSchema";
import * as DropDownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "@remix-run/react";

export type UserCardProps = {
  clientUser: ClientUser;
};
export const UserCard = ({ clientUser }: UserCardProps) => {
  return (
    <DropDownMenu.Root>
      <DropDownMenu.Trigger className="flex gap-x-2 items-center">
        <img
          alt="User profile from google"
          src={clientUser.pictureUrl}
          className="h-[40px] w-[40px] rounded"
        />
        <h1 className="text-sm">{clientUser.name}</h1>
      </DropDownMenu.Trigger>
      <DropDownMenu.Content
        className="bg-gray-200 w-full rounded-md"
        portalled={false}
      >
        <DropDownMenu.Arrow className="fill-gray-200" />
        <DropDownMenu.Item className="w-full px-6 py-2">
          <Link to="/logout">Logout</Link>
        </DropDownMenu.Item>
      </DropDownMenu.Content>
    </DropDownMenu.Root>
  );
};
