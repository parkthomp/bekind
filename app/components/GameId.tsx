type GameIdProps = {
  gameId: string;
};

export default function GameId({ gameId }: GameIdProps) {
  return (
    <div className="absolute top-8 right-8 font-extralight uppercase flex flex-col items-end gap-1">
      <h2 className="text-sm">Game ID</h2>
      <h2 className="text-2xl">{gameId}</h2>
    </div>
  );
}
