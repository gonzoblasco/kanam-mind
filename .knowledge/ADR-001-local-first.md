# ADR-001: Local-first puro con IndexedDB

**Estado:** Aceptado
**Fecha:** 2026-08-17
**Contexto:** El proyecto `kanam` original (2026-07-26) usaba Supabase cloud + Edge Functions + Vercel. Se descartó el 2026-08-06. Al retomar la idea como segundo cerebro, la decisión de arquitectura cambia por completo.

## Decisión

Usar **IndexedDB como fuente de verdad** (via `idb`), con **Ollama local** para IA. Cero cloud. Los datos nunca salen de la máquina.

## Alternativas consideradas

### Opción B: Cloud (Supabase + Vercel)
- **Pros:** sync multi-device, accesible desde iPhone, camino a producto comercial.
- **Contras:** menos privado, depende de servicios, costo potencial, vendor lock-in.

### Opción C: Híbrido (local-first con sync opcional)
- **Pros:** lo más flexible.
- **Contras:** lo más complejo de construir, overkill para el MVP.

## Por qué local-first puro

1. **Es un segundo cerebro personal** - la privacidad es el punto. Tus pensamientos, check-ins e ideas no deberían depender de un cloud.
2. **Patrón ya validado** - kanam-story (382 tests) usa IndexedDB + Ollama local. Es terreno conocido.
3. **Cero costo, cero vendor lock-in** - funciona offline, sin dependencias externas.
4. **Evolución natural** - si después se quiere sync entre máquinas, el híbrido es una evolución, no el punto de partida.

## Consecuencias

- **Positivas:** privacidad total, sin costo, offline-first, stack portable.
- **Negativas:** sin sync multi-device en el MVP, límites de cuota IndexedDB para fotos, el resumen IA depende de Ollama local corriendo.
- **Mitigación:** el modelo de datos está desacoplado (capa `db.ts`), así que migrar a Supabase/híbrido después es un cambio de capa, no de arquitectura.
