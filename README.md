# iArte — Sistema Administrativo Integral

Primera versión de trabajo del sistema de gestión institucional de iArte.

## Objetivo
Construir una plataforma centralizada para organizar la actividad académica, artística, administrativa y operativa del instituto.

## Módulos previstos
- Dirección y panel general.
- Alumnos: legajos, inscripciones, niveles, comisiones y trayectoria.
- Docentes: legajos, áreas, materias y disponibilidad.
- Organización académica: departamentos, disciplinas, materias, niveles y comisiones.
- Asistencia: registros por clase, comisión, alumno y docente.
- Horarios y aulas: turnos, franjas, espacios, capacidad y equipamiento.
- Producción artística: talleres de montaje, obras, muestras, elencos y funciones.
- Administración: aranceles, pagos, gastos, presupuestos y rendiciones.
- Becas: solicitudes, evaluación, asignación y seguimiento.
- Informes: indicadores académicos, económicos y operativos.

## Cómo abrirlo
La aplicación es estática. Abrí `index.html` en un navegador o activá GitHub Pages desde Settings → Pages → Deploy from a branch → main → /(root).

## Estado de esta versión
Prototipo navegable con panel general, navegación, directorios iniciales de alumnos y docentes, búsqueda, altas y bajas de registros ficticios. Los datos se guardan en el almacenamiento local del navegador.

## Próximas etapas
1. Definir estructura académica: departamentos, disciplinas, materias, niveles, comisiones y turnos.
2. Diseñar fichas completas de alumnos y docentes.
3. Implementar horarios, aulas y asistencia.
4. Construir módulos económicos, becas y producción artística.
5. Incorporar autenticación, roles y permisos.
6. Conectar una base de datos central con copias de seguridad y auditoría.
7. Implementar exportaciones, reportes e indicadores.

## Seguridad y privacidad
**No cargar datos personales reales, información de salud, documentación, teléfonos, domicilios, datos financieros ni contraseñas en esta versión.** Todavía no existe autenticación ni base de datos central. El almacenamiento local no reemplaza un sistema seguro ni una política de copias de seguridad.

Para un uso institucional real habrá que implementar control de acceso por roles, validación del lado servidor, cifrado en tránsito y en reposo, registros de auditoría, copias de seguridad y políticas de conservación de datos.

## Tecnologías
HTML, CSS y JavaScript sin dependencias de compilación.