# Cierre SEO de publicación · 9 octubre 2026

La verificación normal se ejecuta en modo preview/noindex. Además, CI realiza una segunda compilación temporal en modo producción que NO se despliega.

La simulación exige:
- dominio canónico https://alarmasycamarasrapid.com;
- 28 páginas núcleo indexables en la primera salida;
- 0 provincias y 0 municipios indexables mientras no exista aprobación editorial local;
- sitemap principal con exactamente esas 28 URLs;
- ningún pueblo o provincia sin aprobar dentro del sitemap;
- canonical único y coincidente con la URL limpia;
- robots.txt con sitemap y sin bloqueo global en producción;
- ausencia de X-Robots-Tag noindex en la simulación de producción;
- datos estructurados Organization, WebSite, WebPage y Service donde corresponda.

Los datos legales usados durante el dry-run son exclusivamente internos del runner y nunca se versionan ni se despliegan. El archivo real config/site.json se restaura al terminar.
