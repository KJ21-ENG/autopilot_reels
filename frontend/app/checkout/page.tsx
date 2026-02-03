export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Checkout</h1>
        <p className="text-gray-500 mb-6">
          Redirecting to secure Stripe checkout...
        </p>
        <div className="space-y-3">
          <a
            href="/checkout/success"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
          >
            Simulate Success
          </a>
          <a
            href="/checkout/cancel"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg"
          >
            Simulate Cancel
          </a>
        </div>
      </div>
    </main>
  );
}
