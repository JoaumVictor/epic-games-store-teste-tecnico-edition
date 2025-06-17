import { classNames } from "@/utils/shared";

interface ButtonProps {
  label: string;
  onClick: () => void;
  style?: "primary" | "secondary" | "tertiary" | "finally";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  label,
  onClick,
  style = "primary",
  className,
  disabled = false,
}: ButtonProps) {
  const buttonStyle = {
    primary: "bg-black !text-white hover:bg-[#141414]",
    secondary: "text-black bg-gray-200 hover:bg-gray-300",
    tertiary: "bg-[#ececec] hover:bg-[#ffffff] text-black",
    finally: "bg-[#376cd6] hover:bg-[#427bef] !text-white",
  }[style];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        `p-5 rounded-[8px] button disabled:bg-[#535050] disabled:text-[#292727] ${buttonStyle} ${className}`
      )}
    >
      {label}
    </button>
  );
}
