import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { UserCard } from "~/components/user";
import { requireUserFromUserId, requireUserId } from "~/models/user.server";
import type { ClientUser } from "~/zSchemas/zSchema";
import { ZClientUserSchema } from "~/zSchemas/zSchema";
import { AiOutlineHome } from "react-icons/ai";

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
      <div className="min-h-screen border-r border-black flex flex-col gap-y-2">
        <UserCard clientUser={loaderData.clientUser} />
        <Link
          className="flex gap-x-2 items-bottom px-3 py-2 text-gray-500"
          to={`/user/${loaderData.clientUser.userId}`}
        >
          <AiOutlineHome size="25px" />
          <span className="text-lg mt-[0.125rem]">Home</span>
        </Link>
        <div className="grid place-items-center">
          <Link
            to="/logout"
            className="border-[2px] border-gray-600  text-gray-600 px-12 py-2 rounded-md"
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
