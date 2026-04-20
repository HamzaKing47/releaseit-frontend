function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-3">
          🎉 Order Confirmed!
        </h1>

        <p className="text-gray-700 mb-4">
          Thank you! Your order has been placed successfully.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Our team will contact you soon to confirm your order.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default ThankYou;
