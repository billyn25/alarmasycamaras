# Cámaras y Alarmas Rapid

Web estática independiente para instalación de alarmas, cámaras y sistemas integrados. Diseño blanco/grafito, azul Rapid, logo SVG aprobado, fotografías de producto y navegación móvil. No se modifica ningún otro repositorio.

## Verla en Netlify

Importar **billyn25/alarmasycamaras**, rama **main**. Directorio base vacío. Comando **npm run build**. Directorio de publicación **dist**. Node 22 ya configurado en `netlify.toml`.

Dominio definitivo: **https://alarmasycamarasrapid.com**. Mientras el sitio siga en modo preview, Netlify mantiene noindex. El paso a producción debe hacerse solo cuando se activen los controles internos de publicación; este repositorio no modifica DNS automáticamente.

## Contenido incluido

Portada, cuatro servicios, índice de marcas y seis páginas de marca, directorio general, 19 provincias, una página por cada uno de los **3.797 municipios del dataset**, contacto, información legal y error 404 real. No incluye todas las aldeas, barrios o entidades menores.

Provincias: Álava, Bizkaia, Gipuzkoa, Burgos, Cantabria, Navarra, La Rioja, León, Valladolid, Zamora, Ávila, Palencia, Salamanca, Segovia, Soria, Madrid, Asturias, Toledo y Guadalajara.

Cada municipio tiene una URL `/{provincia}/{municipio}/` con tres secciones: instalación de alarmas, instalación de cámaras e instalación de cámaras y alarmas. Las provincias enlazan sus municipios en HTML, sin depender del buscador JavaScript. Los enlaces a otros municipios de la provincia no afirman cercanía geográfica.

## Desarrollo y pruebas

```sh
npm run build
npm test
npm run preview
```

Abrir `http://127.0.0.1:4173`. El build no requiere red ni paquetes de producción: utiliza las fuentes ya versionadas. La auditoría revisa todas las páginas, sus H1, títulos, descripciones, imágenes, enlaces y anclas. GitHub Actions ejecuta además Chromium en móvil, tableta y PC, prueba los buscadores y el mensaje WhatsApp sin enviarlo, y exporta capturas.

## Contacto y condiciones

**641 589 394** está configurado como teléfono y WhatsApp del sitio en `config/site.json`. La consulta abre llamada o WhatsApp: no hay CRM, envío de emails ni base de datos.

Sin cuota mensual obligatoria por alarma autogestionada. Conectividad, mantenimiento o nube opcionales pueden tener coste. No se anuncian central receptora, vigilancia 24 h, aviso automático a Policía, invulnerabilidad ni integración universal. Grado 2 según equipos y configuración. Visión nocturna según modelo e iluminación.

## Publicación e indexación

Dominio definitivo configurado en **https://alarmasycamarasrapid.com**. En modo preview todo permanece `noindex`. La simulación de producción valida **3.844 URLs indexables**: 28 páginas principales, 19 provincias y 3.797 municipios. Aviso legal, privacidad, cookies y 404 siguen fuera del índice.

Cada municipio conserva una sola URL canónica y combina contenido técnico, variantes de intención de búsqueda, soluciones por inmueble, guías y enlazado interno. No se crean páginas distintas para «técnico», «instalador», «instalar cámaras» o «instalar alarmas». Los contextos municipales con fuente pública añaden profundidad extra, pero no son un requisito técnico de indexación.

En producción se genera un sitemap principal y 19 sitemaps provinciales. No inventar trabajos, oficinas, reseñas, tiempos de llegada ni hechos locales.

## Fuentes e imágenes

`data/municipios.json` conserva la fuente municipal fijada a un commit, basada en el mismo inventario utilizado para Antenas Rapid. Es un directorio de referencia, no una certificación de actualización administrativa a 2026.

`data/media-sources.json` identifica cada fotografía de Ajax, URL de origen, hash y estado de derechos. Son fotos comerciales de producto para revisión, no trabajos propios de Rapid. Las otras marcas tienen páginas informativas; no se presentan fotos de Ajax como productos Hikvision, Dahua, Uniview, Nivian o EZVIZ.

El teléfono ilustrado en la portada es un esquema de interfaz, no una captura oficial ni una instalación real.

Sin analítica, sin publicidad y sin cookies de seguimiento implementadas. Aviso legal, privacidad y cookies se muestran sin mensajes de desarrollo ni campos ficticios.
