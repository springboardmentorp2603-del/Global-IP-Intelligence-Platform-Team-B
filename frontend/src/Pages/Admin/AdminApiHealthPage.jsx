import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Activity, CheckCircle, XCircle, Loader2 } from "lucide-react";

const BASE = "http://localhost:8081";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function AdminApiHealthPage() {
  const token = localStorage.getItem("accessToken");
  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  const [health,    setHealth]    = useState(null);
  const [checking,  setChecking]  = useState(false);

  const fetchHealth = async () => {
    setChecking(true);
    try {
      const res = await axios.get(`${BASE}/api/admin/health`, { headers: authHeaders() });
      setHealth(res.data);
    } catch (err) {
      setHealth({
        api: "lens",
        status: "DOWN",
        responseTimeMs: null,
        checkedAt: new Date().toISOString(),
        errorMessage: err?.response?.data?.message ?? "Could not reach backend",
      });
    } finally {
      setChecking(false);
    }
  };

  // Initial fetch + auto-refresh every 60 s
  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 60_000);
    return () => clearInterval(id);
  }, []);

  const isUp = health?.status === "UP";

return (
  <div className="space-y-8">

    {/* 🔥 HEADER */}
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          API Health Monitor
        </h2>
        <p className="text-gray-400 text-sm">
          Real-time backend status monitoring
        </p>
      </div>

      <button
        onClick={fetchHealth}
        disabled={checking}
        className="flex items-center gap-2 px-5 py-2 rounded-xl
                   bg-gradient-to-r from-indigo-500 to-purple-600
                   hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30
                   disabled:opacity-50 transition-all"
      >
        <Loader2 size={16} className={checking ? "animate-spin" : ""} />
        {checking ? "Checking..." : "Refresh"}
      </button>
    </div>

    {/* 🔥 MAIN CARD */}
    <div className="relative">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-30 rounded-3xl"></div>

      <div className="relative bg-slate-900/70 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 shadow-2xl">

        {/* Loading */}
        {checking && !health && (
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 size={22} className="animate-spin" />
            <span>Checking API status...</span>
          </div>
        )}

        {health && (
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10">

            {/* 🔥 LEFT */}
            <div className="flex items-center gap-6">

              {/* Status Circle */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center
                               text-xl font-bold
                               ${isUp
                                 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                 : "bg-red-500/20 text-red-400 border border-red-500/40"}`}>

                {isUp ? <CheckCircle size={28} /> : <XCircle size={28} />}
              </div>

              {/* Info */}
              <div>
                <p className="text-xl font-bold text-white">Lens API</p>
                <p className="text-gray-400 text-sm">Patent Search Service</p>

                <p className="text-xs text-gray-500 mt-2">
                  Last checked: {formatDate(health.checkedAt)}
                </p>
              </div>
            </div>

            {/* 🔥 RIGHT */}
            <div className="flex flex-col items-end gap-3">

              {/* STATUS */}
              <span className={`px-5 py-2 rounded-full text-sm font-bold
                               ${isUp
                                 ? "bg-emerald-500/20 text-emerald-300"
                                 : "bg-red-500/20 text-red-300"}`}>
                {health.status}
              </span>

              {/* RESPONSE TIME */}
              {health.responseTimeMs != null && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Response Time</p>
                  <p className={`text-lg font-bold
                    ${health.responseTimeMs < 500
                      ? "text-emerald-400"
                      : health.responseTimeMs < 1500
                      ? "text-amber-400"
                      : "text-red-400"}`}>
                    {health.responseTimeMs} ms
                  </p>
                </div>
              )}

              {/* ERROR */}
              {!isUp && health.errorMessage && (
                <p className="text-xs text-red-400 max-w-xs text-right">
                  {health.errorMessage}
                </p>
              )}

              {/* LIVE INDICATOR */}
              {checking && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  updating...
                </span>
              )}
            </div>

          </div>
        )}
      </div>
    </div>

    {/* 🔥 STATUS EXPLAIN */}
    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-xs text-gray-400">
      System sends a small request to Lens API every 60 seconds.
      <span className="text-emerald-400"> UP</span> means working,
      <span className="text-red-400"> DOWN</span> means failure or timeout.
    </div>

  </div>
);
}