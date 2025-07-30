import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePicture from "@/components/profile/ProfilePicture";
import ProfileForm from "@/components/profile/ProfileForm";
import PasswordForm from "@/components/profile/PasswordForm";
import Preferences from "@/components/profile/Preferences";
import ActivityLogs from "@/components/profile/ActivityLogs";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <section className="relative flex min-h-screen w-full flex-col bg-[#fafbf9] px-4 py-6 md:px-8 lg:px-20 xl:px-32 font-sans">
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-10 w-full max-w-7xl mx-auto">
        {/* Sidebar Column */}
        <aside className="hidden xl:flex flex-col gap-6">
          <ProfilePicture />
          <Preferences />
        </aside>

        {/* Main Content */}
        <main className="flex flex-col gap-10">
          <ProfileHeader />

          <div className="space-y-8">
            <ProfileForm />
            <PasswordForm />
            <ActivityLogs />
          </div>
        </main>
      </div>
    </section>
  );
}
