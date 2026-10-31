import { getProfile } from "../api";
import { formatPrice } from "../data.js";
import GlassButton from "../components/GlassButton.jsx";
import { useAsync, Modal, fmtDate } from "./parts.jsx";

// Bill for one order. "Print" opens the browser print window (choose "Save as PDF" there to keep a copy).
export default function Invoice({ order, onClose }) {
  const { data: shop } = useAsync(getProfile);
  const subtotal = order.items.reduce((s, l) => s + l.qty * l.price, 0);

  return (
    <Modal title={"Invoice for ORD-" + order.id} onClose={onClose} wide>
      <div className="invoice-actions no-print">
        <GlassButton variant="solid" onClick={() => window.print()}>
          🖨️ Print / save as PDF
        </GlassButton>
      </div>

      <div className="invoice-sheet">
        <div className="inv-top">
          <div>
            <h3 className="inv-brand">Vyapari</h3>
            <p>Sold by {shop?.shopName || "..."}</p>
            {shop?.pickup && (
              <p className="inv-small">
                {shop.pickup.line1}
                {shop.pickup.line2 ? ", " + shop.pickup.line2 : ""}, {shop.pickup.city} {shop.pickup.pincode}
                <br />
                Phone: {shop.phone}
              </p>
            )}
          </div>
          <div className="inv-right">
            <h3>INVOICE</h3>
            <p>No. ORD-{order.id}</p>
            <p>Date: {fmtDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="inv-bill">
          <b>Bill to</b>
          <p>{order.customer}</p>
          <p className="inv-small">
            {order.address}
            {order.customerPhone ? " · " + order.customerPhone : ""}
          </p>
        </div>

        <table className="inv-table">
          <thead>
            <tr>
              <th>Item</th>
              <th className="num">Price</th>
              <th className="num">Qty</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((l, i) => (
              <tr key={i}>
                <td>{l.name}</td>
                <td className="num">{formatPrice(l.price)}</td>
                <td className="num">{l.qty}</td>
                <td className="num">{formatPrice(l.qty * l.price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Subtotal</td>
              <td className="num">{formatPrice(subtotal)}</td>
            </tr>
            <tr>
              <td colSpan="3">Delivery</td>
              <td className="num">Free</td>
            </tr>
            <tr className="inv-total">
              <td colSpan="3">Total</td>
              <td className="num">{formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="inv-small">Prices include all applicable taxes. Thank you for shopping on Vyapari.</p>
      </div>
    </Modal>
  );
}