import MenuButton from "./components/MenuButton";

export default function Page() {
  return (
    <main className='flex flex-col p-8 gap-8 min-h-screen relative items-center justify-center font-extralight'>
      <div className='relative flex gap-8 text-2xl tracking-widest'>
        <MenuButton label='HOST' />
        <MenuButton label='JOIN' />
      </div>
    </main>
  );
}
