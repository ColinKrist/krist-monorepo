import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientAuth } from "@/hooks/use-client-auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
const LogIn = () => {
  const client = useClientAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forget-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="grid gap-2">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
              placeholder="Password"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              onClick={() => {
                setRememberMe(!rememberMe);
              }}
            />
            <Label>Remember me</Label>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              try {
                await client.signIn.email(
                  {
                    email: email,
                    password: password,
                    callbackURL: "/dashboard",
                    rememberMe,
                  },
                  {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message);
                    },
                  }
                );
              } catch (error) {
                const typedError = error as Error;
                toast.error(JSON.stringify(typedError));
              }
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
          </Button>
          <div className="flex flex-wrap items-center gap-2 w-full">
            <Button
              variant="outline"
              className="gap-2 flex-1 w-full py-4"
              onClick={async () => {
                await client.signIn.social({
                  provider: "google",
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="currentColor"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="currentColor"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="currentColor"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="currentColor"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="gap-2 flex-1 w-full py-4"
              onClick={async () => {
                await client.signIn.social({
                  provider: "facebook",
                });
              }}
            >
              <>
                <svg
                  className="w-4 h-4 text-[#1877F2]"
                  fill="#fff"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                {"Continue with Facebook"}
              </>
            </Button>
            <Button
              variant="outline"
              className="gap-2 flex-1 w-full py-4"
              onClick={async () => {
                await client.signIn.social({
                  provider: "github",
                });
              }}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  fill="#fff"
                  fillRule="evenodd"
                />
              </svg>
              Continue with Github
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Developed with love ❤️ by{" "}
            <Link to="https://github.com/ColinKrist" className="underline">
              Colin Krist
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LogIn;
