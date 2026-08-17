# Auditoría de PWA Offline — 2026-08-17

> Verificación del comportamiento real de la PWA contra su spec (`openspec/specs/pwa-offline/spec.md`).

## Resumen

La PWA cumple **todos** los requirements del spec. El build genera el service worker y la página offline.

## Requirements verificados

### ✅ Requirement 1: La app es instalable como PWA
- **Manifest:** `app/manifest.json` con name, short_name, display standalone, theme_color, icons (192px y 512px).
- **Service worker:** `app/sw.ts` usa `Serwist` con `precacheEntries`, `skipWaiting`, `clientsClaim`, `navigationPreload` y `runtimeCaching: defaultCache`.
- **Config:** `app/serwist.ts` con `withSerwistInit` (swSrc, swDest, disable en dev).
- **Build:** el build genera `/serwist/sw.js`, `/~offline` y `/manifest.json` (verificado en el output del build).

### ✅ Requirement 2: La app funciona offline
- **Entradas en IndexedDB:** todas las entradas viven en IndexedDB local (lib/db.ts). La app funciona sin conexión para ver/crear entradas.
- **Página offline:** `app/~offline/page.tsx` con mensaje claro. Configurada como fallback en `sw.ts` (`fallbacks.entries` para `request.destination === "document"`).

### ✅ Requirement 3: El service worker no intercepta llamadas a Ollama
- **Exclusión:** en `sw.ts`, el fetch handler retorna temprano si `request.url.includes(":11434")` (puerto de Ollama local). Las llamadas a Ollama no se cachean.

## Hallazgos

Sin hallazgos. La PWA cumple la spec completa.
