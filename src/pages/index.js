import { useRouter } from "next/router";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Dice from "@/components/Dice";

const StyledButton = styled.button`
  border: black 2px solid;
  border-radius: 10px;
  color: black;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 4px 2px;
  width: 150px;
`;

const StyledContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100vw;
  height: 100vh;
`;

const StyledDiceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  margin: 20px;
  width: 100%;
`;

export default function Home() {
  const router = useRouter();

  const [diceValues, setDiceValues] = useState(
    Array(10).fill(getRandomNumber())
  );

  function getRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setDiceValues(diceValues.map(() => getRandomNumber()));
      console.log("refreshed");
    }, 1500);

    return () => clearInterval(interval);
  }, [diceValues]);

  return (
    <StyledContentWrapper>
      <StyledDiceContainer>
        {diceValues.slice(0, 2).map((value, index) => (
          <Dice key={index} number={value} />
        ))}
      </StyledDiceContainer>
      <StyledDiceContainer>
        {diceValues.slice(2, 5).map((value, index) => (
          <Dice key={index} number={value} />
        ))}
      </StyledDiceContainer>

      <h1>10000 (Farkle)</h1>
      <StyledButton onClick={() => router.push("/local")}>LOCAL</StyledButton>
      <br />
      <StyledDiceContainer>
        {diceValues.slice(5, 7).map((value, index) => (
          <Dice key={index} number={value} />
        ))}
      </StyledDiceContainer>
      <StyledDiceContainer>
        {diceValues.slice(7).map((value, index) => (
          <Dice key={index} number={value} />
        ))}
      </StyledDiceContainer>
    </StyledContentWrapper>
  );
}
