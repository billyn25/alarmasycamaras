# Revisión: hero, cobertura y contenido útil

## Cambios

- Hero: misma imagen original `ajax-kit.jpg` (800 × 800). Se conserva su proporción; la columna visual gana espacio y la tarjeta de cámara deja de superponerse a los equipos. No se ha modificado la fotografía ni su licencia pendiente.
- Portada: 19 tarjetas provinciales, seis localidades seleccionadas en cada una (114 enlaces) y acceso a todos los municipios de cada provincia. La selección se valida contra el inventario; no se presenta como orden de demanda o cercanía. No hay scroll interior ni dependencia de JavaScript para acceder.
- Se mantienen 3.797 páginas municipales y sus tres intenciones de instalación, sin añadir variantes duplicadas de URL.
- Contenido editorial propio: cuatro explicaciones breves en portada, seis temas ampliados en Ajax y criterios prácticos en los cuatro servicios.
- Enlaces oficiales junto a las explicaciones técnicas: Jeweller, Hub 2, alimentación de respaldo, Modo Noche, MotionCam, MotionCam (PhOD), mascotas, TurretCam, TurretCam HL y NVR. La bibliografía central está en `src/security.mjs`.
- No se atribuyen vídeo continuo a MotionCam, PhOD al modelo estándar, color nocturno a cualquier cámara, ni respaldo eléctrico de toda la instalación a la batería del hub.

## Organización de fuentes

`src/coverage.mjs`: localidades destacadas y tarjetas provinciales.
`src/security.mjs`: información técnica, consejos de proyecto y fuentes.
`public/enhancements.css`: ajustes de hero y estilos de estos bloques. El build lo concatena con el CSS base y genera un único fichero versionado por contenido.

## Validación

`npm run build` compila y audita todas las rutas y anclas. `npm test` comprueba inventario, provincia/localidad y contenido. `tests/browser.py` añade comprobaciones de proporción, ausencia de superposición y cobertura en siete anchuras de 320 a 1920 px, además de la batería funcional existente. La captura local sin red sirve para revisión visual; no certifica el despliegue de Netlify.

La web sigue en revisión (`noindex`). No cambia el dominio, la cobertura pendiente de confirmación ni la aprobación editorial de las fichas municipales. El número de páginas o enlaces no acredita posicionamiento. Las referencias oficiales son fuentes técnicas, no una certificación de Rapid como instalador autorizado.
