# Spec: Timeline

## Purpose

La pantalla principal de Kanam Mind: un timeline cronológico inverso agrupado por día donde el
usuario ve y navega todas sus entradas. Es el corazón de la app - "El Diario".

## Requirements

### Requirement: El usuario ve sus entradas en orden cronológico inverso
El sistema SHALL mostrar todas las entradas ordenadas de más reciente a más antigua, agrupadas
por día.

#### Scenario: Timeline agrupado por día
- **WHEN** el usuario abre la app
- **THEN** ve las entradas agrupadas por día
- **AND** los días se ordenan de más reciente a más antiguo
- **AND** dentro de cada día, las entradas se ordenan de más reciente a más antigua

#### Scenario: Día actual etiquetado
- **WHEN** el día actual tiene entradas
- **THEN** el grupo del día actual se etiqueta como "Hoy"
- **AND** muestra la fecha completa (ej: "Hoy - lunes, 17 de agosto")

#### Scenario: Sin entradas
- **WHEN** no hay entradas
- **THEN** se muestra un mensaje de estado vacío ("Tu mente está en blanco")

### Requirement: El usuario ve el detalle de cada entrada
El sistema SHALL mostrar cada entrada con su tipo (icono + color), hora, contenido y tags.

#### Scenario: Entrada con tipo e icono
- **WHEN** se muestra una entrada
- **THEN** se muestra el icono y color correspondiente a su tipo
- **AND** se muestra la hora de creación

#### Scenario: Entrada con tags
- **WHEN** una entrada tiene tags
- **THEN** se muestran los tags con su color

#### Scenario: Check-in con métricas
- **WHEN** una entrada es de tipo check-in
- **THEN** se muestran ánimo, energía y sueño (1-5)

#### Scenario: Writing con word count
- **WHEN** una entrada es de tipo writing
- **THEN** se muestra el conteo de palabras

#### Scenario: Foto con imagen
- **WHEN** una entrada es de tipo foto
- **THEN** se muestra la imagen con su caption

### Requirement: El usuario edita o elimina una entrada desde el timeline
El sistema SHALL permitir editar o eliminar una entrada directamente desde su tarjeta en el timeline.

#### Scenario: Editar desde el timeline
- **WHEN** el usuario hace clic en "Editar" en una entrada
- **THEN** se abre el modal de edición con los datos precargados

#### Scenario: Eliminar con confirmación
- **WHEN** el usuario hace clic en "Eliminar" en una entrada
- **THEN** se muestra un diálogo de confirmación
- **AND** la entrada solo se elimina si el usuario confirma

## Non-goals

- No incluye búsqueda full-text (post-MVP)
- No incluye edición inline en el timeline (solo via modal)
