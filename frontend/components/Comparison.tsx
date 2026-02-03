"use client";

const comparisonData = [
    {
        title: "Hiring freelancers",
        icon: "✖",
        description: "Costs $100-500 per video. Managing editors, revisions, and deadlines becomes a full-time job itself.",
        highlight: false,
    },
    {
        title: "DIY video editing",
        icon: "✖",
        description: "Hours spent learning software, writing scripts, finding music, and editing. Time you could spend growing your business.",
        highlight: false,
    },
    {
        title: "AutopilotReels",
        icon: "✓",
        description: "Set it once, watch it work. Our AI creates, edits, and publishes engaging content across all your platforms.",
        highlight: true,
    },
];

export default function Comparison() {
    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        The smarter way to create content
                    </h2>
                    <p className="text-gray-500">
                        Stop trading time for content. Let automation do the heavy lifting.
                    </p>
                </div>

                {/* Comparison Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {comparisonData.map((item, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-xl border-2 transition-all ${item.highlight
                                    ? "bg-white border-purple-200 shadow-lg"
                                    : "bg-white border-gray-100"
                                }`}
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <span
                                    className={`text-xl font-bold ${item.highlight ? "text-purple-600" : "text-gray-400"
                                        }`}
                                >
                                    {item.icon}
                                </span>
                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {item.description}
                            </p>
                            {item.highlight && (
                                <div className="mt-4 flex items-center gap-2 text-purple-600 text-sm font-medium">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                    Best choice
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
