# Spec: Settings

## Purpose

Modal de configuración donde el usuario ajusta la conexión a Ollama local (base URL y modelo).
Es el punto de entrada BYOK - el usuario trae su LLM.

## Requirements

### Requirement: El usuario configura Ollama
El sistema SHALL permitir configurar la base URL y el modelo de Ollama desde un modal de settings.

#### Scenario: Configurar base URL y modelo
- **WHEN** el usuario abre Settings
- **THEN** puede editar la base URL de Ollama (default `http://localhost:11434`)
- **AND** puede editar el modelo (default `deepseek-v4-flash:cloud`)
- **AND** al guardar, la config se persiste (localStorage)

#### Scenario: Verificar conexión
- **WHEN** el usuario guarda la config
- **THEN** puede verificar que Ollama responde (health check)
- **AND** se muestra si la conexión es exitosa o falla

### Requirement: La config de Ollama persiste
El sistema SHALL persistir la config de Ollama entre sesiones.

#### Scenario: Config persistida
- **WHEN** el usuario configura Ollama y recarga la app
- **THEN** la config se conserva
- **AND** el resumen IA usa la config guardada

## Non-goals

- No incluye gestión de múltiples providers (solo Ollama en el MVP)
- No incluye test de modelos disponibles (solo health check)
