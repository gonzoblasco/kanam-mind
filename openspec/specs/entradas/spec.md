# Spec: Entradas

## Purpose

El CRUD de entradas del diario. El usuario crea, edita y elimina entradas de 5 tipos: nota,
check-in, idea, writing y foto. Cada entrada tiene contenido, metadata específica por tipo y tags.

## Requirements

### Requirement: El usuario crea una entrada con un tipo
El sistema SHALL permitir crear una entrada eligiendo uno de 5 tipos: nota, check-in, idea,
writing o foto. El selector de tipo SHALL ser accesible (radios nativos).

#### Scenario: Crear una nota
- **WHEN** el usuario abre "Nueva entrada" y elige "Nota"
- **THEN** puede escribir contenido de texto libre
- **AND** al guardar, la entrada se agrega al timeline del día actual

#### Scenario: Crear un check-in
- **WHEN** el usuario elige "Check-in"
- **THEN** puede registrar ánimo, energía y sueño (sliders 1-5)
- **AND** puede agregar una nota opcional

#### Scenario: Crear una idea
- **WHEN** el usuario elige "Idea"
- **THEN** puede escribir un pensamiento fugaz

#### Scenario: Crear un writing
- **WHEN** el usuario elige "Writing"
- **THEN** puede registrar el conteo de palabras escritas hoy

#### Scenario: Crear una foto
- **WHEN** el usuario elige "Foto"
- **THEN** puede subir una imagen (data URL) y agregar un caption opcional

### Requirement: El usuario edita una entrada
El sistema SHALL permitir editar una entrada existente, precargando sus datos en el modal.

#### Scenario: Editar con datos precargados
- **WHEN** el usuario edita una entrada
- **THEN** el modal se abre con el tipo, contenido, metadata y tags precargados
- **AND** al guardar, la entrada se actualiza (updatedAt se renueva, createdAt se conserva)

### Requirement: El usuario elimina una entrada
El sistema SHALL permitir eliminar una entrada, con confirmación previa.

#### Scenario: Eliminar con confirmación
- **WHEN** el usuario elimina una entrada
- **THEN** se muestra un diálogo de confirmación accesible
- **AND** la entrada se elimina de IndexedDB solo si el usuario confirma

### Requirement: El usuario asigna tags a una entrada
El sistema SHALL permitir seleccionar tags al crear o editar una entrada.

#### Scenario: Seleccionar tags
- **WHEN** el usuario crea o edita una entrada y hay tags disponibles
- **THEN** puede seleccionar/deseleccionar tags (chips toggle)
- **AND** los tags seleccionados se guardan con la entrada

## Non-goals

- No incluye edición de fotos (solo subida)
- No incluye múltiples fotos por entrada (una por entrada en el MVP)
