import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`border rounded-lg p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
}

export function CardContent({ children }: CardContentProps) {
  return <div>{children}</div>;
}
