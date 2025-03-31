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
  "/upload": {};
  "/home": {};
};