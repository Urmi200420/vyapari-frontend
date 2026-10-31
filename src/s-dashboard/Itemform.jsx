import { useRef, useState } from "react";
import { categories } from "../data.js";
import GlassButton from "../components/GlassButton.jsx";

export const CATS = categories.filter((c) => c.id !== "all");

/*
  The product form, used for both "Add product" and "Edit product".
  initial: the product being edited (leave out for a new one)
  onSubmit(fields, imageFile) must return a promise; throw an Error to show a message.
*/
export default function ItemForm({ initial, onSubmit, submitLabel, busyLabel, keepAfterSave }) {
  const blank = { name: "", description: "", category: CATS[0].id, price: "", stock: "" };
  const start = initial
    ? { name: initial.name, description: initial.description || "", category: initial.category, price: initial.price, stock: initial.stock }
    : blank;

  const [form, setForm] = useState(start);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.imageUrl || "");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const input = useRef(null);

  const pickFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setMsg({ type: "error", text: "Please choose a picture (JPG, PNG or WebP)." });
    if (f.size > 5 * 1024 * 1024) return setMsg({ type: "error", text: "That picture is over 5 MB. Choose a smaller one." });
    setMsg({ type: "", text: "" });
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (Number(form.price) <= 0) return setMsg({ type: "error", text: "Price must be more than 0." });
    if (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) return setMsg({ type: "error", text: "Stock must be a whole number." });
    setBusy(true);
    try {
      const done = await onSubmit({ ...form, name: form.name.trim(), description: form.description.trim() }, file);
      if (keepAfterSave) {
        // "add" form: clear it for the next product
        setForm(blank);
        setFile(null);
        setPreview("");
        if (input.current) input.current.value = "";
        setMsg({ type: "ok", text: done || "Saved." });
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Could not save" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="add-form">
      <label className="field">
        Product title
        <input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Organic honey 500 g" />
      </label>

      <label className="field">
        Description
        <textarea rows="3" maxLength={500} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What should buyers know?" />
      </label>

      <div className="two-fields">
        <label className="field">
          Price (₹)
          <input required type="number" min="1" step="any" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="250" />
        </label>
        <label className="field">
          Stock units
          <input required type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="50" />
        </label>
      </div>

      <label className="field">
        Category
        <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
      </label>

      <div className="field">
        Product picture
        <div
          className={"drop" + (dragging ? " over" : "") + (preview ? " has" : "")}
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        >
          {preview ? <img src={preview} alt="Preview" /> : <span>📷 Drop a picture here, or click to choose</span>}
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
        {preview && file && (
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setFile(null);
              setPreview(initial?.imageUrl || "");
              if (input.current) input.current.value = "";
            }}
          >
            Undo new picture
          </button>
        )}
      </div>

      {msg.text && <p className={"form-msg " + msg.type}>{msg.text}</p>}

      <GlassButton type="submit" variant="solid" block disabled={busy}>
        {busy ? busyLabel : submitLabel}
      </GlassButton>
    </form>
  );
}