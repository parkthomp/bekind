import Button from "../Button";

export default function New({
  setStatus,
}: {
  setStatus: (status: "new" | "setup" | "playing" | "finished") => void;
}) {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-extralight'>Be Kind to Your Neighbor</h1>
      <Button label='New Game' action={() => setStatus("setup")} />
    </div>
  );
}
