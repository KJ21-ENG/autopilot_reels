"use client";

export default function StudioPreview() {
    return (
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto text-center">
                {/* Section Header */}
                <div className="mb-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Over <span className="text-purple-600">2.5 Million</span> Videos
                        <br />Created by AutopilotReels
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Your next viral video is just a few clicks away.
                    </p>
                    <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-200">
                        Get Started
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dashboard Preview */}
                <div className="mt-12 relative">
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-purple-200/30 blur-3xl rounded-full scale-75" />

                    {/* Dashboard mockup - Light theme */}
                    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
                        {/* Header bar */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
                                </svg>
                                <span className="text-gray-900 font-medium text-sm">AutopilotReels Studio</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                U
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="p-6 bg-white">
                            {/* Greeting */}
                            <div className="text-left mb-6">
                                <h3 className="text-gray-900 text-xl font-semibold flex items-center gap-2">
                                    Good morning, Creator
                                    <span className="text-2xl">👋</span>
                                </h3>
                                <p className="text-gray-500 text-sm">Here&apos;s what&apos;s happening with your content</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                                    <p className="text-gray-500 text-xs mb-1">Videos Created</p>
                                    <p className="text-gray-900 text-2xl font-bold">147</p>
                                    <p className="text-green-600 text-xs">+12 this week</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                                    <p className="text-gray-500 text-xs mb-1">Total Views</p>
                                    <p className="text-gray-900 text-2xl font-bold">2.4M</p>
                                    <p className="text-green-600 text-xs">+156K this week</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                                    <p className="text-gray-500 text-xs mb-1">Scheduled</p>
                                    <p className="text-gray-900 text-2xl font-bold">23</p>
                                    <p className="text-purple-600 text-xs">Next in 2 hours</p>
                                </div>
                            </div>

                            {/* Quick Tools */}
                            <div className="mb-6">
                                <p className="text-gray-500 text-sm text-left mb-3">Quick Tools</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-purple-400 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-gray-900 text-sm font-medium">New Video</p>
                                            <p className="text-gray-500 text-xs">Create from scratch</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-gray-300 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-gray-900 text-sm font-medium">Templates</p>
                                            <p className="text-gray-500 text-xs">Trending templates</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-gray-300 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-gray-900 text-sm font-medium">Schedule</p>
                                            <p className="text-gray-500 text-xs">Plan your posts</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Videos */}
                            <div>
                                <p className="text-gray-500 text-sm text-left mb-3">Recent Videos</p>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {[
                                        { title: "Ancient Rome", views: "245K", color: "from-amber-400 to-orange-500" },
                                        { title: "Tech Trends", views: "189K", color: "from-blue-400 to-cyan-500" },
                                        { title: "Life Hacks", views: "312K", color: "from-green-400 to-emerald-500" },
                                        { title: "Mind Facts", views: "156K", color: "from-purple-400 to-pink-500" },
                                    ].map((video, i) => (
                                        <div key={i} className="flex-shrink-0 w-28">
                                            <div className={`aspect-[9/16] rounded-lg bg-gradient-to-br ${video.color} mb-2 shadow-md`} />
                                            <p className="text-gray-900 text-xs font-medium truncate">{video.title}</p>
                                            <p className="text-gray-500 text-xs">{video.views} views</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
