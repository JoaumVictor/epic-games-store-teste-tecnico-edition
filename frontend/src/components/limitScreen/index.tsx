import { classNames } from "@/utils/shared";

interface LimitScreenProps {
  children: React.ReactNode;
  className?: string;
}

export default function LimitScreen({ children, className }: LimitScreenProps) {
  return (
    <div className={classNames("max-w-screen-2xl mx-auto", className)}>
      {children}
    </div>
  );
}
