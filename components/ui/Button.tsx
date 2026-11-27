import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "red" | "green" | "outline" | "paper" | "ghost";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-[0.95rem] font-bold leading-tight transition-[background-color,color,transform,box-shadow] duration-200 active:translate-y-px";

const variants: Record<Variant, string> = {
  red: "bg-red text-paper shadow-[0_3px_0_var(--color-red-deep)] hover:bg-red-deep",
  green: "bg-bamboo text-paper shadow-[0_3px_0_var(--color-bamboo-deep)] hover:bg-bamboo-deep",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-paper",
  paper: "bg-paper text-red shadow-[0_3px_0_rgba(0,0,0,.25)] hover:bg-white",
  ghost: "text-ink underline decoration-2 underline-offset-4 hover:text-red px-1",
};

export function buttonClass(variant: Variant = "red", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  href,
  variant = "red",
  className = "",
  children,
  external,
  ...rest
}: { href: string; variant?: Variant; className?: string; children: ReactNode; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  const cls = buttonClass(variant, className);
  if (external || href.startsWith("http") || href.startsWith("tel:")) {
    const ext = href.startsWith("http");
    return (
      <a href={href} className={cls} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
        {ext ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
