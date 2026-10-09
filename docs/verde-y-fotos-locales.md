# Verde Ajax y páginas locales visuales · 9 octubre 2026

## Referencia comprobada

Se consultaron los estilos servidos por https://ajax.systems/ y https://ajax.systems/es/ el 9 de octubre de 2026, no un color estimado a ojo. En https://ajax.systems/_next/static/chunks/0m8cpie9cialr.css se encontraron `--bs-green-1:#5ae4aa`, `--bs-green-2:#1dcf94` y `--bs-green-3:#00b280`. SHA-256 del CSS examinado: `0e093f07c16c13c679ccc7977fa0da1977e8ecd16afada007ead8f0c9998e976`. Evidencia: workflow de referencia 37888562059, artifact 11596609326.

Se usa #5AE4AA como acento y #1DCF94 para interacción, con texto grafito sobre el verde. Los tonos oscuros de texto y los fondos pálidos son adaptaciones de Rapid para contraste. El azul del logo, la marca y la base blanco/grafito no se sustituyen. WhatsApp conserva su tratamiento independiente.

## Cambios

Todas las páginas municipales pasan de una fotografía de kit a cuatro imágenes distintas dentro de cada página: TurretCam en el hero y StarterKit Cam, BulletCam y KeyPad TouchScreen en los tres bloques de servicios. Los archivos ya estaban alojados en el proyecto. No se descargan imágenes en cada build ni se presentan como trabajos realizados en la localidad. Las licencias pendientes siguen pendientes; no se altera el manifiesto de fuentes.

Se incorporan un bloque visual Jeweller con seis categorías de accesorios y tres explicaciones prácticas: Modo Noche, alimentación/conectividad y diferencias entre fotos de alarma, directo y grabación. El contenido amplía las páginas locales y enlaza las guías internas ya documentadas; no representa investigación individual de cada municipio.

Los tres encabezados de instalación y las URLs municipales se conservan. No se añaden variantes por servicio y pueblo. El pie mantiene un solo teléfono; no se reintroducen reseñas ficticias ni AggregateRating. La web sigue en preview/noindex y no se modifican DNS ni configuración de producción.

## Verificación

El build recorre todo el inventario y audita enlaces. Las pruebas unitarias recorren cada municipio para comprobar cuatro imágenes únicas, tres encabezados de instalación y contenido añadido. Las pruebas de navegador cubren 18 combinaciones de localidad/anchura (320–1440 px), incluidas Lerma, Zalla y el nombre municipal más largo del inventario, además de la batería existente de 54 comprobaciones. Se guardan capturas reales de la salida compilada para PC y móvil. Un resultado verde de estas pruebas no acredita posicionamiento ni confirma el despliegue de Netlify.
