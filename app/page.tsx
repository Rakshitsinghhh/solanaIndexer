"use client"

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            SOLANA
          </h1>
          <h2 className="text-6xl font-black text-white/90 mb-6 tracking-tight">
            INDEXER
          </h2>
          <p className="text-gray-400 text-xl font-light max-w-2xl mx-auto">
            Professional blockchain analytics for Solana network
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Wallet Card */}
          <div 
            onClick={() => window.location.href = '/wallet'}
            className="group cursor-pointer bg-gradient-to-br from-slate-900 to-black border-t-2 border-cyan-500/40 p-10 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6">💳</div>
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">WALLET</h2>
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Tracker</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Monitor wallet transactions and activity metrics
              </p>
            </div>
          </div>

          {/* Program ID Card */}
          <div 
            onClick={() => window.location.href = '/programID'}
            className="group cursor-pointer bg-gradient-to-br from-slate-900 to-black border-t-2 border-purple-500/40 p-10 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6">🔷</div>
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">PROGRAM</h2>
              <h3 className="text-xl font-bold text-purple-400 mb-4">ID Tracker</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Track smart contract interactions and signatures
              </p>
            </div>
          </div>

          {/* Block Card */}
          <div 
            onClick={() => window.location.href = '/block'}
            className="group cursor-pointer bg-gradient-to-br from-slate-900 to-black border-t-2 border-pink-500/40 p-10 hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6">⛓️</div>
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">BLOCK</h2>
              <h3 className="text-xl font-bold text-pink-400 mb-4">Explorer</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Explore block data and transaction details
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block border-t border-gray-800 pt-6">
            <p className="text-gray-600 text-sm font-light tracking-widest uppercase">
              Powered by <span className="text-purple-400 font-bold">Solana RPC</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}