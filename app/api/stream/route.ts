import { prismaClient } from "@/app/LIB/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
const YT_REGEX = new RegExp("^https:\/\/www\.youtube\.com\/watch\\?v=([a-zA-Z0-9_-]{11})(?:&t=\\d+s)?$");

const createstreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // ADD RATE LIMITING HERE 
    const data = createstreamSchema.parse(await req.json());
    
    const isYt = YT_REGEX.test(data.url);
    if (!isYt) {
      return NextResponse.json(
        { message: "wrong url" },
        { status: 411 }
      );
    }

    const extractId = data.url.split("?v=")[1]?.split("&")[0];
     const res= await youtubesearchapi.GetVideoDetails(extractId);
   
     const title=res.title;
     const thumbnails=res.thumbnail.thumbnails;
     thumbnails.sort((a: { width: number }, b: { width: number }) => (a.width < b.width ? -1 : 1));

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractId: extractId,
        type: "Youtube",
        upvotes:0,
        title:res.title,
        smallImg: thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url,
        BigImg: thumbnails[thumbnails.length - 1].url,

      },
    });

    return NextResponse.json({ message: "Stream added successfully", stream }, { status: 200 });

  } catch (error) {
    console.error("Error while adding stream:", error);
    return NextResponse.json(
      { message: "error while adding a stream" },
      { status: 500 }
    );
  }
}





export async function GET(req: NextRequest) {
    const creatorId= req.nextUrl.searchParams.get("creatorId");
    const streams=await prismaClient.stream.findMany({
        where:{
             userId:creatorId??""
        }
    })
    return NextResponse.json(
       streams
      );


}
