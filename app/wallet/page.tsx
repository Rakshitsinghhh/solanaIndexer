"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const rpcUrl1 = process.env.NEXT_PUBLIC_SOLANA_RPC;

  if (rpcUrl1 == null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500 rounded-xl p-8 text-center">
          <p className="text-red-400 text-xl">⚠️ RPC URL not configured</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = useMemo(() => {
    if (transactions.length === 0) return null;

    const confirmedCount = transactions.filter(
      (tx) => tx.confirmationStatus === "finalized"
    ).length;

    const timestamps = transactions
      .filter((tx) => tx.blockTime)
      .map((tx) => tx.blockTime);

    const avgTimeBetweenTx =
      timestamps.length > 1
        ? (Math.max(...timestamps) - Math.min(...timestamps)) /
          (timestamps.length - 1)
        : 0;

    const oldestTx = timestamps.length > 0 ? Math.min(...timestamps) : 0;
    const newestTx = timestamps.length > 0 ? Math.max(...timestamps) : 0;

    return {
      total: transactions.length,
      confirmed: confirmedCount,
      avgTimeBetweenTx: Math.round(avgTimeBetweenTx),
      oldestTx,
      newestTx,
      activitySpan: oldestTx ? Math.round((newestTx - oldestTx) / 3600) : 0, // in hours
    };
  }, [transactions]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (transactions.length === 0) return { timeline: [], statusData: [] };

    // Timeline data - group by hour
    const timelineMap = new Map();
    transactions.forEach((tx) => {
      if (tx.blockTime) {
        const date = new Date(tx.blockTime * 1000);
        const hourKey = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
        if (!timelineMap.has(hourKey)) {
          timelineMap.set(hourKey, { time: hourKey, count: 0, errors: 0 });
        }
        const entry = timelineMap.get(hourKey);
        entry.count += 1;
        if (tx.err) entry.errors += 1;
      }
    });

    const timeline = Array.from(timelineMap.values()).slice(-10);

    // Status distribution
    const finalized = transactions.filter(tx => tx.confirmationStatus === "finalized").length;
    const confirmed = transactions.filter(tx => tx.confirmationStatus === "confirmed").length;
    const processed = transactions.length - finalized - confirmed;

    const statusData = [
      { name: "Finalized", value: finalized, color: "#10B981" },
      { name: "Confirmed", value: confirmed, color: "#F59E0B" },
      { name: "Processed", value: processed, color: "#6366F1" },
    ].filter(item => item.value > 0);

    return { timeline, statusData };
  }, [transactions]);

  async function getter() {
    if (!address) return;
    setLoading(true);

    try {
      const response = await fetch(rpcUrl1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSignaturesForAddress",
          params: [address, { limit: limit }],
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Error:", data.error);
        setTransactions([]);
      } else {
        setTransactions(data.result || []);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-transparent"></div>
      <div className="max-w-7xl mx-auto py-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-cyan-400 hover:text-cyan-300 mb-8 flex items-center gap-2 text-sm font-medium tracking-wider uppercase transition-colors"
          >
            ← Back to Home
          </button>
          <div className="mb-6">
            <h1 className="text-7xl font-black text-white mb-2 tracking-tighter">
              WALLET
            </h1>
            <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
              TRACKER
            </h2>
          </div>
          <p className="text-gray-500 text-lg font-light max-w-2xl">
            Monitor transaction history and analyze wallet activity metrics
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-slate-900 border-2 border-cyan-500/20 rounded-none p-8 mb-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter wallet address..."
                className="flex-1 bg-black border-2 border-gray-800 rounded-none px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
              />
              <button
                onClick={getter}
                disabled={loading || !address}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 text-black disabled:text-gray-600 font-black px-10 py-4 rounded-none transition-all duration-300 uppercase tracking-wider text-sm disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Track"}
              </button>
            </div>
            <div className="flex items-center gap-6">
              <label className="text-gray-400 text-sm uppercase tracking-wider font-medium min-w-fit">Transaction Limit</label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="flex-1 h-1 bg-gray-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
              <span className="text-cyan-400 font-black text-xl min-w-[3rem] text-center">{limit}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-slate-900 to-black border-l-4 border-purple-500 p-6">
              <div className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-medium">Total</div>
              <div className="text-5xl font-black text-white mb-1">{stats.total}</div>
              <div className="text-purple-400 text-sm font-medium">Transactions</div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-black border-l-4 border-green-500 p-6">
              <div className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-medium">Confirmed</div>
              <div className="text-5xl font-black text-white mb-1">{stats.confirmed}</div>
              <div className="text-green-400 text-sm font-medium">Finalized</div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-black border-l-4 border-cyan-500 p-6">
              <div className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-medium">Avg Time</div>
              <div className="text-5xl font-black text-white mb-1">
                {stats.avgTimeBetweenTx}
              </div>
              <div className="text-cyan-400 text-sm font-medium">Seconds</div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-black border-l-4 border-pink-500 p-6">
              <div className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-medium">Activity</div>
              <div className="text-5xl font-black text-white mb-1">
                {stats.activitySpan}
              </div>
              <div className="text-pink-400 text-sm font-medium">Hours</div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {chartData.timeline.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Transaction Timeline */}
            <div className="bg-slate-900 border-2 border-gray-800 p-8">
              <h3 className="text-2xl font-black text-white mb-6 tracking-tight">TRANSACTION TIMELINE</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0' }}
                    labelStyle={{ color: '#E5E7EB' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#06B6D4" strokeWidth={3} name="Transactions" />
                  <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={3} name="Errors" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="bg-slate-900 border-2 border-gray-800 p-8">
              <h3 className="text-2xl font-black text-white mb-6 tracking-tight">STATUS DISTRIBUTION</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
            <p className="text-gray-600 mt-6 uppercase tracking-widest text-sm">Loading...</p>
          </div>
        )}

        {/* Transactions List */}
        {!loading && transactions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight">RECENT TRANSACTIONS</h2>
            {transactions.map((tx: any, index: number) => (
              <div
                key={index}
                className="bg-slate-900 border-l-4 border-cyan-500/30 hover:border-cyan-500 p-8 transition-all duration-300"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Signature</div>
                    <div className="text-cyan-400 font-mono text-sm break-all">
                      {tx.signature}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Block Time</div>
                    <div className="text-white">
                      {tx.blockTime
                        ? new Date(tx.blockTime * 1000).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Slot</div>
                    <div className="text-white font-mono">{tx.slot}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Status</div>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        tx.confirmationStatus === "finalized"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {tx.confirmationStatus}
                    </div>
                  </div>
                </div>
                {tx.err && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <span className="text-red-400 text-sm">⚠️ Error: {JSON.stringify(tx.err)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && transactions.length === 0 && address && (
          <div className="text-center py-20 bg-slate-900 border-2 border-gray-800">
            <p className="text-gray-600 text-lg uppercase tracking-widest">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
