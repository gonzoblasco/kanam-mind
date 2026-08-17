import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteEntry,
  deleteTag,
  getAllEntries,
  getAllTags,
  getEntriesByDay,
  getSummaryByDay,
  putEntry,
  putSummary,
  putTag,
  todayKey,
  uid,
} from "./db";
import type { DailySummary, Entry, Tag } from "./types";

function makeEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    id: uid(),
    type: "note",
    content: "test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    day: todayKey(),
    tagIds: [],
    meta: { kind: "note" },
    ...overrides,
  };
}

describe("db", () => {
  beforeEach(async () => {
    // Clear all stores between tests
    const { getDB } = await import("./db");
    const db = await getDB();
    const tx = db.transaction(["entries", "tags", "summaries"], "readwrite");
    await Promise.all([
      tx.objectStore("entries").clear(),
      tx.objectStore("tags").clear(),
      tx.objectStore("summaries").clear(),
    ]);
    await tx.done;
  });

  it("uid genera ids únicos", () => {
    const a = uid();
    const b = uid();
    expect(a).not.toBe(b);
  });

  it("todayKey devuelve YYYY-MM-DD", () => {
    const key = todayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("putEntry y getAllEntries roundtrip", async () => {
    const entry = makeEntry({ content: "hola mundo" });
    await putEntry(entry);
    const all = await getAllEntries();
    expect(all).toHaveLength(1);
    expect(all[0].content).toBe("hola mundo");
  });

  it("getAllEntries devuelve en orden cronológico inverso", async () => {
    const e1 = makeEntry({
      content: "primera",
      createdAt: "2026-08-17T10:00:00Z",
    });
    const e2 = makeEntry({
      content: "segunda",
      createdAt: "2026-08-17T11:00:00Z",
    });
    await putEntry(e1);
    await putEntry(e2);
    const all = await getAllEntries();
    expect(all[0].content).toBe("segunda");
    expect(all[1].content).toBe("primera");
  });

  it("getEntriesByDay filtra por día", async () => {
    const today = todayKey();
    const e1 = makeEntry({ day: today, content: "hoy" });
    const e2 = makeEntry({ day: "2026-08-01", content: "otro día" });
    await putEntry(e1);
    await putEntry(e2);
    const todayEntries = await getEntriesByDay(today);
    expect(todayEntries).toHaveLength(1);
    expect(todayEntries[0].content).toBe("hoy");
  });

  it("deleteEntry elimina una entrada", async () => {
    const entry = makeEntry();
    await putEntry(entry);
    await deleteEntry(entry.id);
    const all = await getAllEntries();
    expect(all).toHaveLength(0);
  });

  it("putSummary y getSummaryByDay roundtrip", async () => {
    const day = todayKey();
    const summary: DailySummary = {
      id: `summary-${day}`,
      day,
      content: "Buen día",
      createdAt: new Date().toISOString(),
    };
    await putSummary(summary);
    const got = await getSummaryByDay(day);
    expect(got?.content).toBe("Buen día");
  });

  it("putTag y getAllTags roundtrip", async () => {
    const tag: Tag = {
      id: uid(),
      name: "ideas",
      color: "#3b82f6",
      createdAt: new Date().toISOString(),
    };
    await putTag(tag);
    const all = await getAllTags();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe("ideas");
  });

  it("deleteTag elimina un tag", async () => {
    const tag: Tag = {
      id: uid(),
      name: "trabajo",
      color: "#22c55e",
      createdAt: new Date().toISOString(),
    };
    await putTag(tag);
    await deleteTag(tag.id);
    const all = await getAllTags();
    expect(all).toHaveLength(0);
  });

  it("una entrada puede tener múltiples tags", async () => {
    const t1: Tag = { id: uid(), name: "a", color: "#111", createdAt: "" };
    const t2: Tag = { id: uid(), name: "b", color: "#222", createdAt: "" };
    await putTag(t1);
    await putTag(t2);
    const entry = makeEntry({ tagIds: [t1.id, t2.id] });
    await putEntry(entry);
    const got = await getAllEntries();
    expect(got[0].tagIds).toHaveLength(2);
    expect(got[0].tagIds).toContain(t1.id);
    expect(got[0].tagIds).toContain(t2.id);
  });
});
