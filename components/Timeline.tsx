"use client";

import { Plus, Settings, Tag as TagIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DailySummaryCard } from "@/components/DailySummaryCard";
import { EntryCard } from "@/components/EntryCard";
import { EntryModal } from "@/components/EntryModal";
import { TagManager } from "@/components/TagManager";
import { Button } from "@/components/ui/button";
import {
  deleteEntry,
  deleteTag,
  getAllEntries,
  getAllTags,
  getSummaryByDay,
  putEntry,
  putSummary,
  putTag,
  todayKey,
} from "@/lib/db";
import { generateDailySummary } from "@/lib/ollama";
import type { DailySummary, Entry, EntryType, Tag } from "@/lib/types";
import { ENTRY_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Timeline() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [summary, setSummary] = useState<DailySummary | undefined>();
  const [generating, setGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<EntryType | null>(null);
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

  const handleSaveTag = async (tag: Tag) => {
    await putTag(tag);
    await load();
  };

  const handleDeleteTag = async (tagId: string) => {
    await deleteTag(tagId);
    // Remove the tag from all entries that reference it
    const updated = entries.map((e) =>
      e.tagIds.includes(tagId)
        ? { ...e, tagIds: e.tagIds.filter((id) => id !== tagId) }
        : e,
    );
    for (const e of updated) {
      await putEntry(e);
    }
    if (filterTag === tagId) setFilterTag(null);
    await load();
  };

  // Filter entries by tag and type
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (filterTag && !e.tagIds.includes(filterTag)) return false;
      if (filterType && e.type !== filterType) return false;
      return true;
    });
  }, [entries, filterTag, filterType]);

  // Group entries by day for the timeline
  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of filteredEntries) {
      const list = map.get(e.day) ?? [];
      list.push(e);
      map.set(e.day, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredEntries]);

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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanam Mind</h1>
          <p className="mt-1 text-sm italic text-[#8a7f6f]">
            tu segundo cerebro
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
          <h2 className="text-xl font-semibold">Timeline</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTagManagerOpen(true)}
            >
              <TagIcon className="h-4 w-4" aria-hidden="true" />
              Tags
            </Button>
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
        </div>

        {/* Filters */}
        {(tags.length > 0 || filterType) && (
          <div className="mb-4 space-y-2">
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Tag:</span>
                <button
                  type="button"
                  onClick={() => setFilterTag(null)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                    filterTag === null
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:bg-accent",
                  )}
                >
                  Todos
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setFilterTag((prev) => (prev === tag.id ? null : tag.id))
                    }
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                      filterTag === tag.id
                        ? "border-transparent text-white"
                        : "border-input hover:bg-accent",
                    )}
                    style={
                      filterTag === tag.id
                        ? { backgroundColor: tag.color }
                        : undefined
                    }
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Tipo:</span>
              <button
                type="button"
                onClick={() => setFilterType(null)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                  filterType === null
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input hover:bg-accent",
                )}
              >
                Todos
              </button>
              {(Object.keys(ENTRY_TYPES) as EntryType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    setFilterType((prev) => (prev === t ? null : t))
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                    filterType === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:bg-accent",
                  )}
                >
                  {ENTRY_TYPES[t].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {grouped.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d4c8b0] p-10 text-center">
            <p className="italic text-[#8a7f6f]">
              Tu mente está en blanco. Empezá registrando tu primer momento.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([day, dayEntries]) => (
              <section key={day} aria-label={formatDay(day)}>
                <h3 className="mb-3 border-b border-[#e5dccb] pb-1 text-sm font-semibold capitalize text-[#8a7f6f]">
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
        tags={tags}
      />

      <TagManager
        open={tagManagerOpen}
        onOpenChange={setTagManagerOpen}
        tags={tags}
        onSave={handleSaveTag}
        onDelete={handleDeleteTag}
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
