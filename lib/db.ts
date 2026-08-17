/**
 * Capa de storage IndexedDB para Kanam Mind.
 *
 * Usa `idb` (promise wrapper sobre IndexedDB). Esquema:
 * - `entries`: timeline de entradas, indexado por `day` y `createdAt`
 * - `tags`: tags del usuario
 * - `summaries`: resúmenes diarios generados por IA
 *
 * Todo vive localmente. Nada sale de la máquina.
 */

import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { DailySummary, Entry, Tag } from "./types";

interface KanamMindDB extends DBSchema {
  entries: {
    key: string;
    value: Entry;
    indexes: {
      "by-day": string;
      "by-created": string;
    };
  };
  tags: {
    key: string;
    value: Tag;
  };
  summaries: {
    key: string;
    value: DailySummary;
    indexes: {
      "by-day": string;
    };
  };
}

const DB_NAME = "kanam-mind";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<KanamMindDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<KanamMindDB>> {
  if (!dbPromise) {
    dbPromise = openDB<KanamMindDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const entries = db.createObjectStore("entries", { keyPath: "id" });
        entries.createIndex("by-day", "day");
        entries.createIndex("by-created", "createdAt");

        db.createObjectStore("tags", { keyPath: "id" });

        const summaries = db.createObjectStore("summaries", { keyPath: "id" });
        summaries.createIndex("by-day", "day");
      },
    });
  }
  return dbPromise;
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// --- Entries ---

export async function getAllEntries(): Promise<Entry[]> {
  const db = await getDB();
  const entries = await db.getAllFromIndex("entries", "by-created");
  return entries.reverse();
}

export async function getEntriesByDay(day: string): Promise<Entry[]> {
  const db = await getDB();
  const entries = await db.getAllFromIndex("entries", "by-day", day);
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEntry(id: string): Promise<Entry | undefined> {
  const db = await getDB();
  return db.get("entries", id);
}

export async function putEntry(entry: Entry): Promise<void> {
  const db = await getDB();
  await db.put("entries", entry);
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("entries", id);
}

// --- Tags ---

export async function getAllTags(): Promise<Tag[]> {
  const db = await getDB();
  return db.getAll("tags");
}

export async function putTag(tag: Tag): Promise<void> {
  const db = await getDB();
  await db.put("tags", tag);
}

export async function deleteTag(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("tags", id);
}

// --- Summaries ---

export async function getSummaryByDay(
  day: string,
): Promise<DailySummary | undefined> {
  const db = await getDB();
  const all = await db.getAllFromIndex("summaries", "by-day", day);
  return all[0];
}

export async function putSummary(summary: DailySummary): Promise<void> {
  const db = await getDB();
  await db.put("summaries", summary);
}

// --- Helpers ---

export function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
