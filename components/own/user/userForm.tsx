"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function UserComponent() {
  const [data, setData] = useState({
    username: "",
    password: "",
    photo: "",
    role: "admin",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const formDataHandler = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setData({
          username: "",
          password: "",
          photo: "",
          role: "admin",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-6 p-6 rounded-lg shadow-lg bg-card">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-card-foreground">
            Create New User
          </h1>
          <p className="text-muted-foreground">
            Enter your username and password to create a new one.
          </p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full" onClick={formDataHandler}>
            Create new Account
          </Button>
        </form>
      </div>
    </div>
  );
}
