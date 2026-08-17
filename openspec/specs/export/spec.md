# Spec: Export

## Purpose

El usuario puede exportar todas sus entradas en JSON para respaldar su segundo cerebro. Es la
garantía de "sin vendor lock-in" - los datos son del usuario y siempre pueden salir.

## Requirements

### Requirement: El usuario exporta todas sus entradas en JSON
El sistema SHALL permitir exportar todas las entradas (con sus tags y resúmenes) en un archivo JSON.

#### Scenario: Exportar todo
- **WHEN** el usuario elige "Exportar"
- **THEN** se descarga un archivo JSON con todas las entradas, tags y resúmenes
- **AND** el archivo incluye metadata (versión, fecha de export)

#### Scenario: Exportar con datos vacíos
- **WHEN** no hay entradas
- **THEN** el archivo JSON se genera igualmente con arrays vacíos

### Requirement: El formato de export es portable
El sistema SHALL exportar en un formato JSON estructurado que pueda re-importarse o migrarse.

#### Scenario: Formato estructurado
- **WHEN** se exporta
- **THEN** el JSON tiene una estructura clara (entries, tags, summaries)
- **AND** cada entrada conserva su tipo, contenido, metadata, día y tags

## Non-goals

- No incluye import (solo export en el MVP)
- No incluye export en otros formatos (solo JSON)
