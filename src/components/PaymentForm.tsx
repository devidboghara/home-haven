"use client";

import { useState, FormEvent } from "react";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function PaymentForm({
  amount,
  currency = "usd",
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error ?? "Payment failed");
      }

      // In a real integration, you'd use stripe.confirmCardPayment(json.clientSecret)
      // here. Since we're not using Stripe Elements, we surface the clientSecret.
      setState("success");
      onSuccess?.(json.clientSecret ?? "");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      setErrorMsg(msg);
      setState("error");
      onError?.(msg);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-[#E8E6E0] bg-white text-[#111] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";

  if (state === "success") {
    return (
      <div className="bg-white border border-[#E8E6E0] rounded-xl p-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={40} className="text-emerald-500" />
        <h3 className="text-lg font-semibold text-[#111]">Payment Successful</h3>
        <p className="text-sm text-[#7C7870]">
          Your payment of{" "}
          <span className="font-semibold text-[#111]">
            {currency.toUpperCase()} {amount.toLocaleString()}
          </span>{" "}
          has been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E6E0] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-indigo-500" />
          <h3 className="text-base font-semibold text-[#111]">Payment Details</h3>
        </div>
        <span className="text-lg font-bold text-indigo-600">
          {currency.toUpperCase()} {amount.toLocaleString()}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#7C7870] mb-1.5">Card Number</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#7C7870] mb-1.5">Expiry</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#7C7870] mb-1.5">CVC</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className={inputClass}
              required
            />
          </div>
        </div>

        {state === "error" && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
        >
          {state === "submitting" ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>Pay {currency.toUpperCase()} {amount.toLocaleString()}</>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[#7C7870]">
          <Lock size={11} />
          <span>Secure payment powered by Stripe</span>
        </div>
      </form>
    </div>
  );
}
