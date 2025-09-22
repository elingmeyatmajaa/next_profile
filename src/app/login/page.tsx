"use client";

import PasswordForm from "@/components/custom/password_form";
import PrimaryButton from "@/components/custom/primary_button";
import Text from "@/components/custom/text";
import TextForm from "@/components/custom/text_form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, setEmail, setPassword } from "./redux/login_slice";
import { User } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const login = useSelector((state: any) => state.login as LoginState);
  const dispatch = useDispatch();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loginThunk = loginAction(login.email, login.password) as any;
    dispatch(loginThunk);
  }

  useEffect(() => {
    if (login.isLoggedIn) {
      router.replace("/admin/");
    }
  }, [login.isLoggedIn]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Left side: background image + tagline */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src="https://picsum.photos/id/1015/1600/1200"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative z-10 flex flex-col justify-center items-start p-20 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg opacity-90">
            Masuk ke dashboard admin untuk mengelola aplikasi dengan mudah.
          </p>
        </div>
      </div>

      {/* Right side: login form */}
      <div className="flex w-full lg:w-5/12 justify-center items-center bg-gray-50 dark:bg-gray-800">
        <Card className="w-10/12 max-w-md rounded-2xl shadow-xl border bg-white dark:bg-gray-900 dark:border-gray-700">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-center">
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                <Text>Login to Your Account</Text>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit}>
              {/* Email */}
              <div className="mb-4">
                <TextForm
                  className="rounded-xl shadow-sm px-4 py-3 dark:bg-gray-800 dark:text-gray-100"
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                  value={login.email}
                  error={login.errors.email}
                  placeholder="Email"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <PasswordForm
                  className="rounded-xl shadow-sm px-4 py-3 dark:bg-gray-800 dark:text-gray-100"
                  placeholder="Password"
                  type="password"
                  onChange={(e) => dispatch(setPassword(e.target.value))}
                  value={login.password}
                  error={login.errors.password}
                />
              </div>

              {/* Login button */}
              <PrimaryButton
                className="w-full rounded-xl py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                isLoading={login.isLoading}
              >
                Login
              </PrimaryButton>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="mx-2 text-gray-400 dark:text-gray-500 text-sm">
                  or
                </span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Social login */}
              <button
                className="flex items-center justify-center gap-3 border rounded-xl w-full py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition dark:border-gray-600"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/admin",
                  })
                }
                type="button"
              >
                <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Sign in with Google
                </span>
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
