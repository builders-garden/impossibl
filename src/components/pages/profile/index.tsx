"use client";

import { Navbar } from "@/components/shared/navbar";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsWithQueryState,
} from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import type { User } from "@/types/user.type";
import { Website } from "../website";
import { ProfileHeader } from "./profile-header";

export const ProfilePage = ({ user }: { user: User }) => {
  const { isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();

  if (isInBrowser) {
    return <Website page={`profile/${user.id}`} />;
  }

  if (!isAuthenticated) {
    return <div>You are not authorized to view this profile</div>;
  }

  return (
    <div className="no-scrollbar mx-auto flex size-full max-w-md flex-col gap-2 overflow-x-hidden">
      <Navbar />

      <div className="flex size-full max-w-md flex-col gap-4 px-4 pb-12">
        <ProfileHeader user={user} />

        {/* User stats and activity */}
        <TabsWithQueryState
          className="mb-4 w-full"
          defaultValue="tab1"
          queryKey="profile"
        >
          <TabsList className="flex w-full justify-between">
            <TabsTrigger className="w-full" value="tab1">
              Tab1
            </TabsTrigger>
            <TabsTrigger className="w-full" value="tab2">
              Tab2
            </TabsTrigger>
          </TabsList>
          <TabsContent className="my-4" value="tab1">
            Tab 1
          </TabsContent>
          <TabsContent className="my-4" value="tab2">
            Tab 2
          </TabsContent>
        </TabsWithQueryState>
      </div>
    </div>
  );
};
