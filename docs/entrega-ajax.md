# Entrega Ajax: contenido, fotografías, confianza y cobertura

Esta revisión conserva el diseño aprobado y las URLs. Añade Jeweller por su nombre, sus prestaciones de comunicación y ocho categorías de accesorios: apertura de puertas/ventanas, PIR, cortina, fotoverificación, sirenas, inundación, humo/incendio y controles. Los enlaces técnicos apuntan al fabricante. No publica comparativas absolutas ni invulnerabilidad.

Se retira de portada «Radio propia. No el Wi-Fi de casa». Se conserva «Instalación discreta. Protección profesional» y se añade un bloque propio de Jeweller y el ecosistema Ajax. La información de protocolos y los contenidos prácticos se organizan en `src/security-core.mjs`, `src/ajax-range.mjs` y su composición `src/security.mjs`.

En portada hay cuatro fotografías de producto distintas, cada una una sola vez: kit Ajax, KeyPad TouchScreen, BulletCam y TurretCam. Se han comprobado visualmente los dos archivos nuevos. Las fuentes, tamaños y hashes figuran en `data/media-sources.json`; los permisos de uso comercial continúan pendientes de confirmación.

La sección de confianza usa cinco estrellas individuales para cinco compromisos de servicio. No contiene valoraciones, clientes, puntuaciones ni reseñas ficticias. No añade datos estructurados de AggregateRating.

El pie muestra teléfono clicable, WhatsApp y totales calculados desde los datos: cuatro servicios, 19 provincias, 3.797 municipios en el directorio. Los totales son de catálogo/cobertura, no instalaciones realizadas. La portada mantiene seis municipios seleccionados por provincia (114 enlaces) y acceso a los listados completos.

El build y las 16 pruebas unitarias pasan con el contenido final. La revisión de fotografías y pie ha pasado 54 comprobaciones de navegador. El flujo normal de verificación vuelve a ejecutarse al publicar en main. No se han cambiado DNS ni activado la indexación: sigue en preview/noindex.

Se retiran los scripts y el workflow temporales usados para importar y normalizar fotografías, para que los despliegues normales no descarguen ni vuelvan a modificar los fuentes.
