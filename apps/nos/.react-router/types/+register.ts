import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/auth/:pathname": {
    "pathname": string;
  };
  "/example": {};
  "/sign-in": {};
  "/upload": {};
  "/home": {};
};