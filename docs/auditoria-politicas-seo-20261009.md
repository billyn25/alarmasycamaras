# Políticas, contenido y SEO · 9 de octubre de 2026

Base revisada: `ffb5bf3686099355ed1a1a551e61f84c6fc5c68e`. Alcance: código, HTML generado, enlaces, metadatos, políticas y pruebas de navegador muestreadas. No incluye acceso a Search Console ni posiciones de Google.

## Aplicado

- Titular facilitado por el usuario: **R.F.G.**, visible en aviso legal, privacidad, cookies y pie. No se inventan NIF, domicilio, correo, razón social o acreditaciones.
- Políticas redactadas para el comportamiento de esta web: alojamiento estático, sin analítica, publicidad, cookies opcionales ni almacén propio de consultas. El preparador se ejecuta en el navegador y comparte el texto con WhatsApp al abrir el enlace; no se afirma que nada se comunique hasta enviar el mensaje al técnico.
- Enlaces entre las tres políticas y resumen informativo antes del botón del preparador. No se introduce un panel «Aceptar» ficticio cuando no existen cookies opcionales que gestionar.
- Cuatro guías con criterios útiles: alarmas sin cuotas, visión nocturna/archivo, segundas residencias y comparación de presupuestos. Índice de guías y enlaces desde portada, servicios y municipios; no se generan combinaciones marca/servicio/pueblo.
- Descripciones de servicios más concisas, imagen social adecuada al tipo de página y sufijo de marca abreviado cuando el título es largo.
- Datos estructurados preparados para producción: Organization, WebSite, WebPage, BreadcrumbList y Service en las páginas de los cuatro servicios. Sin precios, oficinas, valoraciones o acreditaciones ficticias. No se activan en preview.
- Se mantienen cuatro fotos por localidad, el verde Ajax, logo, teléfono único del pie y las tres intenciones de instalación locales. No cambia ninguna URL existente.
- Auditoría de contenido automatizada en cada build, además de la auditoría técnica. Se detecta y documenta la similitud municipal; no se intenta ocultarla con sinónimos o datos inventados.

## Resultado editorial y siguientes prioridades

Los 3.797 municipios siguen sin revisión local aprobada en `config/local-content.json`. La plantilla es común. La existencia de fotos, títulos únicos y enlaces correctos no prueba utilidad local diferenciada ni posicionamiento. Antes de solicitar indexación deben incorporarse condiciones de atención verificadas, cobertura real y, cuando se disponga de ellas, evidencias propias de instalaciones. No se presenta material de fabricante como trabajo local.

Las cinco marcas distintas de Ajax tienen fichas breves. Priorizar ejemplos de soluciones y criterios por gama/modelo; evitar relleno de catálogo o atribuir funciones a toda una marca. Añadir fotografías de trabajos propios y reseñas reales solo cuando estén disponibles y autorizadas.

Falta confirmar dominio definitivo y la información comercial, territorial y de derechos de uso. Se conservan `mode: preview`, `ready.legal: false`, todos los demás controles previos y las localidades no aprobadas fuera del sitemap. No se marcan páginas como aptas por pasar una prueba técnica.

**R.F.G. es la identificación proporcionada, no una validación jurídica completa.** Las iniciales no sustituyen los datos de identificación exigidos a un prestador comercial. El artículo 10 LSSI contempla nombre o denominación, domicilio, correo y NIF, entre otros datos según corresponda. Tampoco `noindex` exime de esas obligaciones. Los textos deben ser confirmados frente al tratamiento real y las condiciones contratadas con proveedores antes de su uso comercial.

## Fuentes principales consultadas

- BOE, Ley 34/2002 (artículos 10 y 22): https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758
- AEPD, guía de cookies: https://www.aepd.es/guias/guia-cookies.pdf
- AEPD, deber de informar: https://www.aepd.es/guias/guia-modelo-clausula-informativa.pdf
- AEPD, videovigilancia: https://www.aepd.es/areas-de-actuacion/videovigilancia
- Netlify, condiciones de tratamiento: https://www.netlify.com/pdf/netlify-dpa.pdf
- WhatsApp, privacidad EEE: https://www.whatsapp.com/legal/privacy-policy-eea
- Google, políticas sobre spam y contenido a escala: https://developers.google.com/search/docs/essentials/spam-policies
- Google, noindex: https://developers.google.com/search/docs/crawling-indexing/block-indexing
- Google, datos estructurados: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Ajax, documentación técnica enlazada al final de cada guía. Textos editoriales propios; prestaciones específicas por modelo.

## Pruebas

`npm run build` genera 3.839 páginas y ejecuta las auditorías técnica/editorial. `npm test` incluye las nuevas pruebas de políticas, guías, metadatos y controles de producción. `tests/privacy-seo-browser.py` revisa nueve rutas en cuatro anchuras, ausencia de cookies/almacenamiento/peticiones de terceros antes de actuar, modo sin JavaScript y el preparador con WhatsApp interceptado (sin enviar mensajes). La batería previa de 54 comprobaciones y 18 diseños municipales se mantiene. Los informes distinguen salida local y comprobación del despliegue público; el estado de CI no equivale a publicación verificada.
