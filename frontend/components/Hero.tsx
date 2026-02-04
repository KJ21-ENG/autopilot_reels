"use client";

import { ANALYTICS_EVENT_NAMES, emitAnalyticsEvent } from "@/lib/analytics";

const videoExamples = [
    { id: 1, title: "Ancient Wars", niche: "History" },
    { id: 2, title: "Hidden Secrets", niche: "Mystery" },
    { id: 3, title: "Tech Marvels", niche: "Technology" },
    { id: 4, title: "Art Journey", niche: "Art" },
    { id: 5, title: "Dark Tales", niche: "Horror" },
    { id: 6, title: "Life Hacks", niche: "Lifestyle" },
    { id: 7, title: "Money Moves", niche: "Finance" },
    { id: 8, title: "Mind Blown", niche: "Science" },
];

export default function Hero() {
    // Triple the array for ultra-smooth infinite scroll
    const duplicatedVideos = [...videoExamples, ...videoExamples, ...videoExamples];

    return (
        <section className="pt-28 pb-8 px-4 bg-white">
            <div className="max-w-6xl mx-auto text-center">
                {/* Social Proof */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                            >
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">
                        Loved by <span className="font-semibold text-gray-700">50k+</span> creators
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                    Your content empire,<br />running on autopilot
                </h1>

                {/* Subheadline */}
                <p className="text-lg text-gray-500 mb-4 max-w-2xl mx-auto">
                    AI-powered faceless videos created and posted automatically.<br className="hidden sm:block" />
                    Grow your audience while you focus on what matters.
                </p>

                {/* Platform Icons */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-sm text-gray-500">Publish to</span>
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <defs>
                                <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FFDC80" />
                                    <stop offset="50%" stopColor="#F56040" />
                                    <stop offset="100%" stopColor="#833AB4" />
                                </linearGradient>
                            </defs>
                            <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="mb-2">
                    <a
                        href="/checkout?source=hero"
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-purple-200"
                        onClick={() => {
                            void emitAnalyticsEvent(
                                {
                                    event_name: ANALYTICS_EVENT_NAMES.ctaClick,
                                    metadata: { location: "hero" },
                                },
                                { useBeacon: true, beaconOnly: true }
                            );
                        }}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
                        </svg>
                        Start Building Your Empire
                    </a>
                </div>
                <p className="text-sm text-gray-400 mb-12">First video ready in under 5 minutes. No experience needed.</p>

                {/* Video Gallery Label */}
                <div className="flex items-center justify-start max-w-5xl mx-auto mb-4">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                        Works for every niche imaginable
                        <svg className="w-4 h-4 text-gray-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </span>
                </div>

                {/* Infinite Auto-Scrolling Video Gallery */}
                <div className="relative max-w-5xl mx-auto overflow-hidden">
                    <div className="scroll-container">
                        <div className="scroll-content">
                            {duplicatedVideos.map((video, index) => (
                                <div
                                    key={`${video.id}-${index}`}
                                    className="flex-shrink-0 w-44 mx-2"
                                >
                                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg transition-shadow">
                                        {/* Placeholder gradient with text */}
                                        <div className="absolute inset-0 flex items-end p-3">
                                            <span className="text-white font-bold text-lg drop-shadow-lg">{video.title}</span>
                                        </div>
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Left fade gradient */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                    {/* Right fade gradient */}
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
                </div>
            </div>

            <style jsx>{`
        .scroll-container {
          overflow: hidden;
          position: relative;
        }

        .scroll-content {
          display: flex;
          width: max-content;
          animation: scroll 40s linear infinite;
          will-change: transform;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% / 3));
          }
        }

                .scroll-content:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-content {
            animation: none;
            transform: none;
          }
        }

        /* Ensure smooth rendering */
        .scroll-content {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
        </section>
    );
}
