import type { GameState } from "../lib/types";
import AddPlayer from "./AddPlayer";
import Button from "./Button";
import Round from "./Round";
import ScoreCard from "./ScoreCard";
import { getScore } from "../utils";

interface GameViewProps {
  state: GameState;
  readOnly?: boolean;
  onAddPlayer?: (name: string) => void;
  onRemovePlayer?: (index: number) => void;
  onStartGame?: () => void;
  onSetBid?: (playerIndex: number, bid: number) => void;
  onSetWon?: (playerIndex: number, won: number) => void;
  onToggleRoundComplete?: (roundIndex: number) => void;
  onSetCurrentRound?: (roundIndex: number) => void;
  onResetRequest?: () => void;
}

export default function GameView({
  state,
  readOnly = false,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
  onSetBid,
  onSetWon,
  onToggleRoundComplete,
  onSetCurrentRound,
  onResetRequest,
}: GameViewProps) {
  const { rounds, players, currentRound, gameStarted } = state;

  return (
    <>
      {!gameStarted && !readOnly && (
        <div className='flex flex-col items-start gap-6 border border-white rounded-lg p-6'>
          <h2 className='text-2xl font-bold'>Add Players</h2>
          {players.length < 53 ? (
            <AddPlayer addPlayer={onAddPlayer ?? (() => undefined)} />
          ) : (
            <span>Max amount of players reached</span>
          )}
          <div className='flex flex-row gap-2 flex-wrap'>
            {players.map((player, index) => (
              <div key={index} className='flex flex-col'>
                <h3 className='text-1xl font-bold'>{player.name.toUpperCase()}</h3>
                <Button
                  label='remove'
                  action={() => onRemovePlayer?.(index)}
                  small
                  color='red'
                />
              </div>
            ))}
          </div>
          {players.length > 1 && (
            <Button label='start game' action={onStartGame} color='green' />
          )}
        </div>
      )}

      {gameStarted && (
        <div className='flex flex-col items-start gap-6 border border-white rounded-lg p-6'>
          <h2 className='text-2xl font-bold'>Players</h2>
          <div className='flex flex-row gap-6 flex-wrap'>
            {players
              .slice()
              .sort((a, b) => getScore(rounds, b) - getScore(rounds, a))
              .map((player, index) => (
                <div key={index} className='flex flex-col'>
                  <h3 className='text-1xl font-bold'>
                    {player.name.toUpperCase()}
                  </h3>
                  <h4 className='text-xl'>{getScore(rounds, player)}</h4>
                </div>
              ))}
          </div>
        </div>
      )}

      {gameStarted && (
        <div className='flex flex-col items-start gap-6 border border-white rounded-lg p-6'>
          <h2 className='text-2xl font-bold'>Rounds</h2>
          <div className='flex gap-2 flex-wrap'>
            {rounds.map((round, index) => (
              <Button
                key={index}
                label={round.name}
                action={() => onSetCurrentRound?.(index)}
                disabled={readOnly}
                color={
                  round.index === currentRound
                    ? "blue"
                    : round.complete
                    ? "green"
                    : "gray"
                }
              />
            ))}
          </div>
          <Round
            round={rounds[currentRound]}
            roundIndex={currentRound}
            players={players}
            readOnly={readOnly}
            setBid={onSetBid ?? (() => undefined)}
            setWon={onSetWon ?? (() => undefined)}
            toggleRoundComplete={onToggleRoundComplete ?? (() => undefined)}
          />
        </div>
      )}

      {gameStarted && (
        <div className='flex flex-col items-start gap-6 border border-white rounded-lg p-6'>
          <h2 className='text-2xl font-bold'>Scorecard</h2>
          <div className='max-w-full overflow-auto'>
            <ScoreCard rounds={rounds} players={players} />
          </div>
        </div>
      )}

      {gameStarted && !readOnly && (
        <div className='flex flex-col items-start max-w-xs mt-auto'>
          <Button label='reset game' action={onResetRequest} color='red' />
        </div>
      )}
    </>
  );
}
