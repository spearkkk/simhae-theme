"use client";

import type { CSSProperties } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ColorSwatchProps = {
  hex: string;
  role: string;
  copyLabel: string;
  copiedMessage: string;
  errorMessage: string;
};

export function ColorSwatch({ hex, role, copyLabel, copiedMessage, errorMessage }: ColorSwatchProps) {
  const copyColor = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      toast.success(`${hex} ${copiedMessage}`, { id: "palette-copy", duration: 800 });
    } catch {
      toast.error(errorMessage, { id: "palette-copy", duration: 800 });
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="palette-swatch-button"
      style={{ "--swatch-color": hex } as CSSProperties}
      aria-label={`${copyLabel} ${hex} — ${role}`}
      onClick={copyColor}
    >
      <span className="palette-face" aria-hidden="true" />
      <span className="palette-fold" aria-hidden="true" />
      <span className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "palette-copy-label")} aria-hidden="true">
        <Copy />
      </span>
    </Button>
  );
}
