# Cierre SEO de publicación · 9 octubre 2026

La verificación normal se ejecuta en modo preview/noindex. Además, CI realiza una segunda compilación temporal en modo producción que NO se despliega.

La simulación exige:
- dominio canónico https://alarmasycamarasrapid.com;
- 3.844 URLs indexables en producción: 28 páginas núcleo, 19 provincias y 3.797 municipios;
- sitemap principal con las páginas núcleo y provincias;
- 19 sitemaps provinciales con todos sus municipios;
- canonical único y coincidente con la URL limpia;
- robots.txt con sitemap y sin bloqueo global en producción;
- ausencia de X-Robots-Tag noindex en la simulación de producción;
- datos estructurados Organization, WebSite, WebPage y Service donde corresponda.

Los datos legales usados durante el dry-run son exclusivamente internos del runner y nunca se versionan ni se despliegan. El archivo real config/site.json se restaura al terminar.

La variación editorial municipal ya generada se considera suficiente para permitir indexación técnica de las páginas locales. El contexto público verificado se mantiene como refuerzo adicional, no como requisito de salida.
