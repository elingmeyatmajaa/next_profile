"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextForm from "@/components/custom/text_form";
import { setEmail, setPassword, loginAction } from "./redux/login_slice";
import { useDispatch, useSelector } from "react-redux";
import PasswordForm from "@/components/custom/password_form";
import PrimaryButton from "@/components/custom/primary_button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/custom/image";
import Text from "@/components/custom/text";
// import CustomImage from "@/components/ui/custom-image";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { User } from "lucide-react";
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
      // if(login.user.role === "admin") router.replace("/admin/");
      router.replace("/admin/");
    }
  }, [login.isLoggedIn]);

  // const [setting, setSetting] = useState({} as SettingState);

  // const fetchSetting = async (query: string = "") => {
  //   const { data } = await HttpClient.GET("setting", {});
  //   setSetting(data.data);
  // };

  // useEffect(() => {
  //   fetchSetting();
  // }, []);

  return (
    <div className="flex h-screen bg-cover">
      <div className="absolute -z-10 w-full h-screen">
        {/* <CustomImage
          className="w-full h-full object-cover"
          src={"https://picsum.photos/id/1015/1000/1000"}
          height={1000}
          width={1000}
        /> */}
      </div>
      <div className="hidden lg:inline-block flex-1 w-2/3 mt-96">
        <div className="ml-60 text-white text-lg font-normal">
          <div className="mb-3 font-medium">
            <Text>asd</Text>
          </div>
          <div className="">
            <Text>asdfa</Text>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-4/12 p-8 h-screen flex justify-center">
        <div className="my-auto w-10/12 ">
          <form action="" method="POST" onSubmit={onSubmit}>
            <Card className="rounded-2xl drop-shadow-xl border bg-white">
              <CardHeader className="">
                <div className="flex ">
                  {/* <CustomImage
                    src={"/logo.png"}
                    alt=""
                    width={56}
                    height={56}
                  /> */}
                  <CardTitle className="ml-3 text-xl">
                    <Text>asdf</Text>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mb-5">
                <div className="mb-5">
                  <TextForm
                    className={"rounded-3xl shadow"}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    value={login.email}
                    error={login.errors.email}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3">
                  <PasswordForm
                    className="rounded-3xl shadow"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                    value={login.password}
                    error={login.errors.password}
                  />
                </div>
                <div className="flex justify-center ">
                  <PrimaryButton
                    className=" w-full mt-5 rounded-3xl"
                    isLoading={login.isLoading}>
                    Login
                  </PrimaryButton>
                </div>
                <div className="mt-5">
                  <button
                    className="border flex justify-between rounded-full w-full p-3 mb-3"
                    onClick={() =>
                      signIn("google", {
                        callbackUrl: "/admin",
                      })
                    }
                    type="button">
                    <User />
                    <p className="flex-1">Sign in With Google</p>
                  </button>
                  {/* <button
                    className="border flex justify-between rounded-full w-full p-3 mb-3"
                    onClick={() =>
                      signIn("google", {
                        callbackUrl: "/admin",
                      })
                    }
                    type="button">
                    <IconBrandX />
                    <p className="flex-1">Sign in With X</p>
                  </button>
                  <button
                    className="border flex justify-between rounded-full w-full p-3"
                    onClick={() =>
                      signIn("google", {
                        callbackUrl: "/admin",
                      })
                    }
                    type="button">
                    <IconBrandGithub />
                    <p className="flex-1">Sign in With Github</p>
                  </button> */}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
