interface ButtonProps {
  label: string;
  action?: () => void;
  clicked?: boolean;
  small?: boolean;
  disabled?: boolean;
  color?: string;
}

export default function Button({
  label,
  action,
  small = false,
  disabled = false,
  color = "blue",
}: ButtonProps) {
  let classes = "text-white font-bold rounded cursor-pointer";
  switch (color) {
    case "red":
      classes += " bg-red-500 hover:bg-red-700";
      break;
    case "green":
      classes += " bg-green-600 hover:bg-green-800";
      break;
    case "blue":
      classes += " bg-blue-500 hover:bg-blue-700";
      break;
    case "yellow":
      classes += " bg-yellow-500 hover:bg-yellow-700";
      break;
    case "purple":
      classes += " bg-purple-500 hover:bg-purple-700";
      break;
    case "pink":
      classes += " bg-pink-500 hover:bg-pink-700";
      break;
    case "indigo":
      classes += " bg-indigo-500 hover:bg-indigo-700";
      break;
    case "gray":
      classes += " bg-gray-500 hover:bg-gray-700";
      break;
    case "black":
      classes += " bg-black hover:bg-gray-900";
      break;
    default:
      classes += " bg-blue-500 hover:bg-blue-700";
      break;
  }
  small ? (classes += " py-4 px-8 md:py-1 md:px-3") : (classes += " py-2 px-4");
  return (
    <button onClick={action && action} className={classes} disabled={disabled}>
      {label}
    </button>
  );
}
