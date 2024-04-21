"use client";

import { useSession } from "@/components/session/use-session";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type SigninForm = {
  email: string;
  password: string;
};

export default function SignIn() {
  const { setSession } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { register, handleSubmit } = useForm<SigninForm>({ mode: "onSubmit" });

  const onSubmit: SubmitHandler<SigninForm> = async (data) => {
    const res = await fetch("/api/auth/credentials-signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      // handle form / credentials errors
      setErrorMessage("Invalid credentials");
      return;
    }

    const session = await res.json();
    setSession(session);
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center pt-24">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 h-fit card shadow-xl p-4"
      >
        <div className="flex flex-col gap-1 grow">
          <label htmlFor="email">Email</label>
          <input
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9\+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            })}
            id="email"
            type="email"
            placeholder="john@gmail.com"
            className="input input-bordered"
          />
        </div>

        <div className="flex flex-col gap-1 grow">
          <label htmlFor="password">Password</label>
          <input
            {...register("password", {
              required: true,
            })}
            id="password"
            type="password"
            placeholder="Password"
            className="input input-bordered"
          />
        </div>

        <div className="flex justify-center items-center">
          <button className="btn btn-primary" type="submit">
            Sign In
          </button>
        </div>

        {errorMessage && <div className="alert">{errorMessage}</div>}
      </form>
    </div>
  );
}
