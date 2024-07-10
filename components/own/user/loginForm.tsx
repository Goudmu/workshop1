"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isloading, setisloading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session == null) {
      setisloading(false);
    }
  }, []);

  if (isloading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 flex items-center justify-center">
        <Button disabled>Please wait</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError("Incorrect Username or Password !!!");
    } else {
      router.push("/jurnalumum");
    }
  };

  if (session == null || session == undefined) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  if (session != null) {
    return <></>;
  }
};

export default SignIn;
