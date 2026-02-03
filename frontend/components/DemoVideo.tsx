"use client";

export default function DemoVideo() {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Watch the magic happen
                    </h2>
                    <p className="text-gray-500">
                        See how AutopilotReels transforms a simple idea into a viral-ready video
                    </p>
                </div>

                {/* Video Player */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 opacity-20">
                        <svg viewBox="0 0 100 100" className="text-purple-400" fill="currentColor">
                            <path d="M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20Z" />
                        </svg>
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 opacity-20">
                        <svg viewBox="0 0 100 100" className="text-purple-400" fill="currentColor">
                            <path d="M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20Z" />
                        </svg>
                    </div>

                    {/* Video content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-7 h-7 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm4 3l6 3-6 3V9z" />
                            </svg>
                            <span className="text-white font-semibold text-lg">AutopilotReels</span>
                        </div>
                        <h3 className="text-white text-3xl md:text-4xl font-bold mb-8">
                            FROM IDEA T<span className="text-purple-400">O</span> VIRAL<br />
                            IN MINUTES
                        </h3>

                        {/* Play button */}
                        <button className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                            <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
