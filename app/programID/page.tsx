"use client";

import {
  Connection,
  PublicKey,
  type GetVersionedTransactionConfig,
} from "@solana/web3.js";
import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");

  // ✅ Alchemy Mainnet RPC
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/994JG1fO9ACq140ebENCULhYLaFTBrij",
    "finalized"
  );

  async function getter() {
    if (!address) return;

    try {
      const pubkey = new PublicKey(address);

      const signatures = await connection.getSignaturesForAddress(pubkey, {
        limit: 5,
      });

      const config: GetVersionedTransactionConfig = {
        commitment: "finalized",
        maxSupportedTransactionVersion: 0,
      };

      const txs = await Promise.all(
        signatures.map(sig =>
          connection.getTransaction(sig.signature, config)
        )
      );

      console.log(txs);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }

  return (
    <div>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter token id"
      />

      <button onClick={getter}>
        Track Wallet
      </button>
    </div>
  );
}
