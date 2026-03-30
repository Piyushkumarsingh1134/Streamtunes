import { prismaClient } from "@/app/LIB/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";
import { Session } from "node:inspector/promises";
const YT_REGEX = new RegExp("^https:\/\/www\.youtube\.com\/watch\\?v=([a-zA-Z0-9_-]{11})(?:&t=\\d+s)?$");

const createstreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // ADD RATE LIMITING HERE 
    const data = createstreamSchema.parse(await req.json());
    console.log(data);
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
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const creatorId = searchParams.get("creatorId");
 

  

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


  // if (creatorId !== user.id) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  // }

  const [streams, activeStream] = await Promise.all([
    prismaClient.stream.findMany({
      where: {
        userId: creatorId,
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        upvotes: {
          where: {
            userId: user.id,
          },
        },
      },
    }),
    prismaClient.currentstream.findFirst({
      where: {
        userId: creatorId,
      },
      include: {
        stream: true,
      },
    }),
  ]);



  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      upvotes: _count.upvotes,
      haveUpvoted: rest.upvotes.length? true:false,
    })),
     activeStream
  });
}