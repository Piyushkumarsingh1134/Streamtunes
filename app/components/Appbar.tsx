"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Assuming rshadcn button is imported from here
import { Radio } from "lucide-react"; // Import the Radio icon

export function Appbar() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center px-20 h-14">
     
      <div className="flex items-center gap-2">
        <Radio className="h-6 w-6 text-purple-600" />
        <span className="text-xl font-bold">SteamTunes</span>
      </div>

      <div>
        {session?.user ? (
          <Button className="m-2 p-2 bg-purple-600 text-white hover:bg-purple-700" onClick={() => signOut()}>
            Sign Out
          </Button>
        ) : (
          <Button className="m-2 p-2 bg-purple-600 text-white hover:bg-purple-700" onClick={() => signIn()}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}







