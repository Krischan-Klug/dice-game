// pages/api/game.js
let gameState = {
  players: {},
  currentPlayer: null,
  lastRoll: null,
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const { playerId } = req.body;

    // Spieler registrieren
    if (!gameState.players[playerId]) {
      gameState.players[playerId] = 0;
    }

    if (!gameState.currentPlayer) {
      gameState.currentPlayer = playerId;
    }

    res.status(200).json({ gameState });
  }

  if (req.method === "PUT") {
    const { playerId } = req.body;

    // Prüfen, ob der aktuelle Spieler am Zug ist
    if (gameState.currentPlayer === playerId) {
      const roll = Math.floor(Math.random() * 6) + 1; // 1-6 würfeln
      gameState.players[playerId] += roll;
      gameState.lastRoll = roll;

      // Nächsten Spieler setzen
      const players = Object.keys(gameState.players);
      const nextPlayerIndex = (players.indexOf(playerId) + 1) % players.length;
      gameState.currentPlayer = players[nextPlayerIndex];

      res.status(200).json({ gameState });
    } else {
      res.status(403).json({ message: "Not your turn" });
    }
  }

  if (req.method === "GET") {
    res.status(200).json({ gameState });
  }
}
