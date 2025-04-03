import LogIn from "@/components/login";

import type { Route } from "./+types/sign-in";

export const metadata: Route.MetaFunction = () => {
  return [
    {
      title: "Login - SnapTag 📸",
    },
  ];
};
export default function LoginPage() {
  return <LogIn />;
}
