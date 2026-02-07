"use client";

import Link from "next/link";
import Image from "next/image";

import { ANALYTICS_EVENT_NAMES, emitAnalyticsEvent } from "@/lib/analytics";

export default function StudioPreview() {
    return (
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto text-center">
                {/* Section Header */}
                <div className="mb-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Over{" "}
                        <span className="text-purple-600">2.5 Million</span>{" "}
                        Videos
                        <br />
                        Created by AutopilotReels
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Create the next viral video with AutopilotReels.
                    </p>
                    <Link
                        href="/checkout?source=studio_preview"
                        onClick={() => {
                            void emitAnalyticsEvent(
                                {
                                    event_name: ANALYTICS_EVENT_NAMES.ctaClick,
                                    metadata: {
                                        location: "studio_preview",
                                        label: "get_started",
                                    },
                                },
                                { useBeacon: true, beaconOnly: true },
                            );
                        }}
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-purple-200"
                    >
                        Get Started
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>

                {/* Mac Browser Mockup */}
                <div className="mt-12 relative">
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-purple-300/40 blur-3xl rounded-full scale-75" />

                    {/* Mac Window Frame */}
                    <div className="relative max-w-5xl mx-auto">
                        {/* Mac Window Container */}
                        <div className="bg-gray-100 rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                            {/* Mac Title Bar */}
                            <div className="bg-gray-200 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-3 border-b border-gray-300">
                                {/* Traffic Light Buttons */}
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner" />
                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner" />
                                    <div className="w-3 h-3 rounded-full bg-[#28CA41] shadow-inner" />
                                </div>

                                {/* URL Bar */}
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-white rounded-lg px-3 sm:px-4 py-1.5 flex items-center gap-2 w-full max-w-[200px] sm:max-w-[300px] min-w-0 border border-gray-300 shadow-sm">
                                        <svg
                                            className="w-3.5 h-3.5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                        <span className="text-gray-500 text-[10px] sm:text-xs truncate min-w-0 flex-1">
                                            www.autopilotreels.com
                                        </span>
                                    </div>
                                </div>

                                {/* Spacer for symmetry */}
                                <div className="w-8 sm:w-14" />
                            </div>

                            {/* Browser Content - Dashboard */}
                            <div className="bg-white">
                                {/* Dashboard Header with user info */}
                                <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100">
                                    {/* Left side - Logo & Nav */}
                                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <rect
                                                    width="24"
                                                    height="24"
                                                    rx="4"
                                                    ry="4"
                                                    fill="#FFFFFF"
                                                />
                                                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
                                            </svg>
                                            <span className="text-gray-900 font-semibold text-xs sm:text-sm truncate">
                                                AutopilotReels
                                            </span>
                                        </div>
                                        <div className="hidden md:flex items-center gap-4">
                                            <span className="text-gray-900 text-xs font-medium">
                                                Dashboard
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                Videos
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                Schedule
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                Analytics
                                            </span>
                                        </div>
                                    </div>
                                    {/* Right side - User avatar */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative">
                                            <Image
                                                src="/images/user_avatar.png"
                                                alt="User"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Main content */}
                                <div className="p-4 sm:p-6 bg-gray-50/80">
                                    {/* Greeting */}
                                    <div className="text-left mb-4 sm:mb-6">
                                        <h3 className="text-gray-900 text-lg sm:text-xl font-semibold">
                                            Good morning, Noah{" "}
                                            <span className="text-lg sm:text-xl">
                                                👋
                                            </span>
                                        </h3>
                                    </div>

                                    {/* Quick Tools Section */}
                                    <div className="mb-4 sm:mb-6">
                                        <p className="text-gray-600 text-xs sm:text-sm text-left mb-3 font-medium">
                                            Quick Tools
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                            {/* AI Video Generator */}
                                            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group">
                                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-200">
                                                    <svg
                                                        className="w-5 h-5 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-gray-900 text-[11px] sm:text-xs font-semibold group-hover:text-purple-600 transition-colors leading-tight">
                                                        AI Video Generator
                                                    </p>
                                                    <p className="text-gray-400 text-[9px] sm:text-[10px]">
                                                        Create videos with AI
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Script Writer */}
                                            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
                                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                                                    <svg
                                                        className="w-5 h-5 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-gray-900 text-[11px] sm:text-xs font-semibold group-hover:text-blue-600 transition-colors leading-tight">
                                                        Script Writer
                                                    </p>
                                                    <p className="text-gray-400 text-[9px] sm:text-[10px]">
                                                        Generate viral scripts
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Auto Publisher */}
                                            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 cursor-pointer hover:border-green-300 hover:shadow-md transition-all group">
                                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md shadow-green-200">
                                                    <svg
                                                        className="w-5 h-5 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-gray-900 text-[11px] sm:text-xs font-semibold group-hover:text-green-600 transition-colors leading-tight">
                                                        Auto Publisher
                                                    </p>
                                                    <p className="text-gray-400 text-[9px] sm:text-[10px]">
                                                        Schedule & auto-post
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trending Templates Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-gray-600 text-xs sm:text-sm font-medium flex items-center gap-2">
                                                🔥 Trending Templates
                                            </p>
                                            <button className="text-purple-600 text-[11px] sm:text-xs font-medium hover:text-purple-700">
                                                View All →
                                            </button>
                                        </div>
                                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {[
                                                {
                                                    title: "Pixar Style",
                                                    views: "245K",
                                                    image: "/images/thumb_pixar.png",
                                                },
                                                {
                                                    title: "18th Century",
                                                    views: "189K",
                                                    image: "/images/thumb_18th_century.png",
                                                },
                                                {
                                                    title: "Comic Book",
                                                    views: "312K",
                                                    image: "/images/thumb_comic_book_v2.png",
                                                },
                                                {
                                                    title: "Studio Ghibli",
                                                    views: "156K",
                                                    image: "/images/thumb_studio_ghibli.png",
                                                },
                                                {
                                                    title: "Cinematic",
                                                    views: "423K",
                                                    image: "/images/thumb_cinematic.png",
                                                },
                                                {
                                                    title: "Minecraft",
                                                    views: "891K",
                                                    image: "/images/thumb_minecraft.png",
                                                },
                                                {
                                                    title: "Polished 3D",
                                                    views: "567K",
                                                    image: "/images/thumb_polished_cartoon.png",
                                                },
                                            ].map((video, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-shrink-0 w-24 sm:w-28 group cursor-pointer"
                                                >
                                                    <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-2 shadow-md hover:shadow-lg hover:ring-2 ring-purple-500 transition-all">
                                                        <Image
                                                            src={video.image}
                                                            alt={video.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        {/* Play button overlay - always visible */}
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                                <svg
                                                                    className="w-4 h-4 text-gray-900 ml-0.5"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        {/* Views badge */}
                                                        <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2 h-5 min-w-[36px] flex items-center justify-center">
                                                            <span className="text-white text-[10px] font-medium leading-none">
                                                                {video.views}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-900 text-[10px] sm:text-[11px] font-medium truncate">
                                                        {video.title}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mac Window Reflection/Shadow */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-gradient-to-b from-gray-200/50 to-transparent blur-xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}
