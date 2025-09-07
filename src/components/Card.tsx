import { ReactNode } from "react";
import { cn } from "../utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({ children, className, title, description }: CardProps) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow", className)}>
      {(title || description) && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}