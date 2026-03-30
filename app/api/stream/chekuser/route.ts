import { prismaClient } from "@/app/LIB/db";
import { Console } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const creatorId = searchParams.get("creatorId");

  console.log("from the  chekuser");
 
 

  

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  if (!creatorId) {
    return NextResponse.json({ message: "Creator ID is required" }, { status: 411 });
  }


 if (creatorId === user.id) {
  return NextResponse.json({ success: true }, { status: 200 });
  
} else {
  return NextResponse.json({ success: false }, { status: 200 });
}


}