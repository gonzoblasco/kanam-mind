# Kanam Mind — BRIEF

**Versión:** 0.1
**Fecha:** 2026-08-17
**Estado:** MVP funcional

---

## 1. Propósito

Kanam Mind es el segundo cerebro de Gonzo: un diario personal inteligente, **local-first** y **privado por defecto**. Retoma la visión del proyecto `kanam` original (descartado 2026-08-06) con todo lo aprendido en kanam-story, kanam-forge y la especialización en accesibilidad.

No es una app más. Es **la** interfaz de tu vida digital, donde tus pensamientos, check-ins, ideas y escritura viven en tu máquina y nadie más los ve.

## 2. Principios de diseño

- **Local-first puro:** IndexedDB como fuente de verdad. Cero cloud. Tus datos nunca salen de tu máquina.
- **Privacidad por defecto:** Los datos son del usuario, no nuestros. Sin tracking, sin analytics.
- **IA aumentativa, no reemplazo:** La IA (Ollama local) sugiere y resume, no decide.
- **Accesibilidad como ciudadano de primera clase:** No es checkbox, es ventaja competitiva. Radix primitives + focus management + ARIA.
- **Offline-first:** La app funciona sin internet. El resumen IA necesita Ollama local.
- **Paso a paso:** Cada feature se justifica antes de implementarse.
- **Sin vendor lock-in:** Stack portable, datos exportables.

## 3. Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, Turbopack) |
| UI | Tailwind CSS 4 + shadcn/ui (Radix primitives) |
| Storage | IndexedDB via `idb` |
| IA | Ollama local (BYOK, default `deepseek-v4-flash:cloud`) |
| PWA | Serwist (service worker + manifest) |
| Calidad | Biome + Vitest + ESLint + pre-commit hooks |

## 4. MVP: "El Diario"

Una sola pantalla principal con timeline cronológico inverso agrupado por día. Cada entrada puede ser:

- **📝 Nota** — texto libre
- **📊 Check-in** — ánimo, energía, sueño (sliders 1-5)
- **💡 Idea** — pensamiento fugaz
- **✍️ Writing** — palabras escritas hoy
- **📸 Foto** — imagen con caption

Al final del día, la IA genera un resumen automático (Ollama local).

### Lo que NO entra en el MVP

- Tags + filtros (post-MVP)
- Dashboard de proyectos
- Chat conversacional con IA
- Multi-tenant
- Sync entre máquinas

## 5. Modelo de datos

| Entidad | Descripción |
|---|---|
| `entries` | Entradas del diario (tipo, contenido, metadata, día) |
| `tags` | Tags del usuario (nombre, color) |
| `summaries` | Resúmenes diarios generados por IA |

Relaciones: `entries` puede tener múltiples `tags` (many-to-many). `summaries` es 1:1 por día.

## 6. Datos del usuario

- **Export:** el usuario puede exportar todas sus entradas en JSON (post-MVP)
- **Delete:** el usuario puede eliminar su cuenta y todos sus datos
- **Privacidad:** los datos viven en IndexedDB local, nunca salen de la máquina

## 7. Riesgos identificados

- **Dependencia de Ollama local:** Si no está corriendo, el resumen IA no funciona (el resto de la app sí)
- **PWA en iOS:** Limitaciones de Safari (notificaciones, background sync, almacenamiento)
- **Adopción personal:** Si Gonzo no usa la app a diario, el proyecto muere
- **Almacenamiento IndexedDB:** Límites de cuota en navegadores (fotos pueden llenar rápido)

## 8. Roadmap

### MVP v0.1 (completado 2026-08-17)
- [x] Scaffold: Next.js 16 + Tailwind + shadcn/ui + Biome + Vitest + Serwist PWA
- [x] Modelo de datos IndexedDB (entries, tags, summaries)
- [x] Timeline cronológico inverso agrupado por día
- [x] Crear/editar/eliminar entradas (modal accesible)
- [x] Resumen IA diario con Ollama local
- [x] PWA offline + página ~offline
- [x] Tags + filtros (TagManager, selección en modal, filtro por tag/tipo)
- [x] 10 tests + build verde

### Post-MVP
- [ ] Export JSON
- [ ] Settings modal (config Ollama)
- [ ] Sync entre máquinas (híbrido)
- [ ] Notificaciones push
- [ ] Dashboard de proyectos
