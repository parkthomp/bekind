interface Round {
  index: number;
  name: string;
  tricks: number;
  bid: number;
  won: number;
  complete: boolean;
}

interface Player {
  name: string;
  rounds: Round[];
}

export const getScore = (rounds: Round[], player: Player) => {
  const calcScore = (bid: number, won: number) => {
    if (bid === won) {
      return 10 + bid;
    } else {
      return won;
    }
  };

  return player.rounds.reduce((score, round) => {
    if (rounds[round.index].complete) {
      return score + calcScore(round.bid, round.won);
    } else {
      return score;
    }
  }, 0);
};

export const getBids = (rounds: Round[], player: Player) => {
  return player.rounds.reduce((acc, round) => {
    if (rounds[round.index].complete) {
      return acc + round.bid;
    } else {
      return acc;
    }
  }, 0);
};

export const getGoodRounds = (rounds: Round[], player: Player) => {
  return player.rounds.reduce((acc, round) => {
    if (round.bid === round.won && rounds[round.index].complete) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
};

export const getBadRounds = (rounds: Round[], player: Player) => {
  return player.rounds.reduce((acc, round) => {
    if (round.bid !== round.won && rounds[round.index].complete) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
};

export const getBidAccuracy = (rounds: Round[], player: Player) => {
  const totalRounds = player.rounds.filter(
    (round) => rounds[round.index].complete
  ).length;

  return totalRounds > 0
    ? ((getGoodRounds(rounds, player) / totalRounds) * 100).toFixed(0) + "%"
    : "0%";
};
