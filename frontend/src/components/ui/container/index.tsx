import { classNames } from "@/utils/shared";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={classNames("max-w-screen-2xl mx-auto", className)}>
      {children}
    </div>
  );
}
