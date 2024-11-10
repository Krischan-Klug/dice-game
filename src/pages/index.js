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
  const [diceNumbers, setDiceNumbers] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDiceNumbers(diceNumbers.map(() => Math.floor(Math.random() * 6) + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledContentWrapper>
      <StyledDiceContainer>
        {diceNumbers.slice(2).map((num, index) => (
          <Dice key={index + 2} number={num} />
        ))}
      </StyledDiceContainer>
      <StyledDiceContainer>
        {diceNumbers.slice(0, 2).map((num, index) => (
          <Dice key={index} number={num} />
        ))}
      </StyledDiceContainer>

      <h1>10000 (Farkle)</h1>
      <StyledButton onClick={() => router.push("/local")}>LOCAL</StyledButton>
      <StyledDiceContainer>
        {diceNumbers.slice(0, 2).map((num, index) => (
          <Dice key={index} number={num} />
        ))}
      </StyledDiceContainer>
      <StyledDiceContainer>
        {diceNumbers.slice(2).map((num, index) => (
          <Dice key={index + 2} number={num} />
        ))}
      </StyledDiceContainer>
    </StyledContentWrapper>
  );
}
