import { useState, useEffect } from "react";

export default function LocalSession() {
  const initDices = [null, null, null, null, null];
  const [initRollState, setInitRollState] = useState(false);
  const [currentDices, setCurrentDices] = useState(initDices);
  const [dicesToRender, setDicesToRender] = useState(currentDices);
  const [pashValue, setPashValue] = useState(0);
  const [pashNumber, setPashNumber] = useState(0);
  const [oneCounter, setOneCounter] = useState(0);
  const [fiveCounter, setFiveCounter] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  let diceCounter = 0;

  const [actualPlayers, setActualPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);

  const playerObject = {
    name: "",
    points: 0,
  };

  const [initGame, setInitGame] = useState(false);

  function calculateDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function rollDices() {
    const newDices = initRollState
      ? currentDices.map(() => calculateDice())
      : initDices.map(() => calculateDice());
    setInitRollState(true);
    setCurrentDices(newDices);
    setDicesToRender(newDices);
    diceCounter = currentDices.length;
    setOneCounter(0);
    setFiveCounter(0);
    setPashValue(0);
    setPashNumber(0);

    const updatedDicesAfterPash = checkPaschAndRemove(newDices);
    setCurrentDices(updatedDicesAfterPash);
    const updatedDicesAfterOneAndFive = checkOneAndFive(updatedDicesAfterPash);
    setCurrentDices(updatedDicesAfterOneAndFive);

    checkGotPoints();
  }

  function checkOneAndFive(dicesToCheck) {
    const counts = { 1: 0, 5: 0 };

    dicesToCheck.forEach((dice) => {
      if (dice === 1) counts[1]++;
      if (dice === 5) counts[5]++;
    });

    setOneCounter((prev) => prev + counts[1]);
    setFiveCounter((prev) => prev + counts[5]);

    return dicesToCheck.filter((dice) => dice !== 1 && dice !== 5);
  }

  function checkPaschAndRemove(dicesToCheck) {
    const counts = {};

    dicesToCheck.forEach((dice) => {
      if (dice) {
        counts[dice] = (counts[dice] || 0) + 1;
      }
    });

    let foundPasch = false;
    let newDices = [...dicesToCheck];

    for (let i = 5; i >= 3; i--) {
      for (const [value, count] of Object.entries(counts)) {
        if (count === i) {
          setPashValue(Number(value));
          setPashNumber(i);
          foundPasch = true;
          newDices = newDices.filter((dice) => dice !== Number(value));
          break;
        }
      }

      if (foundPasch) break;
    }
    return newDices;
  }

  function checkGotPoints() {
    if (diceCounter === currentDices.length) {
      setCurrentPoints(0);
      setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
    }
  }

  // POINT CALCULATION
  useEffect(() => {
    if (oneCounter > 0) {
      setCurrentPoints((prevPoints) => prevPoints + 100 * oneCounter);
    }
    if (fiveCounter > 0) {
      setCurrentPoints((prevPoints) => prevPoints + 50 * fiveCounter);
    }
    if (pashNumber > 0) {
      let newPoints = 0;
      if (pashValue === 1) {
        if (pashNumber === 3) newPoints = 1000;
        else if (pashNumber === 4) newPoints = 10000;
        else if (pashNumber === 5) newPoints = 100000;
      } else {
        if (pashNumber === 3) newPoints = pashValue * 100;
        else if (pashNumber === 4) newPoints = pashValue * 1000;
        else if (pashNumber === 5) newPoints = pashValue * 10000;
      }
      setCurrentPoints((prevPoints) => prevPoints + newPoints);
    }
  }, [pashValue, pashNumber, oneCounter, fiveCounter]);

  //DEBUG
  useEffect(() => {
    console.log("CURRENT PLAYER INDEX", currentPlayerIndex);
  }, [currentDices, currentPoints]);

  function addPlayer(event) {
    event.preventDefault();
    const playerName = event.target.playerName.value;
    const newPlayer = { ...playerObject, name: playerName };
    setActualPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    event.target.reset();

    if (actualPlayers.length === 1) {
      setInitGame(true);
    }
  }

  //INIT GAME
  useEffect(() => {
    setCurrentPlayerIndex(0);
  }, [initGame]);

  //NEXT PLAYER CYCLE
  useEffect(() => {
    if (currentPlayerIndex === actualPlayers.length) {
      setCurrentPlayerIndex(0);
    }
    setCurrentPlayer(actualPlayers[currentPlayerIndex]);
  }, [currentPlayerIndex, actualPlayers]);

  return (
    <>
      <h1>GAME</h1>

      {initGame ? (
        <>
          {<h3>YOUR TURN: {currentPlayer.name}</h3>}
          <h3>CURRENT ROLL</h3>
          {dicesToRender.map((dice, index) => (
            <div key={index}>{dice}</div>
          ))}
          <button onClick={rollDices}>ROLL</button>
          <h3>YOUR POINTS: {currentPoints}</h3>
        </>
      ) : null}
      {actualPlayers.map((player) => (
        <div key={player.name}>
          <h3>{player.name}</h3>
          <p>Points: {player.points}</p>
        </div>
      ))}
      <br />
      <br />
      <h3>Add Player</h3>
      <form onSubmit={addPlayer}>
        <label htmlFor="playerName">Player Name:</label>
        <input type="text" id="playerName" name="playerName" />
        <button type="submit">Add Player</button>
      </form>
    </>
  );
}
