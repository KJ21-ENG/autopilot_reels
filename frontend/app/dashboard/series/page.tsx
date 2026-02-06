export default function SeriesPage() {
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
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                    </div>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                    System at Capacity
                </h3>
                <p className="text-sm text-gray-500 mb-6 px-4">
                    We are currently experiencing high volume. New series
                    creation is being throttled to ensure quality for existing
                    batches.
                </p>
            </div>
        </div>
    );
}
