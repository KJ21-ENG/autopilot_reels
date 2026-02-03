export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment canceled</h1>
        <p className="text-gray-500 mb-6">
          You can return to pricing and try again anytime.
        </p>
        <a
          href="/#pricing"
          className="inline-flex w-full items-center justify-center bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg"
        >
          Return to Pricing
        </a>
      </div>
    </main>
  );
}
