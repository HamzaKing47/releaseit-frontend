import { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { BACKEND } from "./backend.js";

const DEFAULT_FIELDS = [
  { name: "firstName", label: "First Name", type: "text", required: true, placeholder: "First name" },
  { name: "lastName", label: "Last Name", type: "text", required: false, placeholder: "Last name" },
  { name: "phone", label: "Phone", type: "phone", required: true, placeholder: "" },
  { name: "address", label: "Address", type: "text", required: true, placeholder: "Street address, house no., area" },
  { name: "city", label: "City", type: "text", required: true, placeholder: "City" },
];

// Convert label to a safe state key if backend didn't store a `name` field
const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

function App() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  const variantId = params.get("variant");

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h1 className="text-lg font-bold text-gray-900 mb-1">Invalid Access</h1>
          <p className="text-sm text-gray-500">
            This checkout link is missing required parameters.
          </p>
        </div>
      </div>
    );
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [form, setForm] = useState({});
  const [cart, setCart] = useState([]);

  // Fetch products + form schema together
  useEffect(() => {
    fetch(`${BACKEND}/api/products?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) setProducts(data.products);
        else setProducts([]);
      })
      .catch(() => setProducts([]));

    fetch(`${BACKEND}/api/settings?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.formSchema) && data.formSchema.length) {
          // Normalize — give every field a `name` (use existing or derive from label)
          const normalized = data.formSchema.map((f) => ({
            ...f,
            name: f.name || slugify(f.label) || `field_${f.id || Math.random()}`,
          }));
          setFields(normalized);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleCartChange = (index, field, value) => {
    const updatedCart = [...cart];
    updatedCart[index][field] = value;
    setCart(updatedCart);
  };

  const findField = (n) => fields.find((f) => f.name === n);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Build canonical payload — always send name/phone/address/city
    const firstName = form.firstName || form[findField("firstName")?.name] || "";
    const lastName = form.lastName || form[findField("lastName")?.name] || "";
    const phone = form.phone || form[findField("phone")?.name] || "";
    const address = form.address || form[findField("address")?.name] || "";
    const city = form.city || form[findField("city")?.name] || "";

    // Also include all custom fields as extra metadata
    const extras = {};
    fields.forEach((f) => {
      if (!["firstName", "lastName", "phone", "address", "city"].includes(f.name)) {
        extras[f.name] = form[f.name] || "";
      }
    });

    // Pull email + postal code (if such fields exist) for fraud checks
    const emailField = fields.find(
      (f) => f.type === "email" || f.name === "email",
    );
    const postalField = fields.find((f) =>
      ["postalCode", "postal_code", "zip", "zipcode"].includes(f.name),
    );
    const email = emailField ? form[emailField.name] || "" : "";
    const postalCode = postalField ? form[postalField.name] || "" : "";

    try {
      const res = await fetch(`${BACKEND}/api/create-order?shop=${shop}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim() || firstName,
          phone,
          address,
          city,
          email,
          postalCode,
          items: cart,
          extras,
        }),
      });

      const data = await res.json();

      if (data.blocked) {
        // Fraud rule blocked this order — show the merchant's custom message
        setError(data.message || "Your order could not be processed.");
        setLoading(false);
        return;
      }

      if (data.success) {
        const orderId = data.order?.id || "";
        const orderValue = data.order?.total_price || "";
        const product = cart[0]?.title || "";

        window.location.href =
          `/thank-you?shop=${shop}` +
          `&variant=${cart[0]?.variantId || ""}` +
          `&orderId=${orderId}` +
          `&value=${orderValue}` +
          `&product=${encodeURIComponent(product)}`;
      } else {
        setError(data.message || "Order failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection and try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (variantId && products.length > 0) {
      const foundProduct = products.find((p) =>
        p.variants?.some((v) => String(v.id) === variantId),
      );

      if (foundProduct) {
        const variant = foundProduct.variants.find(
          (v) => String(v.id) === variantId,
        );
        setCart([
          {
            variantId: variant.id,
            quantity: 1,
            title: foundProduct.title,
            image: foundProduct.image?.src,
            price: variant.price,
          },
        ]);
      }
    }
  }, [products]);

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0,
  );

  // Render a single field based on its type
  const renderField = (field) => {
    const value = form[field.name] ?? "";
    const baseInput =
      "w-full px-3 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gray-900 focus:outline-none transition";

    if (field.type === "hidden") return null;

    if (field.type === "phone") {
      return (
        <div className="phone-wrap w-full px-3 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-gray-50 focus-within:bg-white focus-within:border-gray-900 transition">
          <PhoneInput
            international
            defaultCountry="PK"
            value={value}
            onChange={(v) => handleChange(field.name, v)}
          />
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          rows={3}
          placeholder={field.placeholder || field.label}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required={field.required}
          className={baseInput + " resize-y"}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required={field.required}
          className={baseInput}
        >
          <option value="">
            {field.placeholder || `Select ${field.label}`}
          </option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
        placeholder={field.placeholder || field.label}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
        required={field.required}
        className={baseInput}
      />
    );
  };

  // Group fields: contact (firstName, lastName, phone, email) and address (rest)
  const contactNames = ["firstName", "lastName", "phone", "email"];
  const contactFields = fields.filter(
    (f) => contactNames.includes(f.name) && f.type !== "hidden",
  );
  const otherFields = fields.filter(
    (f) => !contactNames.includes(f.name) && f.type !== "hidden",
  );

  // Render first+last name side-by-side if both present
  const firstNameField = contactFields.find((f) => f.name === "firstName");
  const lastNameField = contactFields.find((f) => f.name === "lastName");
  const restContact = contactFields.filter(
    (f) => f.name !== "firstName" && f.name !== "lastName",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-600 mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Secure Checkout
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Cash on Delivery
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Pay when you receive your order
          </p>
        </div>

        {/* Order summary */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Your Order
            </p>
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900 truncate">
                    {item.title}
                  </p>
                  {item.price && (
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      Rs. {item.price}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-gray-400">Qty:</span>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          handleCartChange(
                            index,
                            "quantity",
                            Math.max(1, (item.quantity || 1) - 1),
                          )
                        }
                        className="w-7 h-7 text-gray-500 hover:bg-gray-50 text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-[13px] font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCartChange(
                            index,
                            "quantity",
                            (item.quantity || 1) + 1,
                          )
                        }
                        className="w-7 h-7 text-gray-500 hover:bg-gray-50 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-gray-900">
                    Rs. {(Number(item.price) || 0) * (item.quantity || 1)}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-gray-600">
                Subtotal
              </span>
              <span className="text-[16px] font-extrabold text-gray-900">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact section */}
            {contactFields.length > 0 && (
              <div>
                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Contact Information
                </p>
                {(firstNameField || lastNameField) && (
                  <div className="grid grid-cols-2 gap-3">
                    {firstNameField && (
                      <div>{renderField(firstNameField)}</div>
                    )}
                    {lastNameField && <div>{renderField(lastNameField)}</div>}
                  </div>
                )}
                {restContact.map((f) => (
                  <div key={f.name} className="mt-3">
                    {renderField(f)}
                  </div>
                ))}
              </div>
            )}

            {/* Shipping address section */}
            {otherFields.length > 0 && (
              <div className="pt-2">
                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Shipping Address
                </p>
                {otherFields.map((f, idx) => (
                  <div key={f.name} className={idx > 0 ? "mt-3" : ""}>
                    {renderField(f)}
                  </div>
                ))}
              </div>
            )}

            {cart.length === 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <p className="text-[12px] text-amber-800 font-semibold">
                  ⚠️ No product selected
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Please go back and select a product first.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-[12px] text-red-700 font-semibold">
                  ❌ {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-[14px] font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order
                  {subtotal > 0 && (
                    <span className="text-white/70">
                      · Rs. {subtotal.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-gray-400 mt-2">
              🔒 Your information is secure and never shared
            </p>
          </form>
        </div>

        {/* Trust footer */}
        <div className="text-center mt-5 text-[11px] text-gray-400">
          Powered by <span className="font-semibold text-gray-600">ReleaseIt</span>
        </div>
      </div>
    </div>
  );
}

export default App;
