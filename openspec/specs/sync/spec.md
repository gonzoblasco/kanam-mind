# Spec: Sync

## Purpose

Sincronización entre máquinas (Mac Mini y MacBook Air). Es la evolución natural del local-first:
IndexedDB sigue siendo la fuente de verdad, y el sync es una capa opcional que el usuario activa
cuando quiere. **No es parte del MVP** - es el siguiente paso post-MVP.

## Requirements

### Requirement: El usuario sincroniza sus datos entre máquinas
El sistema SHALL permitir sincronizar entradas, tags y resúmenes entre dispositivos, manteniendo
IndexedDB como fuente de verdad local.

#### Scenario: Sync bidireccional
- **WHEN** el usuario activa el sync
- **THEN** los datos locales se suben y los datos remotos se bajan
- **AND** los conflictos se resuelven (última escritura gana, o merge por entrada)

#### Scenario: Offline con sync diferido
- **WHEN** el usuario edita sin conexión
- **THEN** los cambios se guardan localmente
- **AND** se sincronizan cuando hay conexión

### Requirement: El sync es opcional y privado
El sistema SHALL tratar el sync como una capa opcional que el usuario activa explícitamente.
Los datos sincronizados SHALL estar cifrados en tránsito.

#### Scenario: Sync desactivado por defecto
- **WHEN** el usuario instala la app
- **THEN** el sync está desactivado
- **AND** todos los datos viven solo en IndexedDB local

#### Scenario: Activación explícita
- **WHEN** el usuario activa el sync
- **THEN** se le explica qué datos se sincronizan y con qué servicio
- **AND** puede desactivarlo en cualquier momento

## Non-goals

- No es parte del MVP (se implementa post-MVP)
- No incluye multi-tenant (sync es solo para el mismo usuario entre máquinas)
- No define el backend de sync (Supabase u otro - decisión futura)
