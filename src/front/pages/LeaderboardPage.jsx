import React from "react";

/**
 * Simple leaderboard page component.
 * Replace the static data with real data as needed.
 */
export default function LeaderboardPage() {
    const samplePlayers = [
        { id: 1, name: "Alice", score: 1200 },
        { id: 2, name: "Bob", score: 950 },
        { id: 3, name: "Charlie", score: 800 },
    ];

    return (
        <main style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
            <h1>Leaderboard</h1>
            <p>Top players:</p>
            <ol>
                {samplePlayers.map((p) => (
                    <li key={p.id}>
                        <strong>{p.name}</strong> — {p.score} pts
                    </li>
                ))}
            </ol>
        </main>
    );
}