 import { prismaClient } from "@/app/LIB/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const upvoteSchema=z.object({
    streamId:z.string(),

})


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();

         if(!session?.user?.email){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); 
         }

     const user=await prismaClient.user.findFirst({
        where:{
            email:session.user.email
        }

     })


     
     if(!user){
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 }); 
     }
        const data = upvoteSchema.parse(await req.json());
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId,
              
            },
          });
          
    } catch (error) {
        
    }
}