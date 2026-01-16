"use client";

import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Alchemy RPC URL with your API key
//   const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/994JG1fO9ACq140ebENCULhYLaFTBrij";
    const rpcUrl1 = process.env.NEXT_PUBLIC_SOLANA_RPC;
    console.log(rpcUrl1);
    console.log("ok");

  if(rpcUrl1==null){
    return(
        <div>
            return;
        </div>
    )
  }
    
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
          params: [address, { limit: 5 }], 
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
    <div style={{ padding: "2rem" }}>
      <h1>Solana Wallet Tracker</h1>

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter wallet address"
        style={{ padding: "0.5rem", width: "300px" }}
      />

      <button
        onClick={getter}
        style={{ padding: "0.5rem 1rem", marginLeft: "1rem" }}
      >
        Track Wallet
      </button>

      {loading && <p>Loading...</p>}

      <ul>
        {transactions.map((tx: any, index: number) => (
          <li key={index}>
            <p>Signature: {tx.signature}</p>
            <p>Slot: {tx.slot}</p>
            <p>Block Time: {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "N/A"}</p>
            <p>Confirmation: {tx.confirmationStatus}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
