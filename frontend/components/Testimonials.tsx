"use client";

const testimonials = [
    {
        id: 1,
        name: "Jerome Morton",
        avatar: "JM",
        rating: 5,
        quote: "Love it. Makes it easy to post when you are having difficulty figuring an idea for a post.",
    },
    {
        id: 2,
        name: "Nana Bandoh",
        avatar: "N",
        rating: 5,
        quote: "Their content is high quality, reliable, and always engaging, which is exactly what I need to keep increasing my views and subscribers.",
    },
    {
        id: 3,
        name: "Cynthia Duncan",
        avatar: "CD",
        rating: 5,
        quote: "Love the different styles and stories they come up with and find. I got lots of views and new subscribers. Still growing though.",
    },
    {
        id: 4,
        name: "Agnes Chen",
        avatar: "AC",
        rating: 5,
        quote: "Good to use as a beginner content creator. The AI handles everything perfectly.",
    },
    {
        id: 5,
        name: "Josh Wright",
        avatar: "JW",
        rating: 5,
        quote: "AutopilotReels has been great. Grown my page a lot! Highly recommend for anyone starting out.",
    },
    {
        id: 6,
        name: "Tom Atemba",
        avatar: "TA",
        rating: 5,
        quote: "For one it's convenient for those who want to tell stories but don't want to show their face.",
    },
    {
        id: 7,
        name: "Sarah Mitchell",
        avatar: "SM",
        rating: 5,
        quote: "The automation is incredible. I set it up once and now I have consistent content daily.",
    },
    {
        id: 8,
        name: "David Park",
        avatar: "DP",
        rating: 5,
        quote: "Best investment for my content business. The ROI has been amazing.",
    },
];

export default function Testimonials() {
    // Duplicate for seamless infinite scroll
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="py-16 px-4 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Hear what they say about us
                    </h2>
                    <p className="text-gray-500">
                        See what our users have to say about AutopilotReels
                    </p>
                </div>

                {/* Auto-scrolling Testimonials - Row 1 */}
                <div className="relative mb-6">
                    <div className="scroll-container">
                        <div className="scroll-content-left">
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <div
                                    key={`row1-${testimonial.id}-${index}`}
                                    className="flex-shrink-0 w-80 mx-2"
                                >
                                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm h-full">
                                        {/* Header: Avatar + Name + Rating */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 text-sm font-semibold">
                                                    {testimonial.avatar}
                                                </div>
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    {testimonial.name}
                                                </span>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className="w-4 h-4 text-yellow-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Quote */}
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {testimonial.quote}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
                </div>

                {/* Auto-scrolling Testimonials - Row 2 (reverse direction) */}
                <div className="relative">
                    <div className="scroll-container">
                        <div className="scroll-content-right">
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <div
                                    key={`row2-${testimonial.id}-${index}`}
                                    className="flex-shrink-0 w-80 mx-2"
                                >
                                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm h-full">
                                        {/* Header: Avatar + Name + Rating */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-700 text-sm font-semibold">
                                                    {testimonial.avatar}
                                                </div>
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    {testimonial.name}
                                                </span>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className="w-4 h-4 text-yellow-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Quote */}
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {testimonial.quote}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
                </div>
            </div>

            <style jsx>{`
        .scroll-container {
          overflow: hidden;
          position: relative;
        }

        .scroll-content-left,
        .scroll-content-right {
          display: flex;
          width: max-content;
          will-change: transform;
          backface-visibility: hidden;
        }

        .scroll-content-left {
          animation: scroll-left 50s linear infinite;
        }

        .scroll-content-right {
          animation: scroll-right 50s linear infinite;
        }

        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes scroll-right {
          from {
            transform: translateX(calc(-100% / 3));
          }
          to {
            transform: translateX(0);
          }
        }

        .scroll-content-left:hover,
        .scroll-content-right:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-content-left,
          .scroll-content-right {
            animation: none;
            transform: none;
          }
        }
      `}</style>
        </section>
    );
}
