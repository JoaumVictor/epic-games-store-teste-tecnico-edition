import { classNames } from "@/utils/shared";
import InputMask from "react-input-mask";

interface InputProps {
  id: string;
  label: string;
  name: string;
  mask: string;
  placeholder?: string;
  value: string;
  formik: any;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched: boolean | undefined;
  error?: string;
  className?: string;
}

export default function Input({
  id,
  mask,
  label,
  name,
  placeholder,
  formik,
  onBlur,
  touched,
  value,
  error,
  className,
}: InputProps) {
  const formatMask = (value: string, mask: string) => {
    return value.replace(new RegExp(`[${mask.replace(/9/g, "*")}]`, "g"), "");
  };

  return (
    <div className={classNames(className, "relative mb-3")}>
      <label className="text-black text-[14px]">{label}</label>
      <InputMask
        mask={mask.replace(/9/g, "*") || ""}
        maskPlaceholder=""
        value={value}
        onBlur={onBlur}
        onChange={(e) => {
          formik.setFieldValue(name, formatMask(e.target.value, mask));
        }}
        id={id}
        placeholder={placeholder}
        name={name}
        className={classNames(
          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          error && touched && "border-red-500 focus:ring-red-500"
        )}
      />
      {error && touched && (
        <span className="text-red-500 text-[14px]">{error}</span>
      )}
    </div>
  );
}
