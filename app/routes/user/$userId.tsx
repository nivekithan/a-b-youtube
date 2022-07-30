import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { requireUserFromUserId, requireUserId } from "~/models/user.server";
import type { ClientUser } from "~/zSchemas/zSchema";
import { ZClientUserSchema } from "~/zSchemas/zSchema";
import { Navbar } from "~/components/navbar";
import { useEffect, useState } from "react";
import { Notification } from "~/components/notification";

const ZLoaderSchema = z.object({
  clientUser: ZClientUserSchema,
});

type LoaderData = z.infer<typeof ZLoaderSchema>;

const getActiveNavSection = (userId: string) => {
  if (typeof window !== "undefined") {
    const url = window.location.href;
    const lastPath = new URL(url).pathname.split("/").pop();

    if (lastPath === userId) {
      return "home";
    } else if (lastPath === "results" || lastPath?.startsWith("record")) {
      return "results";
    } else if (lastPath === "settings") {
      return "settings";
    }
  }
  return "home";
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const user = await requireUserFromUserId(userId);

  const clientUser: ClientUser = {
    name: user.name,
    userId: userId,
    pictureUrl: user.pictureUrl,
  };

  return json<LoaderData>({
    clientUser: clientUser,
  });
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderUserPage() {
  const loaderData = useZLoaderData();
  // const actionData = useActionData();

  const [activeState, setActiveState] = useState<
    "home" | "results" | "settings" | ""
  >("");

  useEffect(() => {
    const activeSection = getActiveNavSection(loaderData.clientUser.userId);

    if (activeSection !== activeState) {
      setActiveState(activeSection);
    }
  });

  return (
    <div className="App flex">
      {/* <div className="notification-panel">
        <Notification error="Some error" />
    
      </div> */}
      <Navbar active={activeState} userId={loaderData.clientUser.userId} />
      <Outlet />
    </div>
  );
}
