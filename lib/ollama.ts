/**
 * Capa de IA para Kanam Mind.
 *
 * Usa Ollama local (BYOK). El resumen diario se genera con el modelo
 * configurado (default: deepseek-v4-flash:cloud, el mismo de kanam-story).
 *
 * Todo corre localmente. Los datos nunca salen de la máquina.
 */

export interface OllamaConfig {
  baseUrl: string;
  model: string;
}

export const DEFAULT_OLLAMA_CONFIG: OllamaConfig = {
  baseUrl: "http://localhost:11434",
  model: "deepseek-v4-flash:cloud",
};

export function getOllamaConfig(): OllamaConfig {
  if (typeof window === "undefined") return DEFAULT_OLLAMA_CONFIG;
  const stored = window.localStorage.getItem("kanam-mind:ollama");
  if (stored) {
    try {
      return { ...DEFAULT_OLLAMA_CONFIG, ...JSON.parse(stored) };
    } catch {
      // ignore
    }
  }
  return DEFAULT_OLLAMA_CONFIG;
}

export function saveOllamaConfig(config: OllamaConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("kanam-mind:ollama", JSON.stringify(config));
}

export async function isOllamaAvailable(): Promise<boolean> {
  const config = getOllamaConfig();
  try {
    const res = await fetch(`${config.baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface SummaryInput {
  day: string;
  entries: {
    type: string;
    content: string;
    time: string;
  }[];
}

const SUMMARY_PROMPT = (input: SummaryInput): string => `
Eres Kanam, el segundo cerebro de Gonzo. Genera un resumen cálido y honesto del día ${input.day} basado en sus entradas.

Entradas del día:
${input.entries
  .map((e) => `- [${e.time}] (${e.type}): ${e.content || "(sin contenido)"}`)
  .join("\n")}

Reglas:
- Resumen de 3-5 oraciones, en español, tono natural (no corporativo).
- Destaca patrones: estado de ánimo, energía, ideas, logros.
- Si no hay entradas, decilo con honestidad y suavidad.
- No inventes datos que no estén en las entradas.
`;

export async function generateDailySummary(
  input: SummaryInput,
): Promise<string> {
  const config = getOllamaConfig();
  const res = await fetch(`${config.baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      prompt: SUMMARY_PROMPT(input),
      stream: false,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status}`);
  }

  const data = (await res.json()) as { response?: string };
  return data.response?.trim() ?? "";
}
