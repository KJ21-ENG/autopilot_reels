"use client";

import Image from "next/image";

const steps = [
    {
        step: 1,
        title: "Pick Your Niche",
        description:
            "Tell us what topics you want to cover. Our AI understands hundreds of content categories.",
        features: [
            "History, science, finance, lifestyle & more",
            "Custom topics supported",
        ],
        imagePosition: "left",
        icon: (
            <svg
                className="w-6 h-6 text-purple-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        step: 2,
        title: "Style It Your Way",
        description:
            "Choose visual styles and audio that match your brand personality.",
        features: [
            "Multiple visual aesthetics",
            "Trending sounds or custom uploads",
        ],
        imagePosition: "right",
        icon: (
            <svg
                className="w-6 h-6 text-purple-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
            </svg>
        ),
    },
    {
        step: 3,
        title: "Choose Your Language",
        description:
            "Pick the language for narration and captions before we generate your videos.",
        features: [
            "20+ languages supported",
            "Auto-captions in your selected language",
        ],
        imagePosition: "left",
        icon: (
            <svg
                className="w-6 h-6 text-purple-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M4 5h7" />
                <path d="M9 3v2" />
                <path d="M7 21l5-10 5 10" />
                <path d="M12 19h6" />
                <path d="M4 9h7" />
                <path d="M4 13h4" />
            </svg>
        ),
    },
    {
        step: 4,
        title: "Sit Back & Grow",
        description:
            "Connect your accounts. We handle creation, scheduling, and posting.",
        features: ["24/7 automatic publishing", "Multi-platform support"],
        imagePosition: "right",
        icon: (
            <svg
                className="w-6 h-6 text-purple-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
            </svg>
        ),
    },
];

const niches = [
    {
        name: "History",
        icon: "🏛️",
        image: "/images/niche_history.png",
        color: "from-amber-100 to-amber-200",
        borderColor: "border-amber-300",
    },
    {
        name: "Science",
        icon: "🔬",
        image: "/images/niche_science.png",
        color: "from-blue-100 to-blue-200",
        borderColor: "border-blue-300",
    },
    {
        name: "Finance",
        icon: "💰",
        image: "/images/niche_finance.png",
        color: "from-green-100 to-green-200",
        borderColor: "border-green-300",
    },
    {
        name: "Horror",
        icon: "👻",
        image: "/images/niche_horror.png",
        color: "from-gray-100 to-gray-200",
        borderColor: "border-gray-400",
    },
    {
        name: "Tech",
        icon: "💻",
        image: "/images/niche_tech.png",
        color: "from-cyan-100 to-cyan-200",
        borderColor: "border-cyan-300",
    },
    {
        name: "Lifestyle",
        icon: "✨",
        image: "/images/niche_lifestyle.png",
        color: "from-pink-100 to-pink-200",
        borderColor: "border-pink-300",
    },
];

const artStyles = [
    {
        name: "Cinematic",
        icon: "🎬",
        image: "/images/style_cinematic.png",
        color: "from-amber-100 to-amber-200",
        borderColor: "border-amber-300",
    },
    {
        name: "Artistic",
        icon: "🎨",
        image: "/images/style_artistic.png",
        color: "from-pink-100 to-pink-200",
        borderColor: "border-pink-300",
    },
    {
        name: "3D Render",
        icon: "🎮",
        image: "/images/style_3d_render.png",
        color: "from-purple-100 to-purple-200",
        borderColor: "border-purple-300",
    },
    {
        name: "Animated",
        icon: "✨",
        image: "/images/style_animated.png",
        color: "from-blue-100 to-blue-200",
        borderColor: "border-blue-300",
    },
];

const languages = [
    { name: "English", code: "EN", icon: "🇺🇸" },
    { name: "Spanish", code: "ES", icon: "🇪🇸" },
    { name: "Hindi", code: "HI", icon: "🇮🇳" },
    { name: "Arabic", code: "AR", icon: "🇸🇦" },
];

// Shared App Header Component - Videos tab active
function AppHeader() {
    return (
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2 border-b border-gray-100">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <svg
                        className="w-5 h-5 text-purple-600"
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
                    <span className="text-gray-900 font-semibold text-[10px] sm:text-xs truncate">
                        AutopilotReels
                    </span>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <span className="text-gray-400 text-[10px]">Dashboard</span>
                    <span className="text-gray-900 text-[10px] font-medium">
                        Videos
                    </span>
                    <span className="text-gray-400 text-[10px]">Schedule</span>
                    <span className="text-gray-400 text-[10px]">Analytics</span>
                </div>
            </div>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 border border-gray-200 overflow-hidden relative">
                <Image
                    src="/images/user_avatar.png"
                    alt="User"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    );
}

// Mac Browser Mockup Component for Step 1 - Widescreen
function NicheMockup() {
    return (
        <div className="relative w-full">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-purple-200/30 blur-3xl rounded-full scale-90" />

            {/* Mac Window Frame - 16:10 Widescreen */}
            <div className="relative" style={{ aspectRatio: "16/10" }}>
                <div className="absolute inset-0 bg-gray-100 rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
                    {/* Mac Title Bar */}
                    <div className="bg-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-3 border-b border-gray-300 flex-shrink-0">
                        {/* Traffic Light Buttons */}
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                        </div>

                        {/* URL Bar */}
                        <div className="flex-1 flex justify-center">
                            <div className="bg-white rounded-md px-3 py-1 flex items-center gap-1.5 w-full max-w-[200px] sm:max-w-[240px] min-w-0 border border-gray-300 shadow-sm">
                                <svg
                                    className="w-3 h-3 text-gray-400"
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
                                <span className="text-gray-500 text-[9px] sm:text-[10px] truncate min-w-0 flex-1">
                                    www.autopilotreels.com
                                </span>
                            </div>
                        </div>

                        <div className="w-6 sm:w-10" />
                    </div>

                    {/* Browser Content */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        <AppHeader />

                        {/* Main Content - Niche Selection - Two Column Layout */}
                        <div className="flex-1 p-3 sm:p-4 bg-gray-50/80 flex gap-3 sm:gap-4 overflow-hidden">
                            {/* Left Side - Main Selection */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Progress Steps */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-medium">
                                            1
                                        </div>
                                        <span className="text-[10px] text-purple-600 font-medium hidden sm:inline">
                                            Niche
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-gray-200" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center font-medium">
                                            2
                                        </div>
                                        <span className="text-[10px] text-gray-400 hidden sm:inline">
                                            Style
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-gray-200" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center font-medium">
                                            3
                                        </div>
                                        <span className="text-[10px] text-gray-400 hidden sm:inline">
                                            Language
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-gray-200" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center font-medium">
                                            4
                                        </div>
                                        <span className="text-[10px] text-gray-400 hidden sm:inline">
                                            Connect
                                        </span>
                                    </div>
                                </div>

                                {/* Header */}
                                <h3 className="text-gray-900 text-sm font-semibold mb-1">
                                    Pick Your Niche
                                </h3>
                                <p className="text-gray-400 text-[10px] mb-3">
                                    Select a category for your content
                                </p>

                                {/* Niche Grid - 3 columns */}
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                    {niches.map((niche, i) => (
                                        <div
                                            key={niche.name}
                                            className={`relative border ${i === 0 ? "border-purple-500 ring-2 ring-purple-200" : niche.borderColor} rounded-lg cursor-pointer hover:scale-105 transition-all overflow-hidden`}
                                        >
                                            <Image
                                                src={niche.image}
                                                alt={niche.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side - Info Panel */}
                            <div className="w-24 sm:w-32 md:w-36 flex flex-col flex-shrink-0">
                                <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-2.5 flex-1 flex flex-col">
                                    <p className="text-gray-500 text-[9px] font-medium mb-2">
                                        Selected
                                    </p>
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-6 h-6 relative rounded overflow-hidden flex-shrink-0">
                                                <Image
                                                    src="/images/niche_history.png"
                                                    alt="History"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-purple-900 text-[10px] font-medium">
                                                    History
                                                </p>
                                                <p className="text-purple-600 text-[8px]">
                                                    2.5M+ views/mo
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-[8px] flex-1">
                                        Ancient civilizations, wars, discoveries
                                        & more
                                    </p>
                                </div>
                                <button className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                                    Continue
                                    <svg
                                        className="w-3 h-3"
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
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mac Browser Mockup Component for Step 2 - Widescreen
function StyleMockup() {
    return (
        <div className="relative w-full">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-purple-200/30 blur-3xl rounded-full scale-90" />

            {/* Mac Window Frame - 16:10 Widescreen */}
            <div className="relative" style={{ aspectRatio: "16/10" }}>
                <div className="absolute inset-0 bg-gray-100 rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
                    {/* Mac Title Bar */}
                    <div className="bg-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-3 border-b border-gray-300 flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="bg-white rounded-md px-3 py-1 flex items-center gap-1.5 w-full max-w-[200px] sm:max-w-[240px] min-w-0 border border-gray-300 shadow-sm">
                                <svg
                                    className="w-3 h-3 text-gray-400"
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
                                <span className="text-gray-500 text-[9px] sm:text-[10px] truncate min-w-0 flex-1">
                                    www.autopilotreels.com
                                </span>
                            </div>
                        </div>
                        <div className="w-6 sm:w-10" />
                    </div>

                    {/* Browser Content */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        <AppHeader />

                        {/* Main Content - Style Selection - Two Column Layout */}
                        <div className="flex-1 p-3 sm:p-4 bg-gray-50/80 flex gap-3 sm:gap-4 overflow-hidden">
                            {/* Left Side - Style Cards */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Progress Steps */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                                            <svg
                                                className="w-2.5 h-2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] text-green-600 font-medium hidden sm:inline">
                                            Niche
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-purple-600" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-medium">
                                            2
                                        </div>
                                        <span className="text-[10px] text-purple-600 font-medium hidden sm:inline">
                                            Style
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-gray-200" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center font-medium">
                                            3
                                        </div>
                                        <span className="text-[10px] text-gray-400 hidden sm:inline">
                                            Language
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-gray-200" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center font-medium">
                                            4
                                        </div>
                                        <span className="text-[10px] text-gray-400 hidden sm:inline">
                                            Connect
                                        </span>
                                    </div>
                                </div>

                                {/* Header */}
                                <h3 className="text-gray-900 text-sm font-semibold mb-1">
                                    Choose Your Style
                                </h3>
                                <p className="text-gray-400 text-[10px] mb-3">
                                    Select a visual aesthetic
                                </p>

                                {/* Style Grid - 4 columns horizontal */}
                                <div className="flex gap-1.5 sm:gap-2 flex-1">
                                    {artStyles.map((style, i) => (
                                        <div
                                            key={style.name}
                                            className={`relative border ${i === 0 ? "border-purple-500 ring-2 ring-purple-200" : style.borderColor} rounded-lg cursor-pointer hover:scale-105 transition-all overflow-hidden flex-1`}
                                            style={{ aspectRatio: "9/14" }}
                                        >
                                            <Image
                                                src={style.image}
                                                alt={style.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side - Voice Selection */}
                            <div className="w-24 sm:w-32 md:w-36 flex flex-col flex-shrink-0">
                                <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-2.5 flex-1 flex flex-col">
                                    <p className="text-gray-500 text-[9px] font-medium mb-2">
                                        Voice Style
                                    </p>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="bg-purple-50 border border-purple-200 rounded-md px-2 py-1.5 flex items-center gap-1.5">
                                            <span className="text-xs">🎙️</span>
                                            <span className="text-purple-700 text-[8px] font-medium">
                                                Deep Male
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 flex items-center gap-1.5">
                                            <span className="text-xs">👩</span>
                                            <span className="text-gray-500 text-[8px]">
                                                Female
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 flex items-center gap-1.5">
                                            <span className="text-xs">🤖</span>
                                            <span className="text-gray-500 text-[8px]">
                                                AI Narrator
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                                    Continue
                                    <svg
                                        className="w-3 h-3"
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
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mac Browser Mockup Component for Step 3 - Widescreen
function LanguageMockup() {
    return (
        <div className="relative w-full">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-purple-200/30 blur-3xl rounded-full scale-90" />

            {/* Mac Window Frame - 16:10 Widescreen */}
            <div className="relative" style={{ aspectRatio: "16/10" }}>
                <div className="absolute inset-0 bg-gray-100 rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
                    {/* Mac Title Bar */}
                    <div className="bg-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-3 border-b border-gray-300 flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="bg-white rounded-md px-3 py-1 flex items-center gap-1.5 w-full max-w-[200px] sm:max-w-[240px] min-w-0 border border-gray-300 shadow-sm">
                                <svg
                                    className="w-3 h-3 text-gray-400"
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
                                <span className="text-gray-500 text-[9px] sm:text-[10px] truncate min-w-0 flex-1">
                                    www.autopilotreels.com
                                </span>
                            </div>
                        </div>
                        <div className="w-6 sm:w-10" />
                    </div>

                    {/* Browser Content */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        <AppHeader />

                        {/* Main Content - Language Selection - Two Column Layout */}
                        <div className="flex-1 p-3 sm:p-4 bg-gray-50/80 flex gap-3 sm:gap-4 overflow-hidden">
                            {/* Left Side - Language Cards */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Progress Steps */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                                            <svg
                                                className="w-2.5 h-2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] text-green-600 font-medium hidden sm:inline">
                                            Niche
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-green-500" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                                            <svg
                                                className="w-2.5 h-2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] text-green-600 font-medium hidden sm:inline">
                                            Style
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-purple-600" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-medium">
                                            3
                                        </div>
                                        <span className="text-[10px] text-purple-600 font-medium hidden sm:inline">
                                            Language
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-gray-200" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center font-medium">
                                            4
                                        </div>
                                        <span className="text-[10px] text-gray-400 hidden sm:inline">
                                            Connect
                                        </span>
                                    </div>
                                </div>

                                {/* Header */}
                                <h3 className="text-gray-900 text-sm font-semibold mb-1">
                                    Choose Language
                                </h3>
                                <p className="text-gray-400 text-[10px] mb-3">
                                    Pick the narration language
                                </p>

                                {/* Language Cards - 2x2 Grid */}
                                <div className="grid grid-cols-2 gap-2 flex-1">
                                    {languages.map((language, i) => (
                                        <div
                                            key={language.name}
                                            className={`border rounded-lg p-1.5 sm:p-2 flex items-center gap-2 ${
                                                i === 0
                                                    ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                                                    : "border-gray-200 bg-white"
                                            }`}
                                        >
                                            <span className="text-base sm:text-lg">
                                                {language.icon}
                                            </span>
                                            <div>
                                                <p className="text-gray-700 text-[8px] sm:text-[9px] font-medium">
                                                    {language.name}
                                                </p>
                                                <p className="text-gray-400 text-[8px]">
                                                    {language.code}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side - Output Settings */}
                            <div className="w-24 sm:w-32 md:w-36 flex flex-col flex-shrink-0">
                                <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-2.5 flex-1 flex flex-col">
                                    <p className="text-gray-500 text-[9px] font-medium mb-2">
                                        Output
                                    </p>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="bg-purple-50 border border-purple-200 rounded-md px-2 py-1.5 flex items-center gap-1.5">
                                            <span className="text-xs">🌍</span>
                                            <span className="text-purple-700 text-[8px] font-medium">
                                                English (EN)
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 flex items-center gap-1.5">
                                            <span className="text-xs">💬</span>
                                            <span className="text-gray-500 text-[8px]">
                                                Auto-captions on
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 flex items-center gap-1.5">
                                            <span className="text-xs">🎙️</span>
                                            <span className="text-gray-500 text-[8px]">
                                                Voice: Deep Male
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                                    Continue
                                    <svg
                                        className="w-3 h-3"
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
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mac Browser Mockup Component for Step 4 - Widescreen
function GrowMockup() {
    return (
        <div className="relative w-full">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-purple-200/30 blur-3xl rounded-full scale-90" />

            {/* Mac Window Frame - 16:10 Widescreen */}
            <div className="relative" style={{ aspectRatio: "16/10" }}>
                <div className="absolute inset-0 bg-gray-100 rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
                    {/* Mac Title Bar */}
                    <div className="bg-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-3 border-b border-gray-300 flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="bg-white rounded-md px-3 py-1 flex items-center gap-1.5 w-full max-w-[200px] sm:max-w-[240px] min-w-0 border border-gray-300 shadow-sm">
                                <svg
                                    className="w-3 h-3 text-gray-400"
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
                                <span className="text-gray-500 text-[9px] sm:text-[10px] truncate min-w-0 flex-1">
                                    www.autopilotreels.com
                                </span>
                            </div>
                        </div>
                        <div className="w-6 sm:w-10" />
                    </div>

                    {/* Browser Content */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        <AppHeader />

                        {/* Main Content - Connect Accounts - Two Column Layout */}
                        <div className="flex-1 p-3 sm:p-4 bg-gray-50/80 flex gap-3 sm:gap-4 overflow-hidden">
                            {/* Left Side - Platform Cards */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Progress Steps */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                                            <svg
                                                className="w-2.5 h-2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] text-green-600 font-medium hidden sm:inline">
                                            Niche
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-green-500" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                                            <svg
                                                className="w-2.5 h-2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] text-green-600 font-medium hidden sm:inline">
                                            Style
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-green-500" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                                            <svg
                                                className="w-2.5 h-2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] text-green-600 font-medium hidden sm:inline">
                                            Language
                                        </span>
                                    </div>
                                    <div className="w-4 sm:w-6 h-0.5 bg-purple-600" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-medium">
                                            4
                                        </div>
                                        <span className="text-[10px] text-purple-600 font-medium hidden sm:inline">
                                            Connect
                                        </span>
                                    </div>
                                </div>

                                {/* Header */}
                                <h3 className="text-gray-900 text-sm font-semibold mb-1">
                                    Connect Accounts
                                </h3>
                                <p className="text-gray-400 text-[10px] mb-3">
                                    Auto-publish to your platforms
                                </p>

                                {/* Platform Cards - Horizontal row */}
                                <div className="flex gap-1.5 sm:gap-2 flex-1">
                                    {/* YouTube */}
                                    <div className="flex-1 bg-white border border-green-200 rounded-lg p-2 sm:p-2.5 flex flex-col items-center justify-center text-center">
                                        <div className="mb-1.5 flex items-center justify-center">
                                            <Image
                                                src="/brands/youtube.svg"
                                                alt="YouTube"
                                                width={32}
                                                height={32}
                                                unoptimized
                                                className="w-7 h-7 sm:w-8 sm:h-8"
                                            />
                                        </div>
                                        <p className="text-gray-900 text-[9px] sm:text-[10px] font-medium">
                                            YouTube
                                        </p>
                                        <p className="text-green-600 text-[7px] sm:text-[8px]">
                                            Connected ✓
                                        </p>
                                    </div>

                                    {/* TikTok */}
                                    <div className="flex-1 bg-white border border-green-200 rounded-lg p-2 sm:p-2.5 flex flex-col items-center justify-center text-center">
                                        <div className="mb-1.5 flex items-center justify-center">
                                            <Image
                                                src="/brands/tiktok.png"
                                                alt="TikTok"
                                                width={32}
                                                height={32}
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
                                            />
                                        </div>
                                        <p className="text-gray-900 text-[9px] sm:text-[10px] font-medium">
                                            TikTok
                                        </p>
                                        <p className="text-green-600 text-[7px] sm:text-[8px]">
                                            Connected ✓
                                        </p>
                                    </div>

                                    {/* Instagram */}
                                    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-2 sm:p-2.5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-300 transition-colors">
                                        <div className="mb-1.5 flex items-center justify-center">
                                            <Image
                                                src="/brands/instagram.svg"
                                                alt="Instagram"
                                                width={32}
                                                height={32}
                                                unoptimized
                                                className="w-7 h-7 sm:w-8 sm:h-8"
                                            />
                                        </div>
                                        <p className="text-gray-900 text-[9px] sm:text-[10px] font-medium">
                                            Instagram
                                        </p>
                                        <p className="text-purple-600 text-[7px] sm:text-[8px]">
                                            + Connect
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Summary */}
                            <div className="w-24 sm:w-32 md:w-36 flex flex-col flex-shrink-0">
                                <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-2.5 flex-1 flex flex-col">
                                    <p className="text-gray-500 text-[9px] font-medium mb-2">
                                        Your Setup
                                    </p>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs">🏛️</span>
                                            <span className="text-gray-700 text-[8px]">
                                                History
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs">🎬</span>
                                            <span className="text-gray-700 text-[8px]">
                                                Cinematic
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs">🌍</span>
                                            <span className="text-gray-700 text-[8px]">
                                                English
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs">🎙️</span>
                                            <span className="text-gray-700 text-[8px]">
                                                Deep Male
                                            </span>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-1.5 mt-1.5">
                                        <p className="text-green-600 text-[8px] font-medium">
                                            2 connected
                                        </p>
                                    </div>
                                </div>
                                <button className="mt-2 w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-[10px] font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md shadow-purple-200">
                                    🚀 Start Creating
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Four steps to content freedom
                    </h2>
                    <p className="text-gray-500">
                        From zero to viral-ready in minutes, not months
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-16 md:space-y-24">
                    {steps.map(item => (
                        <div
                            key={item.step}
                            className={`flex flex-col ${
                                item.imagePosition === "right"
                                    ? "md:flex-row"
                                    : "md:flex-row-reverse"
                            } items-center gap-8 md:gap-12`}
                        >
                            {/* Content */}
                            <div className="flex-1 space-y-3 sm:space-y-4">
                                <div className="inline-flex items-center gap-2 text-purple-600 text-sm font-medium">
                                    <span className="px-2 py-1 bg-purple-100 rounded-md">
                                        Step {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    {item.icon}
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-base sm:text-lg">
                                    {item.description}
                                </p>
                                <ul className="space-y-2">
                                    {item.features.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-2 text-gray-600 text-sm sm:text-base"
                                        >
                                            <svg
                                                className="w-5 h-5 text-purple-600"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visual - Mac Browser Mockups - Widescreen */}
                            <div className="flex-1 w-full">
                                {item.step === 1 && <NicheMockup />}
                                {item.step === 2 && <StyleMockup />}
                                {item.step === 3 && <LanguageMockup />}
                                {item.step === 4 && <GrowMockup />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
