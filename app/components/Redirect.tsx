"use client";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export function Redirect() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            router.push("/dasboard");
        }
    }, [session]);

    // Return null so it's a valid React component
    return null;
}
