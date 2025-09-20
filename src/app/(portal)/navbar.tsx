"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CustomImage from "@/components/ui/custom-image";
// import HttpClient from "@/lib/http_client";

const images = [
  "https://picsum.photos/id/1018/1920/1080",
  "https://picsum.photos/id/1015/1920/1080",
  "https://picsum.photos/id/1019/1920/1080",
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  // const [setting, setSetting] = useState({} as SettingState);

  // const fetchSetting = async (query: string = "") => {
  //   const { data } = await HttpClient.GET("setting", {});
  //   setSetting(data.data);
  // };

  // useEffect(() => {
  //   fetchSetting();
  // }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent hidden md:flex"
      }`}>
      <div className="container mx-auto px-24 ">
        <div className="flex items-center justify-between py-4">
          <div className="text-2xl font-bold ">
            {/* <Link href="/" className="flex items-center space-x-2">
              <CustomImage
                alt="Logo"
                src={setting.app_logo_alternative}
                height={50}
                width={50}
              />
              <span className="ml-2 text-lg font-bold">{setting.app_name}</span>
            </Link> */}
          </div>

          <NavigationMenu className="hidden md:flex ">
            <nav className="ml-auto flex gap-4 sm:gap-6">
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#services">
                Layanan
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#why-us">
                Mengapa Kami
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#testimonials">
                Testimoni
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#contact">
                Kontak
              </Link>
            </nav>
          </NavigationMenu>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="#services">
                  Layanan
                </Link>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="#why-us">
                  Mengapa Kami
                </Link>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="#testimonials">
                  Testimoni
                </Link>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="#contact">
                  Kontak
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
