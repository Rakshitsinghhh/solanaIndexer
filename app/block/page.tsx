// getBlock (POST /:apiKey)
"use client"

import { useState } from "react";

export default function Home() {
    const [block,setblock] = useState("");

    async function fetcher() {
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC;

        const response = await fetch(rpcUrl, {
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
                        "transactionDetails": "signatures"
                    }
                ],
                "id": 1
            }),
        });

        const body = await response.json();
        console.log(body);


    }
    return (
        <div>
            <div>
                <input placeholder="enter block hash"
                value={block}
                onChange={(e)=>setblock(e.target.value)}>
                </input>
            </div>
            <div>
                <button onClick={fetcher}>
                    sumbit
                </button>
            </div>
        </div>

    )


}
