export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment successful</h1>
        <p className="text-gray-500 mb-6">
          Thank you! Continue to set up your account.
        </p>
        <a
          href="/auth"
          className="inline-flex w-full items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
        >
          Continue to Sign Up
        </a>
      </div>
    </main>
  );
}
