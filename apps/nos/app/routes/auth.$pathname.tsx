import { AuthCard } from "@daveyplate/better-auth-ui";
import { useParams } from "react-router";

export default function AuthPage() {
  const { pathname } = useParams();

  return (
    <div className="flex flex-col grow size-full items-center justify-center gap-3">
      <AuthCard pathname={pathname} />
    </div>
  );
}
