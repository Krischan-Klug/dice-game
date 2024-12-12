import { useState, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import Dice from "./Dice";
import styled from "styled-components";
import DefaultButton from "./DefaultButton";

//STYLING

const StyledWaitingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const StyledPlayerMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: white;
  border: 2px solid #000000;
  border-radius: 10px;
  padding: 20px;
  width: 70vw;
  height: 30vh;
`;

const StyledLostPopup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: white;
  border: 2px solid #000000;
  border-radius: 10px;
  padding: 20px;
  width: 70vw;
  height: 30vh;
`;

const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 9;
`;

const StyledPlayerForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  width: 150px;
  border: black 2px solid;
  border-radius: 10px;
`;

const StyledFooter = styled.footer`
  position: fixed;
  background-color: white;
  bottom: 0;
  width: 100%;
  height: 7vh;
  text-align: center;
  padding: 10px;
  border-top: 2px solid black;
  margin: 0;
  padding: 0;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const StyledHeader = styled.header`
  position: sticky;
  background-color: white;
  top: 0;
  width: 100%;
  height: 7vh;
  text-align: center;
  padding: 10px;
  border-bottom: 2px solid black;
  margin: 0;
  padding: 0;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const StyledDiceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  margin: 20px;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 20px;
`;

const StyledPointsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
`;

const StyledLeaderboardContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledLeaderboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 20px;
  border: 2px solid black;
  border-radius: 10px;
  padding: 10px;
  height: 20vh;
  width: 80vw;
  overflow-y: auto;
`;

const StyledPlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin: 5px;
  border: 2px solid black;
  border-radius: 10px;
  padding: 10px;
  width: 80%;
  height: 5vh;
`;

const StyledLeaderboardH3 = styled.h3`
  margin-bottom: 0;
`;

export default function LocalSession() {
  const initDices = [null, null, null, null, null];
  const [pashValue, setPashValue] = useState(0);
  const [pashNumber, setPashNumber] = useState(0);
  const [oneCounter, setOneCounter] = useState(0);
  const [fiveCounter, setFiveCounter] = useState(0);

  //SAVED
  const [currentPoints, setCurrentPoints] = useLocalStorage("currentPoints", 0);
  const [actualPlayers, setActualPlayers] = useLocalStorage(
    "actualPlayers",
    []
  );
  const [currentPlayer, setCurrentPlayer] = useLocalStorage(
    "currentPlayer",
    {}
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useLocalStorage(
    "cuurentPlayerIndex",
    null
  );
  const playerObject = {
    name: "",
    points: 0,
  };
  const [initGame, setInitGame] = useLocalStorage("initGame", false);
  const [initRollState, setInitRollState] = useLocalStorage(
    "initRollState",
    false
  );
  const [currentDices, setCurrentDices] = useLocalStorage(
    "currentDices",
    initDices
  );
  const [dicesToRender, setDicesToRender] = useLocalStorage(
    "DicesToRender",
    currentDices
  );
  const [diceCounter, setDiceCounter] = useLocalStorage("diceCounter", 0);

  //MENU
  const [isAddPlayerMenuOpen, setIsAddPlayerMenuOpen] = useState(false);
  const [isLostPopupOpen, setIsLostPopupOpen] = useState(false);

  //FUNCTIONS
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
  function toggleAddPlayerMenu() {
    setIsAddPlayerMenuOpen(!isAddPlayerMenuOpen);
  }

  function toggleLostPopup() {
    setIsLostPopupOpen(!isLostPopupOpen);
  }

  function calculateDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function rollDices() {
    const newDices = initRollState
      ? currentDices.map(() => calculateDice())
      : initDices.map(() => calculateDice());
    setDiceCounter(currentDices.length);
    setInitRollState(true);
    setCurrentDices(newDices);
    setDicesToRender(newDices);

    setOneCounter(0);
    setFiveCounter(0);
    setPashValue(0);
    setPashNumber(0);

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
    return newDices;
  }

  function takePointsAndPassTurn() {
    const updatedPlayers = actualPlayers.map((player) => {
      if (player.name === currentPlayer.name) {
        return { ...player, points: player.points + currentPoints };
      }
      return player;
    });
    setActualPlayers(updatedPlayers);
    setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
    setInitRollState(false);
    setDiceCounter(0);
    setCurrentPoints(0);
    setCurrentDices(initDices);
  }

  function resetGame() {
    setCurrentPoints(0);
    setCurrentPlayerIndex(null);
    setCurrentPlayer({});
    setActualPlayers([]);
    setInitRollState(false);
    setOneCounter(0);
    setFiveCounter(0);
    setPashValue(0);
    setPashNumber(0);
    setDiceCounter(0);
    setInitGame(false);
    setDicesToRender(initDices);
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

  //INIT GAME
  useEffect(() => {
    if (!initGame) {
      setCurrentPlayerIndex(0);
    }
  }, [initGame]);

  //NEXT PLAYER CYCLE
  useEffect(() => {
    if (currentPlayerIndex === actualPlayers.length) {
      setCurrentPlayerIndex(0);
    }
    setCurrentPlayer(actualPlayers[currentPlayerIndex]);
  }, [currentPlayerIndex, actualPlayers]);

  //CHECK GOT POINTS AND HANDLE ROUND
  useEffect(() => {
    if (diceCounter === 0) {
      setInitRollState(false);
      setCurrentDices(initDices);
    }

    if (
      diceCounter === currentDices.length &&
      currentDices.length > 0 &&
      currentDices[0] !== null
    ) {
      setInitRollState(false);
      setCurrentDices(initDices);
      setDiceCounter(0);
      setCurrentPoints(0);
      setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
      toggleLostPopup();
    }
  }, [dicesToRender]);

  return (
    <>
      {!initGame ? (
        <StyledWaitingWrapper>
          <h3>WAITING FOR PLAYERS...</h3>
        </StyledWaitingWrapper>
      ) : null}
      {initGame ? (
        <>
          <StyledHeader>
            {currentPlayer && <h3>YOUR TURN: {currentPlayer.name}</h3>}
          </StyledHeader>
          <StyledDiceContainer>
            {dicesToRender.map((dice, index) => (
              <Dice key={index} number={dice} />
            ))}
          </StyledDiceContainer>
          <StyledPointsContainer>
            <h3>YOUR POINTS: {currentPoints}</h3>
          </StyledPointsContainer>

          <StyledButtonContainer>
            <DefaultButton text="ROLL" onClick={rollDices} />
            <DefaultButton text="PASS" onClick={takePointsAndPassTurn} />
          </StyledButtonContainer>
          <StyledLeaderboardContainerWrapper>
            <StyledLeaderboardH3>LEADERBOARD</StyledLeaderboardH3>
            <StyledLeaderboardContainer>
              {actualPlayers.map((player) => (
                <StyledPlayerContainer key={player.name}>
                  <h3>
                    {player.name}: {player.points}
                  </h3>
                </StyledPlayerContainer>
              ))}
            </StyledLeaderboardContainer>
          </StyledLeaderboardContainerWrapper>
        </>
      ) : null}

      {/*PLAYER MENU*/}
      {isAddPlayerMenuOpen && (
        <>
          <StyledBackdrop onClick={toggleAddPlayerMenu} />
          <StyledPlayerMenu>
            <h3>Name</h3>
            <StyledPlayerForm onSubmit={addPlayer}>
              <StyledInput type="text" id="playerName" name="playerName" />
              <br />
              <DefaultButton text="ADD PLAYER" type="submit" />
            </StyledPlayerForm>
          </StyledPlayerMenu>
        </>
      )}

      {/*LOST POPUP*/}
      {isLostPopupOpen && (
        <>
          <StyledBackdrop onClick={toggleLostPopup} />
          <StyledLostPopup onClick={toggleLostPopup}>
            <h3>YOU LOST</h3>
          </StyledLostPopup>
        </>
      )}

      <StyledFooter>
        <DefaultButton text="RESET" onClick={resetGame} />
        <DefaultButton text="PLAYER" onClick={toggleAddPlayerMenu} />
      </StyledFooter>
    </>
  );
}
