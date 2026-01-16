"use client"
import axios from 'axios';

export default function Home() {


  return (
    <div>
      <div>
        <button onClick={() => window.location.href = '/wallet'}>
          wallet
        </button>
      </div>

      <div>
        <button onClick={() => window.location.href = '/programID'}>
          program ID
        </button>
      </div>

      <div>
        <button onClick={() => window.location.href = '/block'}>
          block
        </button>

      </div>
    </div>
  );
}