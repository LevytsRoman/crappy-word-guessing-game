type FlippingLetterProps = {
  letter: {
    letter: string;
    color?: string;
  };
};

export default function FlippingLetter({ letter }: FlippingLetterProps) {
  return (
    <div className="letter-wrapper">
      <div className="letter-guess front">{letter.letter}</div>
      <div className={`letter-guess back ${letter.color}`}>{letter.letter}</div>
    </div>
  );
}
