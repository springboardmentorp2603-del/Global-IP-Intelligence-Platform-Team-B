import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, User } from "lucide-react";

export default function AdminApprovalsPage() {

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/api/admin/analysts/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(res.data);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    await axios.post(`http://localhost:8081/api/admin/analysts/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPending();
  };

  const reject = async (id) => {
    await axios.post(`http://localhost:8081/api/admin/analysts/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPending();
  };

  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Analyst Approvals
        </h2>

        <span className="text-sm text-gray-400">
          {pending.length} pending
        </span>
      </div>

      {/* 🔥 STATS */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 text-gray-400 text-sm">
        Review and manage analyst access requests
      </div>

      {/* 🔥 CONTENT */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading requests...
        </div>
      ) : pending.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          ✅ No pending requests
        </div>
      ) : (
        <div className="grid gap-4">

          {pending.map((a) => (
            <div
              key={a.id}
              className="group flex justify-between items-center p-5 rounded-2xl
                         bg-slate-900/70 backdrop-blur border border-slate-700
                         hover:bg-slate-800 transition-all duration-300 shadow-lg"
            >

              {/* USER INFO */}
              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <User className="text-indigo-400" />
                </div>

                {/* Details */}
                <div>
                  <p className="text-white font-semibold">
                    {a.username}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {a.email}
                  </p>

                  <span className="text-xs text-amber-400">
                    Pending Approval
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">

                <button
                  onClick={() => approve(a.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-green-600 hover:bg-green-700
                             text-sm font-medium transition-all
                             hover:scale-105"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>

                <button
                  onClick={() => reject(a.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-red-600 hover:bg-red-700
                             text-sm font-medium transition-all
                             hover:scale-105"
                >
                  <XCircle size={16} />
                  Reject
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}