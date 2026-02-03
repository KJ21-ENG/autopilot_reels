"use client";

import { useState, useEffect } from "react";

const channelData = [
    {
        id: 1,
        name: "HistoryVault",
        handle: "@historyvault",
        avatar: "H",
        videos: [
            { title: "EMPIRE", views: "245K", color: "from-gray-800 to-gray-900" },
            { title: "SECRETS", views: "189K", color: "from-gray-700 to-gray-800" },
            { title: "LEGENDS", views: "312K", color: "from-gray-800 to-gray-900" },
        ],
    },
    {
        id: 2,
        name: "TechInsider",
        handle: "@techinsider",
        avatar: "T",
        videos: [
            { title: "AI FUTURE", views: "567K", color: "from-blue-900 to-gray-900" },
            { title: "ROBOTS", views: "423K", color: "from-blue-800 to-gray-800" },
            { title: "CRYPTO", views: "891K", color: "from-blue-900 to-gray-900" },
        ],
    },
    {
        id: 3,
        name: "MotivateDaily",
        handle: "@motivatedaily",
        avatar: "M",
        videos: [
            { title: "SUCCESS", views: "1.2M", color: "from-purple-900 to-gray-900" },
            { title: "MINDSET", views: "876K", color: "from-purple-800 to-gray-800" },
            { title: "HABITS", views: "654K", color: "from-purple-900 to-gray-900" },
        ],
    },
];

export default function SocialProof() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % channelData.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const currentChannel = channelData[currentIndex];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Real results, real growth
                    </h2>
                    <p className="text-gray-500">
                        Our creators are building audiences that generate real engagement and revenue.
                    </p>
                </div>

                {/* Portrait Video Cards - Carousel */}
                <div className="flex justify-center gap-4 mb-6">
                    {currentChannel.videos.map((video, idx) => (
                        <div
                            key={idx}
                            className="relative w-44 aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br shadow-lg transition-all duration-500"
                            style={{
                                background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                            }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${video.color}`} />

                            {/* Trending badge */}
                            <div className="absolute top-3 left-3">
                                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                    Trending
                                </span>
                            </div>

                            {/* Title centered */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-xl tracking-wide">{video.title}</span>
                            </div>

                            {/* View count at bottom */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                {video.views}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Channel info + carousel dots */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {currentChannel.avatar}
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                            {currentChannel.name}
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </p>
                        <p className="text-sm text-gray-500">{currentChannel.handle}</p>
                    </div>

                    {/* Carousel dots */}
                    <div className="flex gap-1.5 ml-4">
                        {channelData.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-purple-600 w-4" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-16">
                    <div className="text-center">
                        <p className="text-4xl md:text-5xl font-bold text-purple-600">180,000+</p>
                        <p className="text-gray-500 mt-1">active creators</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl md:text-5xl font-bold text-purple-600">2.5M+</p>
                        <p className="text-gray-500 mt-1">videos published</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
