import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://releaseit-backend.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Products API:", data); // 👈 debug

        if (data.success && data.products) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
  });

  const [cart, setCart] = useState([]);

  const addProduct = () => {
    setCart([...cart, { variantId: "", quantity: 1 }]);
  };

  const handleCartChange = (index, field, value) => {
    const updatedCart = [...cart];
    updatedCart[index][field] = value;
    setCart(updatedCart);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(
        "https://releaseit-backend.onrender.com/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.firstName + " " + form.lastName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            items: cart,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        // 🔥 redirect after success
        window.location.href = "/thank-you";
      } else {
        alert("❌ Order Failed");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server Error");
    }

    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const variantId = params.get("variant");

    if (variantId && products.length > 0) {
      const foundProduct = products.find((p) =>
        p.variants?.some((v) => String(v.id) === variantId),
      );

      if (foundProduct) {
        const variant = foundProduct.variants[0];

        setCart([
          {
            variantId: variant.id,
            quantity: 1,
            title: foundProduct.title,
            image: foundProduct.image?.src,
          },
        ]);
      }
    }
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* FORM */}
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Cash on Delivery
        </h1>

        {success && (
          <p className="text-green-600 text-center mb-3 font-semibold">
            ✅ Order Placed Successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            className="w-full border p-3 rounded-lg"
            onChange={handleChange}
            required
          />

          <div className="mt-4">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No product selected
              </p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border p-3 rounded-lg"
                >
                  <img
                    src={item.image}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.title}</p>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleCartChange(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                      className="w-20 border p-1 rounded mt-1"
                      min="1"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
