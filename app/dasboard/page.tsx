"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ChevronUp, ChevronDown, Play, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import Streamview from "../components/Streamview"

interface Stream {
  id: string
  type: string
  url: string
  extractId: string
  title: string
  smallImg: string
  BigImg?: string
  active: boolean
  upvotes: number
  userId: string
  Upvote: number
  haveupvote: boolean
}

interface Song {
  id: string
  title: string
  upvotes: number
  downvotes: number
  thumbnail: string
  haveupvote: boolean
}

const REFRESH_INTERVAL = 10 * 1000

import { useSession } from "next-auth/react";


export default function Dashboard() {
  const { data: session, status } = useSession();


  console.log(session);

  if (status === "loading") return <div>Loading...</div>;
  if (!session || !session.user.id) return <div>Not authorized</div>;

  const creatorId = session.user.id;

  return <Streamview creatorId={creatorId}  />;
}


//   const [songUrl, setSongUrl] = useState("")
//   const [queue, setQueue] = useState<Song[]>([])
//   const [currentSong, setCurrentSong] = useState<Song | null>(null)
//   const [isAdding, setIsAdding] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   async function refreshStreams() {
//     try {
//       const res = await axios.get(`/api/stream/?creatorId=${creatorId}`, { withCredentials: true })

//       // Safely access the streams data with proper validation
//       const streams = res.data.streams || []

//       // Make sure streams is an array before processing
//       if (!Array.isArray(streams)) {
//         console.error("API response doesn't contain an array of streams:", res.data)
//         setError("Invalid data format received from server")
//         return
//       }

//       // Sort by upvotes descending
//       const sorted = streams.sort((a: Stream, b: Stream) => (b.upvotes ?? 0) - (a.upvotes ?? 0))

//       // Set "Now Playing" (top-voted) and "Upcoming Songs" (rest)
//       const top = sorted.length > 0 ? sorted[0] : null
//       const rest = sorted.length > 1 ? sorted.slice(1) : []

//       setCurrentSong(
//         top
//           ? {
//               id: top.id,
//               title: top.title || "Untitled",
//               upvotes: top.upvotes ?? 0,
//               downvotes: 0,
//               thumbnail: top.smallImg || "/placeholder.svg?height=80&width=120",
//               haveupvote: top.haveupvote,
//             }
//           : null,
//       )

//       setQueue(
//         rest.map((stream: Stream) => ({
//           id: stream.id,
//           title: stream.title || "Untitled",
//           upvotes: stream.upvotes ?? 0,
//           downvotes: 0,
//           thumbnail: stream.smallImg || "/placeholder.svg?height=80&width=120",
//           haveupvote: stream.haveupvote,
//         })),
//       )
//     } catch (error) {
//       console.error("Error refreshing streams:", error)
//       setError("Failed to load streams. Please try again.")
//     }
//   }

//   // Log the API response for debugging
//   useEffect(() => {
//     const debugApiResponse = async () => {
//       try {
//         const res = await axios.get(`/api/stream/?creatorId=${creatorId}`, { withCredentials: true })
//         console.log("API Response:", res.data)
//       } catch (error) {
//         console.error("Debug API error:", error)
//       }
//     }

//     debugApiResponse()
//   }, [])

//   useEffect(() => {
//     refreshStreams()
//     const interval = setInterval(refreshStreams, REFRESH_INTERVAL)
//     return () => clearInterval(interval)
//   }, [])

//   const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSongUrl(e.target.value)
//     setError(null)
//   }

//   const handleAddToQueue = async () => {
//     if (!songUrl.trim()) {
//       setError("Please enter a valid YouTube URL.")
//       return
//     }

//     setIsAdding(true)
//     setError(null)

//     try {
//       await axios.post(
//         "/api/stream",
//         {
//           url: songUrl,
//           creatorId: creatorId,
//         },
//         { withCredentials: true },
//       )
//       await refreshStreams()
//       setSongUrl("")
//     } catch (error) {
//       console.error("Error adding stream:", error)
//       setError("Failed to add stream. Please try again.")
//     } finally {
//       setIsAdding(false)
//     }
//   }

//   const handleUpvote = async (id: string) => {
//     try {
//       await axios.post("/api/stream/upvote", { streamId: id }, { withCredentials: true })
//       await refreshStreams()
//     } catch (error) {
//       console.error("Error upvoting stream:", error)
//       setError("Failed to upvote stream.")
//     }
//   }

//   const handleDownvote = async (id: string) => {
//     try {
//       await axios.post("/api/stream/downvote", { streamId: id }, { withCredentials: true })
//       await refreshStreams()
//     } catch (error) {
//       console.error("Error downvoting stream:", error)
//       setError("Failed to downvote stream.")
//     }
//   }

//   const handlePlayNext = () => {
//     if (queue.length === 0) return

//     // Move the next top-voted song to "Now Playing"
//     const sortedQueue = [...queue].sort((a, b) => b.upvotes - a.upvotes)
//     const nextSong = sortedQueue[0]

//     setCurrentSong(nextSong)
//     setQueue((prev) => prev.filter((song) => song.id !== nextSong.id))
//   }

//   const handleShare = () => {
//     navigator.clipboard.writeText(window.location.href)
//     alert("Link copied to clipboard!")
//   }

//   // Render Upvote or Downvote button based on haveupvote
//   const renderVoteButton = (song: Song) => {
//     if (!song.haveupvote) {
//       return (
//         <button
//           onClick={() => handleUpvote(song.id)}
//           className="text-indigo-200 hover:text-yellow-300 active:scale-110 transition-all duration-200 relative"
//           aria-label="Upvote"
//         >
//           <ChevronUp className="h-5 w-5" />
//           <span className="ml-1">Upvote</span>
//         </button>
//       )
//     } else {
//       return (
//         <button
//           onClick={() => handleDownvote(song.id)}
//           className="text-indigo-200 hover:text-red-400 active:scale-110 transition-all duration-200 relative"
//           aria-label="Downvote"
//         >
//           <ChevronDown className="h-5 w-5" />
//           <span className="ml-1">Downvote</span>
//         </button>
//       )
//     }
//   }

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4 md:p-8">
//       <div className="max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-br from-purple-900/90 to-indigo-900/90 text-white shadow-xl relative backdrop-blur-sm">
//         <button
//           onClick={handleShare}
//           className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-500 p-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
//           aria-label="Share"
//         >
//           <Share2 className="h-5 w-5" />
//         </button>

//         <div className="mb-6">
//           <Input
//             value={songUrl}
//             onChange={handleUrlChange}
//             placeholder="Paste YouTube link here"
//             className="bg-indigo-800/30 border-indigo-600/50 text-white placeholder-indigo-300/80 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 py-2.5"
//             disabled={isAdding}
//           />
//           {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
//           <Button
//             onClick={handleAddToQueue}
//             className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
//             disabled={isAdding}
//           >
//             {isAdding ? "Adding..." : "Add to Queue"}
//           </Button>
//         </div>

//         <h2 className="text-2xl font-bold mb-4 text-indigo-100 tracking-tight">Now Playing</h2>
//         <div className="p-6 bg-indigo-800/50 rounded-lg text-center mb-6 shadow-inner min-h-[150px] flex items-center justify-center">
//           {currentSong ? (
//             <div className="flex flex-col items-center">
//               <img
//                 src={currentSong.thumbnail || "/placeholder.svg"}
//                 alt={currentSong.title}
//                 className="w-32 h-24 mx-auto rounded-md mb-3 object-cover shadow-md"
//               />
//               <p className="font-semibold text-indigo-100 mb-3">{currentSong.title}</p>
//               <div className="flex space-x-2">
//                 {renderVoteButton(currentSong)}
//                 <span className="mx-2 font-medium text-indigo-100">{currentSong.upvotes}</span>
//               </div>
//             </div>
//           ) : (
//             <p className="text-indigo-300/80">No video playing</p>
//           )}
//         </div>

//         <h2 className="text-2xl font-bold mb-4 text-indigo-100 tracking-tight">Upcoming Songs</h2>
//         <div className="space-y-3 mb-6">
//           {queue.map((song) => (
//             <div
//               key={song.id}
//               className="flex items-center justify-between p-3 bg-indigo-800/50 rounded-lg shadow-sm hover:bg-indigo-700/50 transition-all duration-300"
//             >
//               <img
//                 src={song.thumbnail || "/placeholder.svg"}
//                 alt={song.title}
//                 className="w-16 h-12 rounded-md object-cover shadow-sm"
//               />
//               <span className="flex-1 ml-4 font-medium truncate text-indigo-100">{song.title}</span>
//               <div className="flex space-x-2">
//                 {renderVoteButton(song)}
//                 <span className="mx-2 font-medium text-indigo-100">{song.upvotes}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <Button
//           onClick={handlePlayNext}
//           className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/50"
//           disabled={queue.length === 0}
//         >
//           <Play className="h-4 w-4 mr-2" />
//           Play Next
//         </Button>
//       </div>
//     </div>
  

