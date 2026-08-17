"use client";

import { Activity, Camera, Lightbulb, Pen, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Entry, Tag } from "@/lib/types";
import { MOOD_LABELS } from "@/lib/types";

const TYPE_ICONS = {
  note: StickyNote,
  checkin: Activity,
  idea: Lightbulb,
  writing: Pen,
  photo: Camera,
};

const TYPE_COLORS: Record<Entry["type"], string> = {
  note: "text-blue-500",
  checkin: "text-green-500",
  idea: "text-amber-500",
  writing: "text-purple-500",
  photo: "text-pink-500",
};

interface EntryCardProps {
  entry: Entry;
  tags: Tag[];
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function EntryCard({ entry, tags, onEdit, onDelete }: EntryCardProps) {
  const Icon = TYPE_ICONS[entry.type];
  const entryTags = tags.filter((t) => entry.tagIds.includes(t.id));

  return (
    <article
      className="group relative rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      aria-label={`Entrada ${entry.type}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ${TYPE_COLORS[entry.type]}`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <time
              className="text-xs text-muted-foreground"
              dateTime={entry.createdAt}
            >
              {formatTime(entry.createdAt)}
            </time>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onEdit(entry)}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                onClick={() => onDelete(entry)}
              >
                Eliminar
              </Button>
            </div>
          </div>

          {entry.type === "checkin" && entry.meta.kind === "checkin" && (
            <div className="mt-1 flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-muted px-2 py-0.5">
                Ánimo: {MOOD_LABELS[entry.meta.mood] ?? entry.meta.mood}
              </span>
              <span className="rounded bg-muted px-2 py-0.5">
                Energía: {entry.meta.energy}/5
              </span>
              <span className="rounded bg-muted px-2 py-0.5">
                Sueño: {entry.meta.sleep}/5
              </span>
            </div>
          )}

          {entry.type === "writing" && entry.meta.kind === "writing" && (
            <p className="mt-1 text-xs text-muted-foreground">
              {entry.meta.wordCount} palabras
            </p>
          )}

          {entry.type === "photo" && entry.meta.kind === "photo" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.meta.imageData}
              alt={entry.content || "Foto"}
              className="mt-2 max-h-48 w-full rounded-md object-cover"
            />
          )}

          {entry.content && (
            <p className="mt-1 whitespace-pre-wrap text-sm">{entry.content}</p>
          )}

          {entryTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entryTags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
