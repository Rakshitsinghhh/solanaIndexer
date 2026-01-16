"use client"

export default function Home() {


    return (
        <div>
            <div>
                <input placeholder="enter block address">
                </input>

            </div>
            <div>
                <button onClick={
                    ()=>{console.log("tracking ....")}
                }>
                    track
                </button>
            </div>
        </div>
    );
}