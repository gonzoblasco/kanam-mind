"use client";

import { Activity, Camera, Lightbulb, Pen, StickyNote } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { todayKey, uid } from "@/lib/db";
import type { Entry, EntryType, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  note: StickyNote,
  checkin: Activity,
  idea: Lightbulb,
  writing: Pen,
  photo: Camera,
};

interface EntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Entrada a editar, o null para crear nueva */
  editing: Entry | null;
  onSave: (entry: Entry) => Promise<void>;
  tags: Tag[];
}

export function EntryModal({
  open,
  onOpenChange,
  editing,
  onSave,
  tags,
}: EntryModalProps) {
  const [type, setType] = useState<EntryType>("note");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [wordCount, setWordCount] = useState(0);
  const [imageData, setImageData] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Reset state when dialog opens
  const handleOpenChange = (next: boolean) => {
    if (next) {
      if (editing) {
        setType(editing.type);
        setContent(editing.content);
        if (editing.meta.kind === "checkin") {
          setMood(editing.meta.mood);
          setEnergy(editing.meta.energy);
          setSleep(editing.meta.sleep);
        }
        if (editing.meta.kind === "writing") {
          setWordCount(editing.meta.wordCount);
        }
        if (editing.meta.kind === "photo") {
          setImageData(editing.meta.imageData);
        }
        setSelectedTagIds(editing.tagIds);
      } else {
        setType("note");
        setContent("");
        setMood(3);
        setEnergy(3);
        setSleep(3);
        setWordCount(0);
        setImageData("");
        setSelectedTagIds([]);
      }
    }
    onOpenChange(next);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const base: Entry = {
        id: editing?.id ?? uid(),
        type,
        content: content.trim(),
        createdAt: editing?.createdAt ?? now,
        updatedAt: now,
        day: editing?.day ?? todayKey(),
        tagIds: selectedTagIds,
        meta: { kind: "note" },
      };

      switch (type) {
        case "checkin":
          base.meta = { kind: "checkin", mood, energy, sleep };
          break;
        case "writing":
          base.meta = { kind: "writing", wordCount };
          break;
        case "photo":
          base.meta = { kind: "photo", imageData };
          break;
        default:
          base.meta = { kind: "note" };
      }

      await onSave(base);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const typeButtons: { type: EntryType; label: string }[] = [
    { type: "note", label: "Nota" },
    { type: "checkin", label: "Check-in" },
    { type: "idea", label: "Idea" },
    { type: "writing", label: "Writing" },
    { type: "photo", label: "Foto" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar entrada" : "Nueva entrada"}
          </DialogTitle>
          <DialogDescription>
            Registrá un momento de tu día. Todo queda en tu máquina.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Type selector */}
          <div
            className="grid grid-cols-5 gap-1"
            role="radiogroup"
            aria-label="Tipo de entrada"
          >
            {typeButtons.map(({ type: t, label }) => {
              const Icon = TYPE_ICONS[t];
              const active = type === t;
              return (
                <label
                  key={t}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-1 rounded-md border p-2 text-xs transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:bg-accent",
                  )}
                >
                  <input
                    type="radio"
                    name="entry-type"
                    value={t}
                    checked={active}
                    onChange={() => setType(t)}
                    className="sr-only"
                  />
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </label>
              );
            })}
          </div>

          {/* Content */}
          {type !== "photo" && (
            <div className="grid gap-2">
              <Label htmlFor="entry-content">
                {type === "checkin" ? "Nota (opcional)" : "Contenido"}
              </Label>
              <Textarea
                id="entry-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === "idea"
                    ? "¿Qué se te ocurrió?"
                    : type === "writing"
                      ? "¿Qué escribiste hoy?"
                      : "Escribí algo..."
                }
                rows={3}
              />
            </div>
          )}

          {/* Check-in fields */}
          {type === "checkin" && (
            <div className="grid gap-4">
              {(
                [
                  ["Ánimo", mood, setMood],
                  ["Energía", energy, setEnergy],
                  ["Sueño", sleep, setSleep],
                ] as const
              ).map(([label, value, setter]) => (
                <div key={label} className="grid gap-2">
                  <Label htmlFor={`checkin-${label.toLowerCase()}`}>
                    {label}: {value}/5
                  </Label>
                  <input
                    id={`checkin-${label.toLowerCase()}`}
                    type="range"
                    min={1}
                    max={5}
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Writing field */}
          {type === "writing" && (
            <div className="grid gap-2">
              <Label htmlFor="word-count">Palabras escritas</Label>
              <Input
                id="word-count"
                type="number"
                min={0}
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
              />
            </div>
          )}

          {/* Photo field */}
          {type === "photo" && (
            <div className="grid gap-2">
              <Label htmlFor="photo-upload">Foto</Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              {imageData && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageData}
                  alt="Vista previa"
                  className="mt-2 max-h-48 rounded-md object-cover"
                />
              )}
              <div className="grid gap-2">
                <Label htmlFor="photo-caption">Caption (opcional)</Label>
                <Input
                  id="photo-caption"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="¿Qué es esta foto?"
                />
              </div>
            </div>
          )}

          {/* Tags selector */}
          {tags.length > 0 && (
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const active = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setSelectedTagIds((prev) =>
                          active
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id],
                        )
                      }
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                        active
                          ? "border-transparent text-white"
                          : "border-input hover:bg-accent"
                      }`}
                      style={
                        active ? { backgroundColor: tag.color } : undefined
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
