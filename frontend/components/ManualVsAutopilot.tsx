"use client";

import Link from "next/link";
import { ANALYTICS_EVENT_NAMES, emitAnalyticsEvent } from "@/lib/analytics";
// SVG Icons as components for consistency
const SearchIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
);

const PenIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
    </svg>
);

const MicIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
    </svg>
);

const FilmIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
    </svg>
);

const MonitorIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
    </svg>
);

const CaptionIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
    </svg>
);

const UploadIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
    </svg>
);

const TargetIcon = () => (
    <svg
        className="w-5 h-5 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <circle cx="12" cy="12" r="6" strokeWidth={2} />
        <circle cx="12" cy="12" r="2" strokeWidth={2} />
    </svg>
);

const LinkIcon = () => (
    <svg
        className="w-5 h-5 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
    </svg>
);

const CheckCircleIcon = () => (
    <svg
        className="w-5 h-5 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const TiredIcon = () => (
    <svg
        className="w-6 h-6 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const RocketIcon = () => (
    <svg
        className="w-6 h-6 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
        />
    </svg>
);

const SparklesIcon = () => (
    <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
    </svg>
);

const manualSteps = [
    {
        step: 1,
        title: "Research trending topics",
        time: "30+ mins",
        icon: <SearchIcon />,
    },
    {
        step: 2,
        title: "Write a compelling script",
        time: "1-2 hours",
        icon: <PenIcon />,
    },
    {
        step: 3,
        title: "Record voiceover & edit audio",
        time: "1+ hour",
        icon: <MicIcon />,
    },
    {
        step: 4,
        title: "Find royalty-free footage",
        time: "1-2 hours",
        icon: <FilmIcon />,
    },
    {
        step: 5,
        title: "Edit video in complex software",
        time: "3-5 hours",
        icon: <MonitorIcon />,
    },
    {
        step: 6,
        title: "Add captions & effects",
        time: "1+ hour",
        icon: <CaptionIcon />,
    },
    {
        step: 7,
        title: "Export & upload to each platform",
        time: "30+ mins",
        icon: <UploadIcon />,
    },
];

const LanguageIcon = () => (
    <svg
        className="w-5 h-5 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
    </svg>
);

const CalendarIcon = () => (
    <svg
        className="w-5 h-5 text-purple-600"
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
);

const PlayIcon = () => (
    <svg
        className="w-5 h-5 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const autopilotSteps = [
    {
        step: 1,
        title: "Pick your niche & style",
        time: "2 mins",
        icon: <TargetIcon />,
    },
    {
        step: 2,
        title: "Choose your language",
        time: "30 secs",
        icon: <LanguageIcon />,
    },
    {
        step: 3,
        title: "Connect your accounts",
        time: "1 min",
        icon: <LinkIcon />,
    },
    {
        step: 4,
        title: "Set your posting schedule",
        time: "30 secs",
        icon: <CalendarIcon />,
    },
    {
        step: 5,
        title: "Preview first video",
        time: "1 min",
        icon: <PlayIcon />,
    },
    {
        step: 6,
        title: "Launch autopilot mode",
        time: "Done!",
        icon: <CheckCircleIcon />,
        highlight: true,
    },
];

export default function ManualVsAutopilot() {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Manual creation vs AutopilotReels
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base">
                        See how much time you save with automated content
                        creation
                    </p>
                </div>

                {/* Comparison Grid - Equal height cards */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Manual Way - Left Side */}
                    <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 flex flex-col">
                        {/* Header */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <TiredIcon />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">
                                    The Manual Way
                                </h3>
                                <p className="text-red-500 text-sm font-medium">
                                    8-12 hours per video
                                </p>
                            </div>
                        </div>

                        {/* Steps - grows to fill space */}
                        <div className="space-y-3 flex-1">
                            {manualSteps.map(item => (
                                <div
                                    key={item.step}
                                    className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-700 text-sm font-medium sm:truncate">
                                            {item.title}
                                        </p>
                                    </div>
                                    <span className="text-red-500 text-xs font-medium whitespace-nowrap bg-red-50 px-2 py-1 rounded-full">
                                        {item.time}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total - Fixed at bottom */}
                        <div className="mt-6 pt-4 border-t-2 border-gray-200 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <span className="text-gray-500 text-xs block">
                                    Total time per video
                                </span>
                                <span className="text-red-600 font-bold text-lg">
                                    8-12 hours
                                </span>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div className="flex-1 text-right">
                                <span className="text-gray-500 text-xs block">
                                    Cost if outsourced
                                </span>
                                <span className="text-red-600 font-bold text-lg">
                                    $100-500
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* AutopilotReels Way - Right Side */}
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border-2 border-purple-200 shadow-lg shadow-purple-100/50 relative overflow-hidden flex flex-col">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 blur-3xl rounded-full" />

                        {/* Header */}
                        <div className="relative flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <RocketIcon />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">
                                    With AutopilotReels
                                </h3>
                                <p className="text-purple-600 text-sm font-medium">
                                    5 minutes setup, then automated
                                </p>
                            </div>
                            <div className="sm:ml-auto bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                                Recommended
                            </div>
                        </div>
                        {/* Steps and AI Section - grows to fill space */}
                        <div className="relative flex-1">
                            <div className="space-y-3">
                                {autopilotSteps.map(item => (
                                    <div
                                        key={item.step}
                                        className={`flex items-center gap-3 rounded-lg p-3 border ${
                                            item.highlight
                                                ? "bg-purple-100 border-purple-200"
                                                : "bg-white border-gray-100"
                                        }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                item.highlight
                                                    ? "bg-purple-200"
                                                    : "bg-purple-50"
                                            }`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-700 text-sm font-medium sm:truncate">
                                                {item.title}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs font-medium whitespace-nowrap px-2 py-1 rounded-full ${
                                                item.highlight
                                                    ? "text-purple-700 bg-purple-200"
                                                    : "text-green-600 bg-green-50"
                                            }`}
                                        >
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* AI Does The Rest */}
                            <div className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <SparklesIcon />
                                    <span className="font-semibold">
                                        AI handles everything else
                                    </span>
                                </div>
                                <ul className="space-y-1.5 text-purple-100 text-sm ml-9">
                                    <li className="flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Script writing & research
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Voiceover generation
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Video editing & captions
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Publishing to all platforms
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Total - Fixed at bottom */}
                        <div className="relative mt-6 pt-4 border-t-2 border-purple-200 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <span className="text-gray-500 text-xs block">
                                    Your time needed
                                </span>
                                <span className="text-purple-600 font-bold text-lg">
                                    5 minutes
                                </span>
                            </div>
                            <div className="w-px h-10 bg-purple-200" />
                            <div className="flex-1 text-right">
                                <span className="text-gray-500 text-xs block">
                                    Starting at
                                </span>
                                <span className="text-purple-600 font-bold text-lg">
                                    $29/month
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-500 mb-4">
                        Save{" "}
                        <span className="text-purple-600 font-bold">
                            100+ hours
                        </span>{" "}
                        every month
                    </p>
                    <Link
                        href="/checkout?source=manual_vs_autopilot"
                        onClick={() => {
                            void emitAnalyticsEvent(
                                {
                                    event_name: ANALYTICS_EVENT_NAMES.ctaClick,
                                    metadata: {
                                        location: "manual_vs_autopilot",
                                        label: "start_automating_today",
                                    },
                                },
                                { useBeacon: true, beaconOnly: true },
                            );
                        }}
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-200"
                    >
                        Start Automating Today
                        <svg
                            className="w-5 h-5"
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
            </div>
        </section>
    );
}
