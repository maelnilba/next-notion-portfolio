// global styles shared across the entire site
import "styles/global.css";

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-coy.css";

// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'

// global style overrides for notion
import "styles/notion.css";

// global style overrides for prism theme (optional)
import "styles/prism-theme.css";

import * as React from "react";
import * as Fathom from "fathom-client";
import type { AppContext, AppProps } from "next/app";
import { useRouter } from "next/router";
import posthog from "posthog-js";
export { reportWebVitals } from "next-axiom";
import { log } from "next-axiom";
import { bootstrap } from "lib/bootstrap-client";
import {
  isServer,
  fathomId,
  fathomConfig,
  posthogId,
  posthogConfig,
} from "lib/config";
import App from "next/app";

if (!isServer) {
  bootstrap();
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview();
      }

      if (posthogId) {
        posthog.capture("$pageview");
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig);
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig);
    }

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  if (appContext.ctx.req) {
    const forwarded = appContext.ctx.req.headers["x-forwarded-for"];
    const ip = forwarded
      ? (typeof forwarded !== "string" ? "" : forwarded).split(/, /)[0]
      : appContext.ctx.req.socket.remoteAddress;
    const query = appContext.ctx.query?.pageId || "app";
    log.info("Connection", { ip, page: query });
    await log.flush();
  }

  return { ...appProps };
};

// export async function getServerSideProps({ req }) {
//   const forwarded = req.headers["x-forwarded-for"]
//   const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
//   return {
//     props: {
//       ip,
//     },
//   }
// }
