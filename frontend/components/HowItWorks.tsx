"use client";

const steps = [
    {
        step: 1,
        title: "Pick Your Niche",
        description: "Tell us what topics you want to cover. Our AI understands hundreds of content categories.",
        features: ["History, science, finance, lifestyle & more", "Custom topics supported"],
        imagePosition: "left",
        icon: (
            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        step: 2,
        title: "Style It Your Way",
        description: "Choose visual styles and audio that match your brand personality.",
        features: ["Multiple visual aesthetics", "Trending sounds or custom uploads"],
        imagePosition: "right",
        icon: (
            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
            </svg>
        ),
    },
    {
        step: 3,
        title: "Sit Back & Grow",
        description: "Connect your accounts. We handle creation, scheduling, and posting.",
        features: ["24/7 automatic publishing", "Multi-platform support"],
        imagePosition: "left",
        icon: (
            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
            </svg>
        ),
    },
];

const artStyles = [
    { name: "Cinematic", color: "from-amber-200 to-amber-400" },
    { name: "Artistic", color: "from-pink-200 to-pink-400" },
    { name: "3D Render", color: "from-yellow-200 to-yellow-400" },
    { name: "Animated", color: "from-purple-200 to-purple-400" },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Three steps to content freedom
                    </h2>
                    <p className="text-gray-500">
                        From zero to viral-ready in minutes, not months
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-24">
                    {steps.map((item, index) => (
                        <div
                            key={item.step}
                            className={`flex flex-col ${item.imagePosition === "right" ? "md:flex-row" : "md:flex-row-reverse"
                                } items-center gap-12`}
                        >
                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center gap-2 text-purple-600 text-sm font-medium">
                                    <span className="px-2 py-1 bg-purple-100 rounded-md">Step {item.step}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    {item.icon}
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-lg">{item.description}</p>
                                <ul className="space-y-2">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-600">
                                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visual */}
                            <div className="flex-1 w-full">
                                {item.step === 1 && (
                                    <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                                            <div className="grid grid-cols-3 gap-2">
                                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                                    <div key={i} className="aspect-video bg-gray-200 rounded-lg" />
                                                ))}
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <div className="h-8 bg-purple-600 rounded-lg w-24" />
                                                <div className="h-8 bg-gray-200 rounded-lg w-24" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {item.step === 2 && (
                                    <div className="flex justify-center gap-4">
                                        {artStyles.map((style) => (
                                            <div key={style.name} className="text-center">
                                                <div className={`w-20 h-28 rounded-xl bg-gradient-to-br ${style.color} shadow-lg mb-2`} />
                                                <span className="text-sm text-gray-600">{style.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {item.step === 3 && (
                                    <div className="relative">
                                        <div className="flex items-end gap-4 justify-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-2">
                                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-green-500 font-medium">100K</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="w-14 h-14 rounded-xl bg-red-600 flex items-center justify-center mb-2">
                                                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                                        <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-green-500 font-medium">250K</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center mb-2">
                                                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-green-500 font-medium">1M</span>
                                            </div>
                                        </div>
                                        {/* Growth line */}
                                        <svg className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-24" viewBox="0 0 200 100">
                                            <path d="M10 80 Q 50 70, 100 40 T 190 10" stroke="#10b981" fill="none" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
