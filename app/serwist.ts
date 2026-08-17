import withSerwistInit from "@serwist/next";

declare global {
  interface Window {
    __SW_MANIFEST: unknown;
  }
}

export default withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});
