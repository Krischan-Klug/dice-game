import Image from "next/image";

export default function Dice({ number }) {
  return (
    <>
      <Image
        width={60}
        height={60}
        alt={`"${number}"`}
        src={`/dice-six-faces-${number}.png`}
      ></Image>
    </>
  );
}
