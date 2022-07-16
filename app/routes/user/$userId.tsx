import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { getUserFromUserId, requireUserId } from "~/models/user.server";
import type { ClientUser } from "~/zSchemas/zSchema";
import { ZClientUserSchema } from "~/zSchemas/zSchema";

const ZLoaderSchema = z.object({ clientUser: ZClientUserSchema });

type LoaderData = z.infer<typeof ZLoaderSchema>;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const user = await getUserFromUserId(userId);

  const clientUser: ClientUser = { name: user.name, userId: userId };

  return json<LoaderData>({ clientUser: clientUser });
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderUserHomePage() {
  const loaderData = useZLoaderData();

  return (
    <p>
      {`The name of user is ${loaderData.clientUser.name} and the userId is ${loaderData.clientUser.userId}`}
    </p>
  );
}
