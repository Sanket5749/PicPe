import React from "react";
import { useForm } from "react-hook-form";
import Footer from "../footer.jsx";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../utils.js";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const url = "https://pic-pe-api.vercel.app/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (error) {
        const details =
          error?.details?.[0]?.message || error.message || "An error occurred";
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-sm bg-black text-white">
        <CardHeader>
          <CardTitle>Signup To PicPe</CardTitle>
          <CardAction>
            <Link to={"/login"}>
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  {...register("username")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  {...register("email")}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  required
                />
              </div>
            </div> 
            <br />
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Signup
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <ToastContainer />
      </Card>
    </div>
  );
}
