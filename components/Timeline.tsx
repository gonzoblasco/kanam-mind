"use client";

import { Plus, Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DailySummaryCard } from "@/components/DailySummaryCard";
import { EntryCard } from "@/components/EntryCard";
import { EntryModal } from "@/components/EntryModal";
import { Button } from "@/components/ui/button";
import {
  deleteEntry,
  getAllEntries,
  getAllTags,
  getSummaryByDay,
  putEntry,
  putSummary,
  todayKey,
} from "@/lib/db";
import { generateDailySummary } from "@/lib/ollama";
import type { DailySummary, Entry, Tag } from "@/lib/types";

export function Timeline() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [summary, setSummary] = useState<DailySummary | undefined>();
  const [generating, setGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);

  const today = todayKey();

  const load = useCallback(async () => {
    const [allEntries, allTags, todaySummary] = await Promise.all([
      getAllEntries(),
      getAllTags(),
      getSummaryByDay(today),
    ]);
    setEntries(allEntries);
    setTags(allTags);
    setSummary(todaySummary);
    setLoading(false);
  }, [today]);

  useEffect(() => {
    load();
  }, [load]);

  const todayEntries = useMemo(
    () => entries.filter((e) => e.day === today),
    [entries, today],
  );

  const handleSave = async (entry: Entry) => {
    await putEntry(entry);
    await load();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteEntry(deleting.id);
    setDeleting(null);
    await load();
  };

  const handleGenerateSummary = async () => {
    setGenerating(true);
    try {
      const content = await generateDailySummary({
        day: today,
        entries: todayEntries.map((e) => ({
          type: e.type,
          content: e.content,
          time: new Date(e.createdAt).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
      });
      const newSummary: DailySummary = {
        id: `summary-${today}`,
        day: today,
        content,
        createdAt: new Date().toISOString(),
      };
      await putSummary(newSummary);
      setSummary(newSummary);
    } finally {
      setGenerating(false);
    }
  };

  // Group entries by day for the timeline
  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const list = map.get(e.day) ?? [];
      list.push(e);
      map.set(e.day, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [entries]);

  const formatDay = (day: string): string => {
    const d = new Date(`${day}T12:00:00`);
    const todayLabel = day === today ? "Hoy" : "";
    const dateLabel = d.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return todayLabel ? `${todayLabel} - ${dateLabel}` : dateLabel;
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Cargando tu mente...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kanam Mind</h1>
          <p className="text-sm text-muted-foreground">
            Tu segundo cerebro. Privado, local, tuyo.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Configuración"
          onClick={() => {
            // TODO: settings modal
          }}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      <DailySummaryCard
        day={today}
        entries={todayEntries}
        summary={summary}
        generating={generating}
        onGenerate={handleGenerateSummary}
      />

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nueva entrada
          </Button>
        </div>

        {grouped.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              Tu mente está en blanco. Empezá registrando tu primer momento.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([day, dayEntries]) => (
              <section key={day} aria-label={formatDay(day)}>
                <h3 className="mb-2 text-sm font-medium capitalize text-muted-foreground">
                  {formatDay(day)}
                </h3>
                <div className="space-y-2">
                  {dayEntries.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      tags={tags}
                      onEdit={(e) => {
                        setEditing(e);
                        setModalOpen(true);
                      }}
                      onDelete={setDeleting}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <EntryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Eliminar entrada"
        description="¿Seguro que querés eliminar esta entrada? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
}
