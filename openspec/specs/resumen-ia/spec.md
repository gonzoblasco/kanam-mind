# Spec: Resumen IA

## Purpose

El resumen diario generado por IA local (Ollama). Al final del día, el usuario genera un resumen
cálido y honesto de sus entradas. La IA es aumentativa, no reemplazo - sugiere, no decide.

## Requirements

### Requirement: El usuario genera un resumen del día con IA local
El sistema SHALL permitir generar un resumen del día usando Ollama local (BYOK). El resumen se
basa en las entradas del día actual.

#### Scenario: Generar resumen
- **WHEN** el usuario hace clic en "Generar" y hay entradas del día
- **THEN** se llama a Ollama local con las entradas del día como contexto
- **AND** el resumen generado se muestra y se guarda en IndexedDB

#### Scenario: Sin entradas
- **WHEN** no hay entradas del día
- **THEN** el botón "Generar" está deshabilitado
- **AND** se muestra un mensaje indicando que no hay entradas para resumir

#### Scenario: Regenerar
- **WHEN** ya existe un resumen del día
- **THEN** el botón muestra "Regenerar"
- **AND** al regenerar, el resumen anterior se reemplaza

### Requirement: El resumen es cálido y honesto
El sistema SHALL generar un resumen en español, tono natural (no corporativo), que destaque
patrones (ánimo, energía, ideas, logros) sin inventar datos.

#### Scenario: Resumen con patrones
- **WHEN** el usuario genera el resumen
- **THEN** el resumen destaca patrones de las entradas (ánimo, energía, ideas, logros)
- **AND** no inventa datos que no estén en las entradas

### Requirement: El resumen maneja errores de Ollama
El sistema SHALL manejar errores cuando Ollama no está disponible o falla.

#### Scenario: Ollama no disponible
- **WHEN** Ollama no está corriendo o falla
- **THEN** se muestra un mensaje de error claro
- **AND** el resto de la app sigue funcionando (el resumen es opcional)

## Non-goals

- No incluye resumen automático sin acción del usuario (el usuario decide cuándo generar)
- No incluye resúmenes de períodos (solo por día)
