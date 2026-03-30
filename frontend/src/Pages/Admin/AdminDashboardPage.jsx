import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Clock, Activity, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {

  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const u = await axios.get("http://localhost:8081/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const p = await axios.get("http://localhost:8081/api/admin/analysts/pending", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(u.data);
    setPending(p.data);
  };

  // 📊 simple insights
  const totalUsers = users.length;
  const pendingCount = pending.length;
  const approvalRate = totalUsers
    ? Math.round(((totalUsers - pendingCount) / totalUsers) * 100)
    : 0;

  return (
    <div className="space-y-8">

      {/* 🔥 HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor your platform in real-time
        </p>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* USERS */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 border border-indigo-500/20 backdrop-blur-xl hover:scale-105 transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h2 className="text-3xl font-bold text-white mt-2">{totalUsers}</h2>
            </div>
            <Users className="text-indigo-400" />
          </div>
        </div>

        {/* PENDING */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/20 backdrop-blur-xl hover:scale-105 transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Requests</p>
              <h2 className="text-3xl font-bold text-white mt-2">{pendingCount}</h2>
            </div>
            <Clock className="text-amber-400" />
          </div>
        </div>

        {/* APPROVAL RATE */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border border-emerald-500/20 backdrop-blur-xl hover:scale-105 transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approval Rate</p>
              <h2 className="text-3xl font-bold text-white mt-2">
                {approvalRate}%
              </h2>
            </div>
            <TrendingUp className="text-emerald-400" />
          </div>

          {/* progress bar */}
          <div className="w-full bg-slate-700 h-2 rounded mt-4">
            <div
              className="bg-emerald-400 h-2 rounded"
              style={{ width: `${approvalRate}%` }}
            />
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/20 backdrop-blur-xl hover:scale-105 transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">System Status</p>
              <h2 className="text-2xl font-bold text-green-400 mt-2">
                ● Active
              </h2>
            </div>
            <Activity className="text-purple-400" />
          </div>
        </div>

      </div>

      {/* 🔥 MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 📋 PENDING ANALYST LIST */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-white font-semibold mb-4">
            Pending Analyst Requests
          </h3>

          {pending.length === 0 ? (
            <p className="text-gray-400 text-sm">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pending.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-slate-800 p-3 rounded-lg"
                >
                  <span className="text-gray-200 text-sm">
                    {p.username}
                  </span>
                  <span className="text-xs text-amber-400">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📊 QUICK INSIGHTS */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-white font-semibold mb-4">
            Quick Insights
          </h3>

          <div className="space-y-3 text-sm text-gray-400">
            <p>• Total Users: {totalUsers}</p>
            <p>• Pending Analysts: {pendingCount}</p>
            <p>• Approval Rate: {approvalRate}%</p>
            <p>• System Running Smoothly</p>
          </div>
        </div>

      </div>

    </div>
  );
}