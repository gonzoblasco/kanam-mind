/**
 * Modelo de datos de Kanam Mind.
 *
 * El segundo cerebro guarda entradas en un timeline cronológico inverso.
 * Cada entrada tiene un tipo, contenido, metadata y tags.
 */

export type EntryType = "note" | "checkin" | "idea" | "writing" | "photo";

export interface Entry {
  id: string;
  type: EntryType;
  /** Contenido principal (texto libre, caption, etc.) */
  content: string;
  /** Timestamp ISO de creación */
  createdAt: string;
  /** Timestamp ISO de última edición */
  updatedAt: string;
  /** Fecha del día al que pertenece (YYYY-MM-DD) */
  day: string;
  /** Tags asociados (ids) */
  tagIds: string[];
  /** Metadata específica por tipo */
  meta: EntryMeta;
}

export type EntryMeta =
  | NoteMeta
  | CheckinMeta
  | IdeaMeta
  | WritingMeta
  | PhotoMeta;

export interface NoteMeta {
  kind: "note";
}

export interface CheckinMeta {
  kind: "checkin";
  /** Ánimo 1-5 */
  mood: number;
  /** Energía 1-5 */
  energy: number;
  /** Sueño 1-5 */
  sleep: number;
}

export interface IdeaMeta {
  kind: "idea";
}

export interface WritingMeta {
  kind: "writing";
  /** Palabras escritas hoy */
  wordCount: number;
}

export interface PhotoMeta {
  kind: "photo";
  /** Data URL o blob de la imagen */
  imageData: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface DailySummary {
  id: string;
  /** Fecha del día (YYYY-MM-DD) */
  day: string;
  /** Resumen generado por IA */
  content: string;
  createdAt: string;
}

export const ENTRY_TYPES: Record<EntryType, { label: string; icon: string }> = {
  note: { label: "Nota", icon: "sticky-note" },
  checkin: { label: "Check-in", icon: "activity" },
  idea: { label: "Idea", icon: "lightbulb" },
  writing: { label: "Writing", icon: "pen" },
  photo: { label: "Foto", icon: "camera" },
};

export const MOOD_LABELS: Record<number, string> = {
  1: "Muy mal",
  2: "Mal",
  3: "Regular",
  4: "Bien",
  5: "Muy bien",
};
