"use client";

import { RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DailySummary, Entry } from "@/lib/types";

interface DailySummaryCardProps {
  day: string;
  entries: Entry[];
  summary: DailySummary | undefined;
  generating: boolean;
  onGenerate: () => Promise<void>;
}

export function DailySummaryCard({
  day,
  entries,
  summary,
  generating,
  onGenerate,
}: DailySummaryCardProps) {
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    try {
      await onGenerate();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo generar el resumen. ¿Está Ollama corriendo?",
      );
    }
  };

  return (
    <section
      className="rounded-lg border border-[#e5dccb] border-l-4 border-l-[#c9a86a] bg-[#f0e8da]/50 p-4"
      aria-label="Resumen del día"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-[#c9a86a]" aria-hidden="true" />
          Resumen del día
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={handleGenerate}
          disabled={generating || entries.length === 0}
        >
          <RefreshCw
            className={`h-3 w-3 ${generating ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          {generating ? "Generando..." : summary ? "Regenerar" : "Generar"}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {summary ? (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
          {summary.content}
        </p>
      ) : (
        <p className="mt-2 text-sm italic text-[#8a7f6f]">
          {entries.length === 0
            ? "No hay entradas hoy todavía. Registrá algo para que Kanam pueda resumir tu día."
            : "Generá un resumen de tu día con IA local."}
        </p>
      )}
    </section>
  );
}
