"use client"

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Home() {
    const [block, setBlock] = useState("");
    const [blockData, setBlockData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Calculate block statistics
    const blockStats = useMemo(() => {
        if (!blockData?.transactions) return null;

        const successCount = blockData.transactions.filter((tx: any) => !tx.meta?.err).length;
        const failureCount = blockData.transactions.filter((tx: any) => tx.meta?.err).length;

        return {
            success: successCount,
            failure: failureCount,
            successRate: ((successCount / blockData.transactions.length) * 100).toFixed(1),
        };
    }, [blockData]);

    async function fetcher() {
        if (!block) return;
        
        setLoading(true);
        setError("");
        setBlockData(null);
        
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC;

        try {
            const response = await fetch(rpcUrl!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "getBlock",
                    "params": [
                        Number(block),
                        {
                            "encoding": "json",
                            "transactionDetails": "full",
                            "maxSupportedTransactionVersion": 0
                        }
                    ],
                    "id": 1
                }),
            });

            const body = await response.json();
            
            if (body.error) {
                setError(body.error.message || "Failed to fetch block");
            } else {
                setBlockData(body.result);
            }
        } catch (err) {
            setError("Network error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 via-transparent to-transparent"></div>
            <div className="max-w-7xl mx-auto py-8 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="text-pink-400 hover:text-pink-300 mb-8 flex items-center gap-2 text-sm font-medium tracking-wider uppercase transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <div className="mb-6">
                        <h1 className="text-7xl font-black text-white mb-2 tracking-tighter">
                            BLOCK
                        </h1>
                        <h2 className="text-5xl font-black bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
                            EXPLORER
                        </h2>
                    </div>
                    <p className="text-gray-500 text-lg font-light max-w-2xl">
                        Explore block data and detailed transaction information
                    </p>
                </div>

                {/* Search Section */}
                <div className="bg-slate-900 border-2 border-pink-500/20 rounded-none p-8 mb-12">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            placeholder="Enter block number..."
                            value={block}
                            onChange={(e) => setBlock(e.target.value)}
                            type="number"
                            className="flex-1 bg-black border-2 border-gray-800 rounded-none px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors text-sm font-mono"
                        />
                        <button
                            onClick={fetcher}
                            disabled={loading || !block}
                            className="bg-pink-500 hover:bg-pink-400 disabled:bg-gray-800 text-black disabled:text-gray-600 font-black px-10 py-4 rounded-none transition-all duration-300 uppercase tracking-wider text-sm disabled:cursor-not-allowed"
                        >
                            {loading ? "Loading..." : "Explore"}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
                        <p className="text-gray-600 mt-6 uppercase tracking-widest text-sm">Loading...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border-2 border-red-500/30 p-8 text-center">
                        <p className="text-red-400 uppercase tracking-wider font-medium">⚠️ {error}</p>
                    </div>
                )}

                {/* Block Data */}
                {blockData && !loading && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-slate-900 to-black border-l-4 border-pink-500 p-6">
                                <div className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-medium">Block Height</div>
                                <div className="text-4xl font-black text-white">{blockData.blockHeight || "N/A"}</div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-900 to-black border-l-4 border-purple-500 p-6">
                                <div className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-medium">Transactions</div>
                                <div className="text-4xl font-black text-white">
                                    {blockData.transactions?.length || 0}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-900 to-black border-l-4 border-cyan-500 p-6">
                                <div className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-medium">Block Time</div>
                                <div className="text-2xl font-black text-white">
                                    {blockData.blockTime 
                                        ? new Date(blockData.blockTime * 1000).toLocaleTimeString()
                                        : "N/A"}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-900 to-black border-l-4 border-orange-500 p-6">
                                <div className="text-gray-500 text-xs mb-2 uppercase tracking-widest font-medium">Parent Slot</div>
                                <div className="text-3xl font-black text-white">
                                    {blockData.parentSlot || "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* Block Details */}
                        <div className="bg-slate-900 border-2 border-gray-800 p-8">
                            <h2 className="text-3xl font-black text-white mb-6 tracking-tight">BLOCK DETAILS</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start border-b border-gray-800 pb-4">
                                    <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Blockhash</span>
                                    <span className="text-pink-400 font-mono text-sm text-right max-w-md break-all">{blockData.blockhash}</span>
                                </div>
                                <div className="flex justify-between items-start border-b border-gray-800 pb-4">
                                    <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Previous Blockhash</span>
                                    <span className="text-pink-400 font-mono text-sm text-right max-w-md break-all">{blockData.previousBlockhash}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                    <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Block Date</span>
                                    <span className="text-white font-medium">
                                        {blockData.blockTime 
                                            ? new Date(blockData.blockTime * 1000).toLocaleString()
                                            : "N/A"}
                                    </span>
                                </div>
                                {blockData.rewards && blockData.rewards.length > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Total Rewards</span>
                                        <span className="text-green-400 font-black text-lg">
                                            {blockData.rewards.reduce((sum: number, r: any) => sum + (r.lamports || 0), 0) / 1e9} SOL
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Transaction Analytics Chart */}
                        {blockStats && blockData.transactions.length > 0 && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-900 border-2 border-gray-800 p-8">
                                    <h3 className="text-2xl font-black text-white mb-6 tracking-tight">TRANSACTION STATUS</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: "Success", value: blockStats.success, color: "#10B981" },
                                                    { name: "Failed", value: blockStats.failure, color: "#EF4444" }
                                                ].filter(item => item.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                <Cell fill="#10B981" />
                                                <Cell fill="#EF4444" />
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-slate-900 border-2 border-gray-800 p-8">
                                    <h3 className="text-2xl font-black text-white mb-6 tracking-tight">SUCCESS RATE</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={[
                                            { status: "Success", count: blockStats.success },
                                            { status: "Failed", count: blockStats.failure }
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="status" stroke="#9CA3AF" fontSize={12} />
                                            <YAxis stroke="#9CA3AF" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0' }}
                                            />
                                            <Bar dataKey="count" fill="#EC4899" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="mt-6 text-center">
                                        <div className="text-gray-500 text-sm uppercase tracking-widest mb-2">Overall Success Rate</div>
                                        <div className="text-5xl font-black text-green-400">{blockStats.successRate}%</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transactions List */}
                        {blockData.transactions && blockData.transactions.length > 0 && (
                            <div className="bg-slate-900 border-2 border-gray-800 p-8">
                                <h2 className="text-3xl font-black text-white mb-6 tracking-tight">
                                    TRANSACTIONS ({blockData.transactions.length})
                                </h2>
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {blockData.transactions.slice(0, 10).map((tx: any, index: number) => (
                                        <div
                                            key={index}
                                            className="bg-black border-l-4 border-pink-500/30 hover:border-pink-500 p-6 transition-colors"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Transaction #{index + 1}</span>
                                                <span className={`px-4 py-1 text-xs font-black uppercase tracking-wider ${
                                                    tx.meta?.err ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                                                }`}>
                                                    {tx.meta?.err ? "Failed" : "Success"}
                                                </span>
                                            </div>
                                            <div className="mt-3 text-pink-400 font-mono text-xs break-all">
                                                {tx.transaction?.signatures?.[0] || "No signature"}
                                            </div>
                                        </div>
                                    ))}
                                    {blockData.transactions.length > 10 && (
                                        <p className="text-center text-gray-500 text-sm">
                                            ... and {blockData.transactions.length - 10} more transactions
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!blockData && !loading && !error && (
                    <div className="text-center py-20 bg-slate-900 border-2 border-gray-800">
                        <p className="text-gray-600 text-lg uppercase tracking-widest">Enter a block number to explore</p>
                    </div>
                )}
            </div>
        </div>
    );
}
