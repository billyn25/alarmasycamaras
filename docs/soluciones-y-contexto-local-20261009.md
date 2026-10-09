# Soluciones por inmueble y contexto local · 9 octubre 2026

Base: 8926bbfe92d6da95712beac608cac1a26a26410f. Se mantiene el diseño, las cuatro fotos por municipio, cookies, contacto y URLs anteriores.

## Implementación

- Índice /soluciones/ y cinco páginas originales: pisos/viviendas, casas/chalets, comercios, oficinas y naves/almacenes. La segunda residencia enlaza la guía existente; no se crea otra página para la misma intención.
- Seis opciones de inmueble en TODAS las páginas municipales. Contenido en HTML y acordeones nativos, legibles sin JavaScript. CTA conserva municipio, provincia y tipo de inmueble en el preparador; las opciones se validan contra la lista del formulario.
- Seis contextos municipales redactados y con fuentes públicas: Lerma, Zalla, Castro-Urdiales, Medina del Campo, Haro y Torrelaguna. Se distingue el hecho geográfico de las decisiones condicionales de instalación. No se copian descripciones turísticas ni se extrapolan riesgos, disponibilidad o tipologías a todas las viviendas.
- Nuevos enlaces desde home, servicios, provincias, localidades y pie. No hay combinaciones inmueble × marca × municipio ni rotación de sinónimos.
- La auditoría diferencia páginas de solución, contexto municipal y localidades con servicio aprobado. Se mantienen 0 localidades aprobadas para indexación y noindex global en preview; fuentes municipales NO equivalen a confirmación de cobertura.

## Alcance SEO

Reutilizar una plantilla no constituye por sí solo una penalización; el riesgo es escalar páginas poco útiles o páginas puerta. Esta mejora no garantiza posiciones ni ausencia de acciones de Google. Los municipios sin contexto propio conservan una base compartida; no se presentan como 3.797 páginas investigadas individualmente.

La aprobación comercial/territorial y los datos del titular e imágenes continúan pendientes. No se alteran config/site.json ni config/local-content.json. No se cambian dominios, DNS ni sitemap de producción.

## Fuentes

Referencia de organización: https://ajax.systems/es/solutions-by-facility-type/ y sus páginas de apartamentos, casas, oficinas, tiendas y almacenes. La lectura directa devuelve 403 en esta sesión; se han consultado extractos indexados oficiales y documentación técnica enlazada. No se atribuye una auditoría visual completa del sitio de Ajax.

Fuentes municipales y fechas en data/local-context.json. Son referencias públicas, no clientes ni socios de Rapid. Documentación de prestaciones y AEPD enlazadas en cada solución. Contenido de planificación propio, no reproducción de casos de éxito del fabricante.

Google: https://developers.google.com/search/docs/essentials/spam-policies?hl=es y https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=es

## Verificación

Pruebas unitarias de inventario, contextos y todas las páginas municipales. Auditoría de enlaces, HTML y familias de texto sin ocultar similitud. Revisión visual y funcional de soluciones y contexto municipal a 320, 390, 768 y 1440 píxeles; navegación sin JavaScript, preservación de tipo/localidad y rutas anteriores. Las pruebas no envían mensajes de WhatsApp.
