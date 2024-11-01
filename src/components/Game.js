// pages/game/[slug].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function GameRoom() {
  const router = useRouter();
  const { slug } = router.query;
  const [playerName, setPlayerName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState([]);
  const [diceResult, setDiceResult] = useState(null);

  useEffect(() => {
    if (!slug) return;

    // Socket-Initialisierung
    socket = io();

    // Verbindung zum Raum
    socket.emit("joinRoom", slug);

    socket.on("playerJoined", ({ playerId }) => {
      setPlayers((prev) => [...prev, playerId]);
    });

    socket.on("diceRolled", ({ playerId, diceResult }) => {
      setDiceResult({ playerId, result: diceResult });
    });

    setIsConnected(true);

    return () => {
      socket.disconnect();
    };
  }, [slug]);

  const handleRollDice = () => {
    socket.emit("rollDice", slug);
  };

  return (
    <div>
      <h1>Raum: {slug}</h1>
      <input
        type="text"
        placeholder="Dein Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      {isConnected && (
        <>
          <button onClick={handleRollDice}>Würfeln</button>
          {diceResult && (
            <p>
              Spieler {diceResult.playerId} hat eine {diceResult.result}{" "}
              geworfen!
            </p>
          )}
          <h2>Spieler im Raum:</h2>
          <ul>
            {players.map((player) => (
              <li key={player}>{player}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
