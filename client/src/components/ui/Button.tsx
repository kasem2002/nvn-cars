import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Variant = "primary" | "outline" | "ghost";

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    as?: "button";
  }
>;

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap px-8 py-4 text-xs font-semibold uppercase tracking-widest2 transition-all duration-500 ease-luxury focus-visible:outline-nvn-red disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-nvn-red text-white hover:bg-white hover:text-nvn-black",
  outline: "border border-nvn-line text-nvn-white hover:border-nvn-red hover:text-nvn-red",
  ghost: "text-nvn-white hover:text-nvn-red",
};

export function Button({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
