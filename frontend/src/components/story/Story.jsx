import React from "react";
import Footer from "../Footer.jsx";
import { useForm } from "react-hook-form";
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

export default function Story() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const userId = localStorage.getItem("userId");
      const payload = {
        media: data.media,
        userId,
      };
      const url = "https://pic-pe-api.vercel.app/story/create";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="flex items-center justify-center w-full flex-1">
        <Card className="w-full max-w-sm bg-black text-white">
          <CardHeader>
            <CardTitle>Create New Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="media">Image URL</Label>
                  <Input
                    id="media"
                    type="text"
                    {...register("media")}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Create Story
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2"></CardFooter>
          <ToastContainer />
        </Card>
      </div>
      <Footer />
    </div>
  );
}
