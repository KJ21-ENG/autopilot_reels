"use client";

import { useState } from "react";

const faqItems = [
    {
        question: "What exactly does AutopilotReels do?",
        answer: "AutopilotReels uses AI to automatically create faceless videos in your chosen niche, then posts them to your connected social media accounts on a schedule you set. You get consistent content without the work.",
    },
    {
        question: "Do I need video editing experience?",
        answer: "Not at all! Our AI handles everything - from scriptwriting to visual creation to final editing. Just pick your niche, customize your style, and we do the rest.",
    },
    {
        question: "What kind of videos can I create?",
        answer: "You can create content in virtually any niche: history, science, motivation, finance, true crime, facts, technology, lifestyle, and hundreds more. Our AI adapts to whatever topic you choose.",
    },
    {
        question: "Which platforms do you support?",
        answer: "We support TikTok, Instagram Reels, and YouTube Shorts. You can publish to one platform or all three simultaneously.",
    },
    {
        question: "Is connecting my social accounts secure?",
        answer: "Absolutely. We use official platform APIs and industry-standard OAuth authentication. Your login credentials are never stored on our servers, and you can disconnect anytime.",
    },
    {
        question: "How many videos can I create?",
        answer: "This depends on your subscription tier. Plans range from 30 videos per month to unlimited. Check our pricing section for the plan that fits your goals.",
    },
    {
        question: "Will my videos actually get views?",
        answer: "Our AI is trained on patterns from viral content and optimizes your videos for maximum engagement. While we can't guarantee specific results, our creators consistently see strong performance.",
    },
    {
        question: "What's your refund policy?",
        answer: "We offer a 7-day money-back guarantee. If AutopilotReels isn't right for you, contact our support team for a full refund, no questions asked.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-20 px-4 bg-white">
            <div className="max-w-3xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Got questions? We have answers
                    </h2>
                    <p className="text-gray-500">
                        Everything you need to know before getting started
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-100"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full py-5 flex items-center justify-between text-left hover:text-purple-600 transition-colors"
                            >
                                <span className="font-medium text-gray-900">{item.question}</span>
                                <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div className="pb-5 text-gray-500 leading-relaxed">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
