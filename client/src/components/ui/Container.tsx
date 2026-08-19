import { HTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Container({ children, className = "", ...rest }: Props) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] px-6 md:px-10 xl:px-16 ${className}`} {...rest}>
      {children}
    </div>
  );
}
