// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("Neuer Client verbunden", socket.id);

    // Raum-Logik
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`Spieler hat Raum ${room} betreten`);

      // Benachrichtige alle Spieler im Raum
      io.to(room).emit("playerJoined", { playerId: socket.id });
    });

    // Würfel werfen
    socket.on("rollDice", (room) => {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      io.to(room).emit("diceRolled", { playerId: socket.id, diceResult });
    });

    socket.on("disconnect", () => {
      console.log("Client getrennt", socket.id);
    });
  });

  res.end();
}
