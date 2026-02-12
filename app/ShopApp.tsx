"use client";

import { useState } from "react";
import "./styles.css";

function ProductCard(props: {
  product: { id: string; name: string; price: number; description: string };
  onBuy: (p: { id: string; name: string; price: number; description: string }) => void;
}) {
  return (
    <div className="card">
      <h3 className="productTitle">{props.product.name}</h3>
      <p className="muted">{props.product.description}</p>

      <div className="row">
        <strong>${props.product.price.toFixed(2)}</strong>
        <button className="btn" onClick={() => props.onBuy(props.product)}>
          Buy
        </button>
      </div>
    </div>
  );
}

function Checkout(props: {
  product: { id: string; name: string; price: number; description: string };
  onBack: () => void;
  onSuccess: (receipt: { name: string; last4: string }) => void;
}) {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");

  function getDigits(text: string) {
    return text.replace(/\D/g, "");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const digits = getDigits(cardNumber);

    const nameOk = name.trim().length >= 2;
    const cardOk = digits.length === 16;
    const expiryOk = /^\d{2}\/\d{2}$/.test(expiry);
    const cvvOk = /^\d{3}$/.test(getDigits(cvv)); 
    const zipOk = /^\d{5}$/.test(getDigits(zip));

    if (!nameOk) return alert("Please enter the name on the card.");
    if (!cardOk) return alert("Card number must be 16 digits.");
    if (!expiryOk) return alert("Expiry must look like MM/YY (example: 02/29).");
    if (!cvvOk) return alert("CVV must be 3 digits.");
    if (!zipOk) return alert("ZIP must be 5 digits.");

    props.onSuccess({
      name: name.trim(),
      last4: digits.slice(-4),
    });
  }

  return (
    <div className="card">
      <button className="link" onClick={props.onBack}>
        ← Back
      </button>

      <h2 className="title">Checkout</h2>
      <p className="muted">
        Buying <strong>{props.product.name}</strong> for{" "}
        <strong>${props.product.price.toFixed(2)}</strong>
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name on Card
          <input value={name} onChange={(e) => setName(e.target.value)} 
          placeholder="Leon Kennedy"
          />
          
        </label>

        <label>
          Card Number (16 digits)
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="8675 3098 6753 0986"
          />
        </label>

        <div className="twoCol">
          <label>
            Expiry (MM/YY)
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="07/29"
            />
          </label>

          <label>
            CVV
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
            />
          </label>
        </div>

        <label>
          Billing ZIP
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="33333"
          />
        </label>

        <button className="btn" type="submit">
          Pay ${props.product.price.toFixed(2)}
        </button>


      </form>
    </div>
  );
}

export default function ShopApp() {
  const products = [
    { id: "1", name: "Green Herb", price: 5.99, description: "It looks like a green plant. I wonder if I could combine it with anything..." },
    { id: "2", name: "Red Herb", price: 15.00, description: "It looks like a red plant. I wonder if I could combine it with anything..." },
    { id: "3", name: "Blue Herb", price: 25.00, description: "It looks like a blue plant. I wonder if I could combine it with anything..." },
    { id: "4", name: "Jill Sandwich", price: 2.99, description: "\"That was too close...You were almost a Jill Sandwich.\"" },
    { id: "5", name: "Golden Egg", price: 100.00, description: "A rare and valuable golden egg." },
  ];

  const [stage, setStage] = useState<"shop" | "checkout" | "success">("shop");
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [receiptName, setReceiptName] = useState("");
  const [receiptLast4, setReceiptLast4] = useState("");

  function startCheckout(product: any) {
    setSelectedProduct(product);
    setStage("checkout");
  }

  function finishCheckout(receipt: { name: string; last4: string }) {
    setReceiptName(receipt.name);
    setReceiptLast4(receipt.last4);
    setStage("success");
  }

  function backToShop() {
    setStage("shop");
  }

  return (
    <div className="container">
      <h1 className="header">The Stranger Market</h1>

      {stage === "shop" && (
        <>
          <p >What're ya buyin?</p>
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onBuy={startCheckout} />
            ))}
          </div>
        </>
      )}

      {stage === "checkout" && (
        <Checkout
          product={selectedProduct}
          onBack={backToShop}
          onSuccess={finishCheckout}
        />
      )}

      {stage === "success" && (
        <div className="card">
          <h2 className="title">Success</h2>
          <p>
            Thanks <strong>{receiptName}</strong>!
          </p>
          <p className="muted">
            Payment was made with a card ending in <strong>{receiptLast4}</strong>.
          </p>
          <button className="btn" onClick={backToShop}>
            Buy Another Item
          </button>
        </div>
      )}
    </div>
  );
}
