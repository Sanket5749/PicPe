import React, { useEffect, useState } from "react";
import Rendering from "../Rendering.jsx";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

function SplashScreen() {
  return <Rendering />;
}

export default function Login() {
  const [showSplash, setShowSplash] = useState(true);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data) => {
    try {
      const url = "https://pic-pe-api.vercel.app/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const { success, message, error, token, username } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", username);
        const userRes = await fetch("http://localhost:8080/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (userData.success && userData.user && userData.user._id) {
          localStorage.setItem("userId", userData.user._id);
        }
        setTimeout(() => {
          navigate("/home");
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
      {showSplash && <SplashScreen />}
      {!showSplash && (
        <Card className="w-full max-w-sm bg-black text-white">
          <CardHeader>
            <CardTitle>Login to PicPe</CardTitle>
            <CardAction>
              <Link to={"/signup"}>
                <Button variant="link">Sign Up</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2"></CardFooter>
          <ToastContainer />
        </Card>
      )}
    </div>
  );
}
