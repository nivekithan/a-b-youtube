import { Form } from "@remix-run/react";
import type { ActionFunction} from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { badRequest, generateGoogleSignUpUrl } from "~/server/utils.server";

const validActionTypes = {
  connectGoogle: "connectGoogle",
};

type ActionData = {
  errorMessage?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const actionType = formData.get("actionType");

  if (actionType === null || typeof actionType !== "string") {
    return badRequest<ActionData>({
      errorMessage: `Parameter actionType is missing`,
    });
  }

  if (!(actionType in validActionTypes))
    return badRequest<ActionData>({
      errorMessage: `Unknown actionType ${actionType}`,
    });


  if (actionType === validActionTypes.connectGoogle) {
    const redirectUrl = generateGoogleSignUpUrl();
    return redirect(redirectUrl);
  }
};

export default function Index() {
  return (
    <div>
      <Form className="m-5" method="post">
        <button
          name="actionType"
          value={validActionTypes.connectGoogle}
          className="bg-blue-800 text-white px-3 py-2 rounded-md"
        >
          Verify with Google
        </button>
      </Form>
    </div>
  );
}
