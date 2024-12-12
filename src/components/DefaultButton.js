import styled from "styled-components";

const StyledButton = styled.button`
  border: black 2px solid;
  border-radius: 10px;
  color: black;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 18px;
  margin: 4px 2px;
  width: 150px;
`;

export default function DefaultButton({ text, onClick }) {
  return (
    <>
      <StyledButton onClick={onClick}>{text}</StyledButton>
    </>
  );
}
