# Spec: Tags

## Purpose

Etiquetas para organizar las entradas del diario. El usuario crea y elimina tags con un color,
los asigna a entradas, y filtra el timeline por tag.

## Requirements

### Requirement: El usuario crea un tag con nombre y color
El sistema SHALL permitir crear un tag con un nombre y un color de una paleta predefinida.
El selector de color SHALL ser accesible (radios nativos).

#### Scenario: Crear un tag
- **WHEN** el usuario abre el gestor de tags y escribe un nombre
- **THEN** puede elegir un color de la paleta (8 colores)
- **AND** al crear, el tag aparece en la lista y en los filtros

#### Scenario: Nombre vacío
- **WHEN** el usuario intenta crear un tag sin nombre
- **THEN** el botón "Crear" está deshabilitado

### Requirement: El usuario elimina un tag
El sistema SHALL permitir eliminar un tag. Al eliminarlo, el tag SHALL removerse de todas las
entradas que lo referencian.

#### Scenario: Eliminar un tag
- **WHEN** el usuario elimina un tag
- **THEN** el tag se elimina de IndexedDB
- **AND** el tag se remueve de todas las entradas que lo tenían
- **AND** si el filtro activo era ese tag, el filtro se resetea

### Requirement: El usuario filtra el timeline por tag
El sistema SHALL permitir filtrar el timeline por un tag específico.

#### Scenario: Filtrar por tag
- **WHEN** el usuario selecciona un tag en la barra de filtros
- **THEN** solo se muestran las entradas con ese tag
- **AND** al seleccionar de nuevo el mismo tag, el filtro se desactiva

#### Scenario: Filtro "Todos"
- **WHEN** el usuario selecciona "Todos"
- **THEN** se muestran todas las entradas sin filtro de tag

## Non-goals

- No incluye renombrar tags (solo crear/eliminar)
- No incluye editar el color de un tag existente
