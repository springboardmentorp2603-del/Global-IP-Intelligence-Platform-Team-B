import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Users } from "lucide-react";

export default function AdminUsersPage() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8081/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  // 🔍 filter users
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Users</h2>
          <span className="text-gray-400 text-sm">
            ({users.length})
          </span>
        </div>

        {/* 🔍 Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-gray-200 text-sm
                       rounded-lg pl-9 pr-3 py-2 outline-none
                       focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-xl font-bold text-white">{users.length}</p>
        </div>
      </div>

      {/* 🔥 USERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="bg-slate-800/60 backdrop-blur border border-slate-700
                       rounded-2xl p-5 hover:scale-[1.02] hover:shadow-xl
                       transition-all duration-300"
          >

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-white font-bold text-lg">
              {u.username?.charAt(0).toUpperCase()}
            </div>

            {/* Username */}
            <h3 className="text-white font-semibold mt-3">
              {u.username}
            </h3>

            {/* Roles */}
            <div className="flex flex-wrap gap-2 mt-3">
              {u.roles?.map((role, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs rounded-full font-medium
                    ${role.includes("ADMIN")
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-blue-500/20 text-blue-300"}
                  `}
                >
                  {role}
                </span>
              ))}
            </div>

          </div>
        ))}

      </div>

      {/* Empty */}
      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No users found
        </div>
      )}

    </div>
  );
}