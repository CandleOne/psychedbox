import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import axios from "axios";

interface NewsletterFormProps {
  source?: string;
  showIcon?: boolean;
  className?: string;
}

export default function NewsletterForm({
  source = "website",
  showIcon = false,
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      await axios.post("/api/subscribe", { email: email.trim(), source });
      setStatus("success");
      setMessage("You're subscribed! 🎉");
      setEmail("");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Something went wrong. Please try again.";
      if (msg.toLowerCase().includes("already")) {
        setStatus("success");
        setMessage("You're already subscribed! ✨");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(msg);
      }
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center justify-center gap-2 text-green-600 font-semibold py-3 ${className}`}>
        <Check size={18} /> {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Your email address"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-400 text-sm"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{ backgroundColor: "#FF6B6B" }}
          className="px-6 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : showIcon ? (
            <>Subscribe <ArrowRight size={16} /></>
          ) : (
            "SUBSCRIBE"
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm mt-2">{message}</p>
      )}
    </form>
  );
}
