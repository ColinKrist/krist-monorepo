import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "font-display inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white hover:bg-white hover:text-black border-4 border-black shadow-[4px_4px_0_0_#000]",
        destructive:
          "bg-red-600 text-white hover:bg-white hover:text-red-600 border-4 border-red-600 shadow-[4px_4px_0_0_#dc2626]",
        outline:
          "bg-white text-black hover:bg-black hover:text-white border-4 border-black shadow-[4px_4px_0_0_#000]",
        secondary:
          "bg-gray-200 text-black hover:bg-black hover:text-gray-200 border-4 border-black shadow-[4px_4px_0_0_#000]",
        ghost:
          "hover:bg-black hover:text-white border-4 border-transparent hover:border-black",
        link: "text-black underline-offset-4 hover:underline decoration-4",
        neon: "bg-black text-[#39FF14] border-4 border-[#39FF14] shadow-[0_0_10px_#39FF14] hover:bg-[#39FF14] hover:text-black hover:shadow-[0_0_20px_#39FF14]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2",
        lg: "h-14 px-8 py-4",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
