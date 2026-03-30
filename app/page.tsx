"use client";

import Image from "next/image";
import { Appbar } from "./components/Appbar";
import { ArrowRight, Radio, Twitch, Youtube, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Redirect } from "./components/Redirect";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Appbar />
        <Redirect />
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05]"></div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-purple-200/30 bg-purple-100/10 px-4 py-1 text-sm text-purple-100 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
                  </span>
                  Revolutionizing Stream Music
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  Let Your Fans Choose Your Stream Music
                </h1>
                <p className="max-w-[600px] text-purple-100/80 md:text-xl mx-auto">
                  SteamTunes connects creators with their audience through music. Let your fans vote on what plays next
                  during your stream and boost engagement.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-100">
                  Start For Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-purple-400/30 hover:bg-purple-800/50"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Support */}
        <section className="w-full py-8 border-y bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="text-xl font-medium">Works with your favorite platforms</div>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="flex items-center gap-2">
                  <Twitch className="h-8 w-8 text-purple-600" />
                  <span className="text-lg font-medium">Twitch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Youtube className="h-8 w-8 text-purple-600" />
                  <span className="text-lg font-medium">YouTube</span>
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="h-8 w-8 text-purple-600" />
                  <span className="text-lg font-medium">Spotify</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="h-8 w-8 text-purple-600" />
                  <span className="text-lg font-medium">Apple Music</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-16 bg-purple-900 text-white">
          <div className="container px-4 md:px-6 text-center space-y-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-6 rounded-xl bg-purple-800/50 border border-purple-700">
                <h3 className="text-xl font-semibold mb-2">1. Connect Your Stream</h3>
                <p className="text-purple-200">Link your Twitch, YouTube, or Spotify to start using SteamTunes.</p>
              </div>
              <div className="p-6 rounded-xl bg-purple-800/50 border border-purple-700">
                <h3 className="text-xl font-semibold mb-2">2. Let Fans Vote</h3>
                <p className="text-purple-200">Your viewers can vote in real-time for the next track to be played.</p>
              </div>
              <div className="p-6 rounded-xl bg-purple-800/50 border border-purple-700">
                <h3 className="text-xl font-semibold mb-2">3. Enjoy Interactive Streams</h3>
                <p className="text-purple-200">Boost engagement and let fans be part of your music journey.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Radio className="h-6 w-6 text-purple-600" />
            <span className="text-lg font-bold">SteamTunes</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} SteamTunes. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-purple-600">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-purple-600">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


