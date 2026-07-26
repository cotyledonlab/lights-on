import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: "primary" | "secondary" | "danger";
};

const intentClasses = {
  danger: "button button-danger",
  primary: "button button-primary",
  secondary: "button button-secondary"
} as const;

export function Button({
  className = "",
  intent = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${intentClasses[intent]} ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}
