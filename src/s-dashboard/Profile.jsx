import { useState } from "react";
import { getProfile, saveProfile } from "../api";
import GlassButton from "../components/GlassButton.jsx";
import { useAsync, Loading, ErrorNote } from "./parts.jsx";

const digits = (s, n) => new RegExp("^\\d{" + n + "}$").test(s.replace(/\s/g, ""));

export default function Profile() {
  const { data, error, reload } = useAsync(getProfile);
  if (error) return <ErrorNote error={error} onRetry={reload} />;
  if (!data) return <Loading text="Loading your shop..." />;
  return <ProfileForm initial={data} />;
}

function ProfileForm({ initial }) {
  const [shop, setShop] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const setTop = (k, v) => setShop((s) => ({ ...s, [k]: v }));
  const setPick = (k, v) => setShop((s) => ({ ...s, pickup: { ...s.pickup, [k]: v } }));
  const p = shop.pickup;

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (!digits(shop.phone, 10)) return setMsg({ type: "error", text: "Shop phone must be 10 digits." });
    if (!digits(p.contactPhone, 10)) return setMsg({ type: "error", text: "Pickup contact phone must be 10 digits." });
    if (!digits(p.pincode, 6)) return setMsg({ type: "error", text: "Pincode must be 6 digits." });
    setBusy(true);
    try {
      await saveProfile(shop);
      setMsg({ type: "ok", text: "Saved. Delivery partners will now use this pickup address." });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Could not save" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="dash-stack">
      <section className="panel">
        <h2 className="stack-title small">
          <em>Who you are</em>
          <strong>Shop profile</strong>
        </h2>
        <div className="add-form">
          <label className="field">
            Store name
            <input required maxLength={60} value={shop.shopName} onChange={(e) => setTop("shopName", e.target.value)} />
          </label>
          <div className="two-fields">
            <label className="field">
              Contact phone
              <input required inputMode="numeric" value={shop.phone} onChange={(e) => setTop("phone", e.target.value)} placeholder="10 digits" />
            </label>
            <label className="field">
              Contact email
              <input required type="email" value={shop.email} onChange={(e) => setTop("email", e.target.value)} />
            </label>
          </div>
          <label className="field">
            About your business
            <textarea rows="3" maxLength={400} value={shop.description} onChange={(e) => setTop("description", e.target.value)} placeholder="Tell buyers what you sell and what makes you different" />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2 className="stack-title small">
          <em>Where partners collect</em>
          <strong>Pickup address</strong>
        </h2>
        <p className="dash-note left">The delivery partner comes to this address to collect each order.</p>
        <div className="add-form">
          <div className="two-fields">
            <label className="field">
              Person to meet
              <input required value={p.contactPerson} onChange={(e) => setPick("contactPerson", e.target.value)} />
            </label>
            <label className="field">
              Their phone
              <input required inputMode="numeric" value={p.contactPhone} onChange={(e) => setPick("contactPhone", e.target.value)} placeholder="10 digits" />
            </label>
          </div>
          <label className="field">
            Address line 1
            <input required value={p.line1} onChange={(e) => setPick("line1", e.target.value)} />
          </label>
          <label className="field">
            Address line 2
            <input value={p.line2} onChange={(e) => setPick("line2", e.target.value)} />
          </label>
          <label className="field">
            Landmark
            <input value={p.landmark} onChange={(e) => setPick("landmark", e.target.value)} placeholder="Easy to spot nearby place" />
          </label>
          <div className="three-fields">
            <label className="field">
              City
              <input required value={p.city} onChange={(e) => setPick("city", e.target.value)} />
            </label>
            <label className="field">
              State
              <input required value={p.state} onChange={(e) => setPick("state", e.target.value)} />
            </label>
            <label className="field">
              Pincode
              <input required inputMode="numeric" value={p.pincode} onChange={(e) => setPick("pincode", e.target.value)} placeholder="6 digits" />
            </label>
          </div>
          <label className="field">
            Pickup hours
            <input value={p.hours} onChange={(e) => setPick("hours", e.target.value)} placeholder="e.g. 10 am - 7 pm, Mon to Sat" />
          </label>

          {msg.text && <p className={"form-msg " + msg.type}>{msg.text}</p>}
          <GlassButton type="submit" variant="solid" disabled={busy}>
            {busy ? "Saving..." : "Save shop details"}
          </GlassButton>
        </div>
      </section>
    </form>
  );
}