export default function VideosPage() {
    return (
        <div className="flex-1 flex flex-col items-center pt-24 text-center">
            <div className="max-w-md mx-auto">
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                    System at Capacity
                </h3>
                <p className="text-sm text-gray-500 mb-6 px-4">
                    We are currently experiencing high volume. New video
                    generation is being throttled to ensure quality for existing
                    batches.
                </p>
            </div>
        </div>
    );
}
