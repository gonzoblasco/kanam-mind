# Kanam Mind 🌿

Segundo cerebro local-first con IA. Tu vida digital, privada.

## Qué es

Kanam Mind es un diario personal inteligente que vive **en tu máquina**. Registrás notas, check-ins, ideas, escritura y fotos en un timeline cronológico inverso, y al final del día la IA local (Ollama) genera un resumen cálido y honesto.

**Privacidad por defecto:** tus datos nunca salen de tu máquina. IndexedDB como fuente de verdad, Ollama local para IA. Cero cloud, cero tracking.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **UI:** Tailwind CSS 4 + shadcn/ui (Radix primitives, accesible)
- **Storage:** IndexedDB via `idb`
- **IA:** Ollama local (BYOK, default `deepseek-v4-flash:cloud`)
- **PWA:** Serwist (offline-first)
- **Calidad:** Biome + Vitest + ESLint + pre-commit hooks

## Empezar

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Para el resumen IA, asegurate de que Ollama esté corriendo localmente (`ollama serve`).

## Scripts

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servidor de producción
npm run test       # tests (Vitest)
npm run lint       # ESLint
```

## Documentación

- [BRIEF](.knowledge/BRIEF.md) - visión y alcance
- [ADR-001](.knowledge/ADR-001-local-first.md) - decisión de arquitectura local-first
