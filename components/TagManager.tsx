"use client";

import { Plus, Tag as TagIcon, X } from "lucide-react";
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
import { uid } from "@/lib/db";
import type { Tag } from "@/lib/types";

const TAG_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#a855f7", // purple
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
];

interface TagManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: Tag[];
  onSave: (tag: Tag) => Promise<void>;
  onDelete: (tagId: string) => Promise<void>;
}

export function TagManager({
  open,
  onOpenChange,
  tags,
  onSave,
  onDelete,
}: TagManagerProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(TAG_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const tag: Tag = {
        id: uid(),
        name: trimmed,
        color,
        createdAt: new Date().toISOString(),
      };
      await onSave(tag);
      setName("");
      setColor(TAG_COLORS[0]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tags</DialogTitle>
          <DialogDescription>
            Creá etiquetas para organizar tus entradas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Create form */}
          <div className="grid gap-2">
            <Label htmlFor="tag-name">Nuevo tag</Label>
            <div className="flex gap-2">
              <Input
                id="tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: trabajo, ideas, salud..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
              <Button onClick={handleCreate} disabled={saving || !name.trim()}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Crear
              </Button>
            </div>
            <div
              className="mt-1 flex flex-wrap gap-1"
              role="radiogroup"
              aria-label="Color del tag"
            >
              {TAG_COLORS.map((c) => (
                <label
                  key={c}
                  className={`h-6 w-6 cursor-pointer rounded-full border-2 transition-transform ${
                    color === c
                      ? "scale-110 border-foreground"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                >
                  <input
                    type="radio"
                    name="tag-color"
                    value={c}
                    checked={color === c}
                    onChange={() => setColor(c)}
                    className="sr-only"
                  />
                  <span className="sr-only">Color {c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tag list */}
          <div className="grid gap-2">
            <Label>Tags existentes</Label>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Todavía no hay tags. Creá el primero.
              </p>
            ) : (
              <ul className="space-y-1">
                {tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span
                      className="inline-flex items-center gap-1.5 text-sm"
                      style={{ color: tag.color }}
                    >
                      <TagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {tag.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      aria-label={`Eliminar tag ${tag.name}`}
                      onClick={() => onDelete(tag.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
