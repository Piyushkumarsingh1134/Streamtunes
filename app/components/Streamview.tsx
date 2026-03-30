"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Play, Share2, ExternalLink } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { YT_REGEX } from "../LIB/utill"
import { Appbar } from "./Appbar"

interface Video {
  id: string
  type: string
  url: string
  extractId: string
  title?: string
  smallImg: string
  bigImg: string
  active: boolean
  userId: string
  upvotes: number
  haveUpvoted: boolean
}

const REFRESH_INTERVAL_MS = 10 * 1000

export default function StreamView({ creatorId }: { creatorId: string }) {
  const [inputLink, setInputLink] = useState("")
  const [queue, setQueue] = useState<Video[]>([])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [admin, setAdmin] = useState(false)

  async function isAdmin() {
    try {
      const res = await fetch(`/api/stream/chekuser/?creatorId=${creatorId}`, {
        credentials: "include",
      })

      if (!res.ok) {
        console.error("Admin check failed:", res.status, res.statusText)
        setAdmin(false)
        return
      }

      const response = await res.json()
      console.log("Full isAdmin API response:", response)


      const isAdminUser = response.success === true
      console.log("Setting admin state to:", isAdminUser)
      setAdmin(isAdminUser)
    } catch (error) {
      console.error("Error checking admin status:", error)
      setAdmin(false)
    }
  }

  async function refreshStreams() {
    try {
      console.log("creatorId: ", creatorId)
      const res = await fetch(`/api/stream/?creatorId=${creatorId}`, {
        credentials: "include",
      })
      const fetchedStream = await res.json()

      if (!fetchedStream?.streams || !Array.isArray(fetchedStream.streams)) {
        console.error("Streams is undefined or not an array:", fetchedStream?.streams)
        setQueue([])
        setCurrentVideo(null)
        return
      }

      const sortedStream = fetchedStream.streams.sort((a: Video, b: Video) => b.upvotes - a.upvotes)
      setQueue(sortedStream)
      setCurrentVideo(sortedStream.length > 0 ? sortedStream[0] : null)
    } catch (error) {
      setQueue([])
      setCurrentVideo(null)
    }
  }

  useEffect(() => {
    console.log("Component mounted, checking admin status...")
    isAdmin()
    refreshStreams()
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [creatorId])

  useEffect(() => {
    console.log("loggin the current extractedId: ", currentVideo?.extractId)
    console.log("Admin state:", admin)
  }, [currentVideo, admin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputLink.match(YT_REGEX)) return

    setLoading(true)
    try {
      const res = await fetch("/api/stream/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId,
          url: inputLink,
        }),
      })
      const response = await res.json()
      if (response.error) {
        toast.error(response.error)
        return
      }
      setQueue((prev) => [...prev, response].sort((a, b) => b.upvotes - a.upvotes))
      setInputLink("")
      toast.success("Video added to queue!")
    } catch (error) {
      toast.error("Failed to add video")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (id: string, isUpvote: boolean) => {
    try {
      await fetch(`/api/stream/${isUpvote ? "upvote" : "downvote"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId: id }),
      })

      setQueue((prev) =>
        prev
          .map((video) =>
            video.id === id
              ? {
                  ...video,
                  upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                  haveUpvoted: isUpvote,
                }
              : video,
          )
          .sort((a, b) => b.upvotes - a.upvotes),
      )
    } catch (error) {
      toast.error("Failed to vote")
    }
  }

  const playNext = async () => {
    if (queue.length === 0) return

    try {
      const res = await fetch("/api/next", {
        method: "GET",
        credentials: "include",
      })
      const json = await res.json()
      if (json.stream) {
        setCurrentVideo(json.stream)
        setQueue((prev) => prev.filter((video) => video.id !== json.stream.id))
      }
    } catch (error) {
      toast.error("Failed to play next video")
    }
  }

  const handleShare = () => {
    const shareableLink = `${window.location.origin}/creator/${creatorId}`
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast.success("Link copied to clipboard!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    })
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <Appbar />
      <ToastContainer />

      <div className="container mx-auto px-4 py-6">
        {/* Current Video Section */}
        <div className="mb-8">
          <Card className="overflow-hidden border-purple-200 shadow-md">
            <CardContent className="p-0">
              {currentVideo ? (
                admin ? (
                
                  <div>
                    <div className="w-full flex justify-center relative" id={`video-container-${currentVideo.id}`}>
                      {iframeError ? (
                        <div className="flex items-center justify-center w-[640px] h-[360px] bg-gray-900 text-white">
                          <div className="text-center">
                            <p className="mb-4">This video cannot be played here due to embedding restrictions.</p>
                            <a
                              href={currentVideo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex items-center justify-center"
                            >
                              <svg
                                className="h-5 w-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                ></path>
                              </svg>
                              Watch on YouTube
                            </a>
                          </div>
                        </div>
                      ) : (
                        <>
                          <iframe
                            width="640"
                            height="360"
                            src={`https://www.youtube.com/embed/${currentVideo.extractId}`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title={currentVideo.title || "YouTube Video"}
                            onError={async (e) => {
                              console.error("Iframe error event:", e)
                              try {
                                const response = await fetch(
                                  `https://www.youtube.com/embed/${currentVideo.extractId}`,
                                  {
                                    method: "HEAD",
                                  },
                                )
                                if (!response.ok) {
                                  console.error(
                                    `Fetch failed for iframe src: HTTP ${response.status} - ${response.statusText}`,
                                  )
                                } else {
                                  console.log(
                                    "Fetch succeeded, but iframe still failed. Likely a browser or embedding restriction issue.",
                                  )
                                }
                              } catch (fetchError) {
                                console.error("Fetch error for iframe src:", fetchError)
                              }
                              setIframeError(true)
                            }}
                          />
                          <div className="absolute bottom-4 left-4">
                            <a
                              href={currentVideo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm flex items-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Watch on YouTube
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="p-4 bg-white">
                      <h2 className="text-xl font-semibold text-purple-900 mb-2">
                        {currentVideo.title || "Now Playing"}
                      </h2>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-700 font-medium">{currentVideo.upvotes} votes</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-300 text-purple-700 hover:bg-purple-100"
                            onClick={handleShare}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={playNext}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Play Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Limited UI for non-admin: only image and title
                  <div className="p-4 bg-white">
                    <div className="w-full flex justify-center">
                      <img
                        src={
                          currentVideo.bigImg ||
                          currentVideo.smallImg ||
                          `https://img.youtube.com/vi/${currentVideo.extractId}/maxresdefault.jpg`
                        }
                        alt={currentVideo.title || "Video thumbnail"}
                        className="w-full max-w-[640px] h-[360px] object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          // Try fallback images in order
                          if (target.src === currentVideo.bigImg) {
                            target.src =
                              currentVideo.smallImg ||
                              `https://img.youtube.com/vi/${currentVideo.extractId}/maxresdefault.jpg`
                          } else if (target.src === currentVideo.smallImg) {
                            target.src = `https://img.youtube.com/vi/${currentVideo.extractId}/maxresdefault.jpg`
                          } else if (target.src.includes("maxresdefault")) {
                            target.src = `https://img.youtube.com/vi/${currentVideo.extractId}/hqdefault.jpg`
                          } else {
                            target.src = "/placeholder.svg?height=360&width=640"
                          }
                        }}
                      />
                    </div>
                    <h2 className="text-xl font-semibold text-purple-900 mt-4 mb-2">
                      {currentVideo.title || "Now Playing"}
                    </h2>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-700 font-medium">{currentVideo.upvotes} votes</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-300 text-purple-700 hover:bg-purple-100"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full flex justify-center h-[360px] bg-purple-100 text-purple-600">
                  <div className="text-center p-8">
                    <h3 className="text-xl font-semibold mb-4">No video playing</h3>
                    {admin && (
                      <Button
                        variant="default"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={playNext}
                        disabled={queue.length === 0}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play First in Queue
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit Video Form */}
        <Card className="mb-8 border-purple-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Add to Queue</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Paste YouTube link here"
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                className="flex-1 border-purple-200 focus-visible:ring-purple-500"
              />
              <Button
                type="submit"
                disabled={loading || !inputLink.match(YT_REGEX)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? "Adding..." : "Add to Queue"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Queue List */}
        <div>
          <h3 className="text-xl font-semibold text-purple-900 mb-4">Video Queue</h3>
          {queue.length === 0 ? (
            <Card className="border-purple-200 shadow-sm">
              <CardContent className="p-6 text-center text-purple-600">
                <p>No videos in queue. Add one above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {queue
                .filter((video) => !currentVideo || video.id !== currentVideo.id)
                .map((video) => (
                  <Card key={video.id} className="border-purple-200 shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-28 relative">
                        <img
                          src={video.smallImg || "/placeholder.svg"}
                          alt={video.title || "Video thumbnail"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-purple-900 line-clamp-2">
                            {video.title || "Untitled Video"}
                          </h4>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-500 hover:text-purple-700 flex items-center mt-1"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on YouTube
                          </a>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center justify-end p-4 bg-purple-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(video.id, true)}
                          className={`text-purple-700 hover:text-purple-900 hover:bg-purple-100 ${
                            video.haveUpvoted ? "bg-purple-100" : ""
                          }`}
                        >
                          <ChevronUp className="h-5 w-5" />
                        </Button>
                        <span className="mx-2 sm:my-2 font-medium text-purple-900">{video.upvotes}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(video.id, false)}
                          className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                        >
                          <ChevronDown className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

