import type { Round } from "./types";

const roundNames = ["one", "two", "three", "four", "five", "six", "seven"];

export const generateRounds = (): Round[] => {
  const rounds: Round[] = [];
  let x = 0;

  for (let i = 0; i < 14; i++) {
    rounds.push({
      index: i,
      name: i < 7 ? roundNames[x] : `${roundNames[x]} trumps`,
      tricks: x + 1,
      bid: 0,
      won: 0,
      complete: false,
    });

    if (i < 6) {
      x++;
    } else if (i === 6) {
      // keep x at 6 for trump rounds
    } else {
      x--;
    }
  }

  return rounds;
};
