type MenuButtonProps = {
  label: string;
  target?: string;
};

export default function MenuButton({ label, target }: MenuButtonProps) {
  return (
    <a
      href={target ? target : label.toLowerCase()}
      className='border-white border w-64 h-64 flex items-center justify-center rounded-lg cursor-pointer no-underline hover:border-myyellow hover:text-myyellow'
    >
      {label}
    </a>
  );
}
