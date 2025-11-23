"use client";

import { ArrowLeftIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserProfile } from "./user-profile";

type NavbarProps = {
  title?: string;
  link?:
    | "/"
    | "/new"
    | "/play"
    | `/play/${string}`
    | `/profile/${string}`
    | "/leaderboard";
  showBackButton?: boolean;
};

export const Navbar = ({
  title = "Impossibl",
  link = "/",
  showBackButton = false,
}: NavbarProps) => (
  <motion.header
    animate={{ opacity: 1, y: 0 }}
    className="z-50 flex w-full items-center justify-between px-4 text-white"
    id="navbar"
    initial={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center gap-1">
      {showBackButton ? (
        <Button asChild size="icon" variant="ghost">
          <Link className="flex items-center justify-center" href={link}>
            <ArrowLeftIcon className="size-6" />
          </Link>
        </Button>
      ) : null}
      <Link
        className="flex cursor-pointer items-center justify-start"
        href={link}
      >
        <h1 className="font-extrabold text-2xl">{title}</h1>
      </Link>
    </div>

    <UserProfile />
  </motion.header>
);
