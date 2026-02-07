import CreateResourceModal from "@/components/dashboard/CreateResourceModal";
import DeleteAccountModal from "@/components/dashboard/DeleteAccountModal";
import PasswordUpdateForm from "@/components/dashboard/PasswordUpdateForm";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Password Section */}
            <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                        Security
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Update your password and manage account security.
                    </p>
                </div>
                <div className="p-6">
                    <PasswordUpdateForm />
                </div>
            </section>

            {/* Connected Accounts Section */}
            <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                        Connected accounts
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Connect your social media accounts for automatic content
                        distribution.
                    </p>
                </div>
                <div className="p-12 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                        <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                        No accounts connected
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Connect your social media accounts to automate content
                        posting across platforms.
                    </p>
                    <div className="inline-block relative">
                        <CreateResourceModal buttonLabel="+ Connect new account" />
                    </div>
                </div>
            </section>

            {/* Danger Zone Section */}
            <section className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-red-100 bg-red-50/50">
                    <h2 className="text-lg font-medium text-red-700">
                        Danger zone
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Irreversible actions that affect your account.
                    </p>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">
                            Delete account
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Permanently delete your account and all data
                        </p>
                    </div>
                    <DeleteAccountModal />
                </div>
            </section>
        </div>
    );
}
