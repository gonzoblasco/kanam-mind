# Kanam Mind

> Segundo cerebro local-first con IA. Tu vida digital, privada.

## Visión

Un diario personal inteligente que vive **en tu máquina**. Registrás notas, check-ins, ideas,
escritura y fotos en un timeline cronológico inverso, y al final del día la IA local (Ollama)
genera un resumen cálido y honesto. Es **la** interfaz de tu vida digital, donde tus pensamientos
viven en tu máquina y nadie más los ve.

## Problema que resuelve

El proyecto `kanam` original (2026-07-26) usaba Supabase cloud + Edge Functions + Vercel y se
descartó el 2026-08-06. Al retomar la idea como segundo cerebro, la decisión de arquitectura
cambia por completo: **local-first puro**. La privacidad es el punto de un segundo cerebro
personal - tus pensamientos, check-ins e ideas no deberían depender de un cloud.

## Principios

- **Local-first puro.** IndexedDB como fuente de verdad. Cero cloud. Los datos nunca salen de la máquina.
- **Privacidad por defecto.** Los datos son del usuario, no nuestros. Sin tracking, sin analytics.
- **IA aumentativa, no reemplazo.** La IA (Ollama local) sugiere y resume, no decide.
- **Accesibilidad como ciudadano de primera clase.** No es checkbox, es ventaja competitiva.
  Radix primitives + focus management + ARIA.
- **Offline-first.** La app funciona sin internet. El resumen IA necesita Ollama local.
- **Paso a paso.** Cada feature se justifica antes de implementarse.
- **Sin vendor lock-in.** Stack portable, datos exportables.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS 4 + shadcn/ui (Radix primitives)
- IndexedDB via `idb` (un store por entidad)
- Ollama local como motor de IA (BYOK, default `deepseek-v4-flash:cloud`)
- Serwist PWA (service worker + manifest)
- Vitest 4 (10 tests)

## Modelo de dominio

- **Entry** - entrada del diario (type: note/checkin/idea/writing/photo, content, meta, day, tagIds)
- **Tag** - etiqueta del usuario (name, color)
- **DailySummary** - resumen diario generado por IA (day, content)

## Estrategia de producto

- **Personal (ahora):** uso individual, local-first, privacidad total.
- **Sync (futuro):** si se quiere sync entre máquinas, el híbrido es evolución natural, no punto de partida.
- **Multi-tenant (futuro lejano):** círculo de confianza con dashboards propios.
