import * as React from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
// import theme from "./src/theme";
// import styles from "./styles/app.css";
import variablesCss from "./styles/variables.css";
import homeCss from "./styles/home.css";
import navbarCss from "./styles/navbar.css";
import cardsCss from "./styles/cards.css";
import type { LinksFunction } from "@remix-run/server-runtime";

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = ({ children, title }: DocumentProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body id="app">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: variablesCss,
    },
    {
      rel: "stylesheet",
      href: navbarCss,
    },
    {
      rel: "stylesheet",
      href: homeCss,
    },
    {
      rel: "stylesheet",
      href: cardsCss,
    },
  ];
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

// // https://remix.run/docs/en/v1/api/conventions#errorboundary
// export function ErrorBoundary({ error }: { error: Error }) {
//   console.error(error);

//   return (
//     <Document title="Error!">
//       <div>
//         <h1>There was an error</h1>
//         <p>{error.message}</p>
//         <hr />
//         <p>
//           Hey, developer, you should replace this with what you want your users
//           to see.
//         </p>
//       </div>
//     </Document>
//   );
// }

// // https://remix.run/docs/en/v1/api/conventions#catchboundary
// export function CatchBoundary() {
//   const caught = useCatch();

//   let message;
//   switch (caught.status) {
//     case 401:
//       message = (
//         <p>
//           Oops! Looks like you tried to visit a page that you do not have access
//           to.
//         </p>
//       );
//       break;
//     case 404:
//       message = (
//         <p>Oops! Looks like you tried to visit a page that does not exist.</p>
//       );
//       break;

//     default:
//       throw new Error(caught.data || caught.statusText);
//   }

//   return (
//     <Document title={`${caught.status} ${caught.statusText}`}>
//       <h1>
//         {caught.status}: {caught.statusText}
//       </h1>
//       {message}
//     </Document>
//   );
// }
