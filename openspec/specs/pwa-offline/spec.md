# Spec: PWA Offline

## Purpose

Kanam Mind es una PWA instalable que funciona offline. El service worker (Serwist) precachea
la app y las entradas viven en IndexedDB local, así que el usuario puede registrar y ver sus
entradas sin conexión.

## Requirements

### Requirement: La app es instalable como PWA
El sistema SHALL ser una PWA instalable con manifest y service worker.

#### Scenario: Instalar la app
- **WHEN** el usuario abre la app en un browser compatible
- **THEN** puede instalarla como PWA (manifest + service worker)
- **AND** la app tiene iconos (192px y 512px) y theme color

### Requirement: La app funciona offline
El sistema SHALL funcionar sin conexión a internet. Las entradas se leen de IndexedDB local.

#### Scenario: Uso offline
- **WHEN** el usuario abre la app sin conexión
- **THEN** puede ver y crear entradas (viven en IndexedDB)
- **AND** el resumen IA puede fallar (depende de Ollama local) sin romper la app

#### Scenario: Página offline
- **WHEN** el usuario navega a una ruta no cacheada sin conexión
- **THEN** se muestra la página ~offline con un mensaje claro

### Requirement: El service worker no intercepta llamadas a Ollama
El sistema SHALL NO interceptar las llamadas a Ollama local (puerto 11434) en el service worker.

#### Scenario: Llamadas a Ollama no cacheadas
- **WHEN** la app llama a Ollama local
- **THEN** el service worker no intercepta ni cachea esas llamadas

## Non-goals

- No incluye notificaciones push (post-MVP)
- No incluye background sync (post-MVP)
