import { Drawer, Stack } from "@mui/material";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { UserCard } from "~/components/user";
import { requireUserFromUserId, requireUserId } from "~/models/user.server";
import type { ClientUser } from "~/zSchemas/zSchema";
import { ZClientUserSchema } from "~/zSchemas/zSchema";

const ZLoaderSchema = z.object({ clientUser: ZClientUserSchema });

type LoaderData = z.infer<typeof ZLoaderSchema>;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const user = await requireUserFromUserId(userId);

  const clientUser: ClientUser = {
    name: user.name,
    userId: userId,
    pictureUrl: user.pictureUrl,
  };

  return json<LoaderData>({ clientUser: clientUser });
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderUserPage() {
  const loaderData = useZLoaderData();

  return (
    <div className="flex">
      <div className="min-h-screen border-r border-black flex flex-col gap-y-2 items-center">
        <UserCard clientUser={loaderData.clientUser} />
        <div>
          <Link
            to="/logout"
            className="bg-gray-700 text-white px-12 py-2 rounded-md"
          >
            Logout
          </Link>
        </div>
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
