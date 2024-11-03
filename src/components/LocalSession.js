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

  function calculateDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function rollDices() {
    const newDices = initRollState
      ? currentDices.map(() => calculateDice())
      : initDices.map(() => calculateDice());

    setOneCounter(0);
    setFiveCounter(0);
    setCurrentDices(newDices);
    setDicesToRender(newDices);
    setInitRollState(true);

    const updatedDicesAfterPash = checkPaschAndRemove(newDices);
    setCurrentDices(updatedDicesAfterPash);

    const updatedDicesAfterOneAndFive = checkOneAndFive(updatedDicesAfterPash);
    setCurrentDices(updatedDicesAfterOneAndFive);
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

    if (!foundPasch) {
      setPashNumber(0);
      setPashValue(0);
    }

    return newDices;
  }

  useEffect(() => {
    console.log("CURRENT DICES", currentDices);
    console.log("PASH", pashValue, pashNumber);
    console.log("Anzahl der 1er:", oneCounter);
    console.log("Anzahl der 5er:", fiveCounter);
  }, [currentDices, pashValue, pashNumber, oneCounter, fiveCounter]);

  return (
    <>
      <h1>GAME</h1>
      <h3>CURRENT ROLL</h3>
      {dicesToRender.map((dice, index) => (
        <div key={index}>{dice}</div>
      ))}
      <button onClick={rollDices}>ROLL</button>
    </>
  );
}
