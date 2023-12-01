import {
  getBids,
  getGoodRounds,
  getBadRounds,
  getScore,
  getBidAccuracy,
} from "../utils";

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

interface ScoreCardProps {
  rounds: Round[];
  players: Player[];
}

export default function ScoreCard({ rounds, players }: ScoreCardProps) {
  return (
    <table>
      <tr className='border border-b-white'>
        <th className='py-2 px-4 border border-r-white'>Player</th>
        <th className='py-2 px-4 border border-r-white'>Bids</th>
        <th className='py-2 px-4 border border-r-white'>Good Rounds</th>
        <th className='py-2 px-4 border border-r-white'>Bad Rounds</th>
        <th className='py-2 px-4 border border-r-white'>Bid Accuracy</th>
        <th className='py-2 px-4'>Score</th>
      </tr>
      {players.map((player, index) => (
        <tr key={index} className='border border-b-white'>
          <td className='py-2 px-4 border border-r-white'>{player.name}</td>
          <td className='py-2 px-4 border border-r-white'>
            {getBids(rounds, player)}
          </td>
          <td className='py-2 px-4 border border-r-white'>
            {getGoodRounds(rounds, player)}
          </td>
          <td className='py-2 px-4 border border-r-white'>
            {getBadRounds(rounds, player)}
          </td>
          <td className='py-2 px-4 border border-r-white'>
            {getBidAccuracy(rounds, player)}
          </td>
          <td className='py-2 px-4'>{getScore(rounds, player)}</td>
        </tr>
      ))}
    </table>
  );
}
