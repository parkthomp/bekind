import Button from "./Button";
import { useState } from "react";

interface AddPlayerProps {
  addPlayer: (name: string) => void;
}

export default function AddPlayer({ addPlayer }: AddPlayerProps) {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className='flex flex-col gap-2 md:flex-row'>
      <input
        className='text-black font-bold py-2 px-4 rounded'
        type='text'
        placeholder='Name'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addPlayer(inputValue);
            setInputValue("");
          }
        }}
      />
      <Button
        label='add player'
        action={() => {
          addPlayer(inputValue);
          setInputValue("");
        }}
      />
    </div>
  );
}
