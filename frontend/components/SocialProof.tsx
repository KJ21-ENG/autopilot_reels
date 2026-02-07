"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const channelData = [
    {
        id: 1,
        name: "UrbanTales",
        handle: "@urbantales",
        avatar: "/images/avatar_urbantales.png",
        videos: [
            {
                title: "STREETS",
                views: "1.2M",
                image: "/images/sp_streets.png",
            },
            {
                title: "SURVIVAL",
                views: "876K",
                image: "/images/sp_survival.png",
            },
            {
                title: "COURAGE",
                views: "654K",
                image: "/images/sp_courage.png",
            },
        ],
    },
    {
        id: 2,
        name: "HistoryEpics",
        handle: "@historyepics",
        avatar: "/images/avatar_historyepics.png",
        videos: [
            {
                title: "WARFARE",
                views: "2.1M",
                image: "/images/sp_warfare.png",
            },
            {
                title: "CAPTIVES",
                views: "1.5M",
                image: "/images/sp_captives.png",
            },
            {
                title: "ALEXANDER",
                views: "3.2M",
                image: "/images/sp_alexander.png",
            },
        ],
    },
    {
        id: 3,
        name: "MysteryFiles",
        handle: "@mysteryfiles",
        avatar: "/images/avatar_mysteryfiles.png",
        videos: [
            { title: "CHAOS", views: "945K", image: "/images/sp_chaos.png" },
            {
                title: "SECRETS",
                views: "1.1M",
                image: "/images/sp_secrets.png",
            },
            {
                title: "DISCOVERY",
                views: "789K",
                image: "/images/sp_discovery.png",
            },
        ],
    },
];

export default function SocialProof() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % channelData.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const currentChannel = channelData[currentIndex];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Real results, real growth
                    </h2>
                    <p className="text-gray-500">
                        Our creators are building audiences that generate real
                        engagement and revenue.
                    </p>
                </div>

                {/* Portrait Video Cards - Carousel */}
                <div className="flex gap-4 mb-6 overflow-x-auto sm:overflow-visible flex-nowrap sm:flex-wrap sm:justify-center snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
                    {currentChannel.videos.map((video, idx) => (
                        <div
                            key={idx}
                            className="relative w-36 sm:w-40 md:w-44 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:scale-105 shrink-0 snap-center"
                        >
                            <Image
                                src={video.image}
                                alt={video.title}
                                fill
                                className="object-cover scale-[1.15]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Trending badge */}
                            <div className="absolute top-3 left-3">
                                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                    Trending
                                </span>
                            </div>

                            {/* Title centered */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-lg sm:text-xl tracking-wide">
                                    {video.title}
                                </span>
                            </div>

                            {/* View count at bottom */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs sm:text-sm">
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                {video.views}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Channel info + carousel dots */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                            <Image
                                src={currentChannel.avatar}
                                alt={currentChannel.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-gray-900 flex items-center gap-1 justify-center sm:justify-start">
                                {currentChannel.name}
                                <svg
                                    className="w-4 h-4 text-blue-500"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </p>
                            <p className="text-sm text-gray-500">
                                {currentChannel.handle}
                            </p>
                        </div>
                    </div>

                    {/* Carousel dots */}
                    <div className="flex gap-1.5 sm:ml-4">
                        {channelData.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    idx === currentIndex
                                        ? "bg-purple-600 w-4"
                                        : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16">
                    <div className="text-center">
                        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600">
                            180,000+
                        </p>
                        <p className="text-gray-500 mt-1">active creators</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600">
                            2.5M+
                        </p>
                        <p className="text-gray-500 mt-1">videos published</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
