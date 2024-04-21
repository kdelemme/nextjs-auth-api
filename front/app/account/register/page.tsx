"use client";

import { useSession } from "@/components/session/use-session";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type RegisterForm = {
  email: string;
  password: string;
};

export default function Register() {
  const { setSession } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { register, handleSubmit } = useForm<RegisterForm>({
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    const res = await fetch(`/api/auth/credentials-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const session = await res.json();

    if (!res.ok) {
      setErrorMessage("Errors");
      return;
    }

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
            Register
          </button>
        </div>

        {errorMessage && <div className="alert">{errorMessage}</div>}
      </form>
    </div>
  );
}
