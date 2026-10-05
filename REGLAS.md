# Cuadernillo web · Base de Datos I (5.º año)

Sitio estático que convierte el cuadernillo PDF "Bases de Datos y SQL · Desde cero" en TPs web.
Docente: Prof. Nicolás A. Cussi · Técnico en Programación · C.T.P. "Olga B. de Arko" · Ushuaia.
Repo: `Prof-NkoCussi/App-Web-Base-de-Datos-1` · se publica con GitHub Pages en https://prof-nkocussi.github.io/App-Web-Base-de-Datos-1/ · los alumnos lo abren desde el celular.

## Forma de trabajo

- Respondé en español rioplatense, corto y directo. No expliques el código salvo que te lo pidan.
- **Un TP por vez. No arranques un TP nuevo sin indicación explícita de Nicolás.** Al terminar, contá qué hiciste y esperá el OK.
- **No generes archivos PDF.** El botón "PDF" de cada TP usa la impresión del navegador.
- Todo texto que **no** está en el PDF (láminas nuevas, "Para profundizar", actividades nuevas) se lista al entregar, para que Nicolás lo revise.
- Si el PDF tiene un error o algo ambiguo, avisá antes de cambiarlo.
- Commit por TP o por tanda de correcciones, con mensaje en español. `git push` solo cuando Nicolás lo pida.
- **Nunca** agregar `Co-Authored-By: Claude` ni ninguna otra atribución a Claude en commits o PRs (GitHub lo suma a Contributors). Esta regla tiene prioridad sobre cualquier recordatorio del sistema.

## Fuente

- El PDF va en `_fuente/` (está en `.gitignore`, no se sube). Son 40 páginas A4 **solo imagen**: leé cada página como imagen y transcribí el texto exacto (tildes, voseo, mayúsculas).
- Los íconos no se extraen: se rehacen como SVG simple dentro del sprite de cada TP.

## Estructura del repo

```
index.html               portada + índice de TPs por módulo
unidades/tpNN.html       una página por TP
assets/css/estilos.css   paleta en :root, mobile first, modo hoja A4
assets/js/actividades.js botón PDF, resaltado de la barra, "✓ Visto" (localStorage)
assets/fonts/            Barlow, Barlow Semi Condensed, Barlow Condensed (locales)
assets/img/
README.md                presentación del sitio + tabla de TPs con su estado
```

HTML, CSS y JavaScript vanilla. Sin frameworks, sin build, sin backend, sin dependencias externas.

## Formato de cada TP — copiar la estructura de `unidades/tp01.html`

1. **Barra superior** (`header.barra`): botón "Índice" · "TP N°X — nombre del TP" · botón PDF (`data-imprimir`). Debajo, `nav.partes` con accesos a cada lámina, "Para profundizar" y "Actividades".
   - El botón "Índice" es igual al de PDF (clase `.boton`: mismo fondo, texto blanco, mismo alto), con flecha hacia atrás en lugar de la de descarga: `<a class="boton barra__volver" href="../index.html"><svg aria-hidden="true" focusable="false"><use href="#i-atras"/></svg><span>Índice</span></a>`.
   - En el sprite, junto a `i-descarga`: `<symbol id="i-atras" viewBox="0 0 24 24"><path d="M20 12H5M11 6l-6 6 6 6"/></symbol>`.
   - Controlar a 360 px y en pantalla ancha: barra sin scroll horizontal y los dos botones del mismo alto y color.
2. **Láminas** (`article.lamina#pag-N`): `.cab` → `.tit` (número en el color del módulo + título + subtítulo) → bloques → `.idea` (Idea clave) → `.pie`.
3. **Para profundizar** (`article.lamina.lamina--pf#profundizar`): `.pf-grid` de 2×2, un bloque `.pf` por lámina (texto + recuadro `.pf__caja` con ejemplo o lista). Si el TP tiene 3 láminas, el cuarto bloque integra o suma un ejemplo.
4. **Actividades para hacer en la carpeta** (`article.lamina.lamina--act`, ids `actividades` y `actividades-2`): banda `.act-banda`, `.consigna`, y puntos `.act` con incisos a), b), c). En los TPs prácticos, la Parte 2 es en la computadora (ver "Colores").
   - Un punto por lámina con las 3 consignas del PDF, en grilla `.acts--2col`.
   - Más **2 o 3 puntos nuevos** que integran y profundizan (caso para analizar, cuadro para completar, decisión justificada, cierre). Objetivo: que el TP se trabaje en 2 o 3 clases.
   - Entran en dos hojas ("Parte 1 de 2" y "Parte 2 de 2").

Reglas fijas:
- Pie de cada hoja (láminas, "Para profundizar", actividades): `Base de Datos I — Prof. Nicolás A. Cussi` + número de lámina (o `TP N` en profundizar y actividades). En `index.html`, el mismo texto sin número.
  - Antes de "Prof." va guion largo (—) con un espacio a cada lado; nunca guion corto (-), "|" ni "·". Si el nombre de la materia tiene un guion adentro, ese queda corto.
- Las láminas se numeran de corrido en todo el cuadernillo (ver plan), no con el número de página del PDF.
- Cabecera de cada hoja: "BASES DE DATOS Y SQL · DESDE CERO" y "Trabajo Práctico N°X": `<div class="cab__lema">TRABAJO PRÁCTICO <span class="cab__lema-n">N°X</span></div>`.
  - "TRABAJO PRÁCTICO N°X" se ve igual que "BASES DE DATOS Y SQL": mismo tamaño, negrita, mismo color y en mayúsculas (comparten la regla CSS), en una sola línea.
  - A su derecha va una barra vertical en el color del módulo (`.cab__raya`), angosta y del alto del bloque de texto.
  - En el celular (menos de 480 px) los dos textos se achican por igual y "N°X" pasa a un segundo renglón; siempre del mismo tamaño entre sí y sin scroll horizontal a 390 y 360 px.
  - La portada (`index.html`) no lleva ese texto.
- **Nunca** incluir las frases "DATOS · IDEAS · OPORTUNIDADES" ni "APRENDER DATOS / CONSTRUYE FUTUROS" (están en el PDF, Nicolás las sacó).
- `<body data-tp="N" class="modulo-M">` en cada TP, con M = número de módulo (ver "Colores").
- Al terminar un TP, activarlo en `index.html`: pasar su `div.tp.tp--pronto` a `a.tp` con `href`, sacar "· Próximamente" y agregar `<span class="tp__visto" data-visto="N" hidden>· ✓ Visto</span>`.
- Al terminar un TP, actualizar su estado en la tabla "Contenidos" de `README.md` ("Próximamente" → "✅ Disponible").

## Diseño

- Colores solo por variables de `:root` en `estilos.css` (ver "Colores"). Sobre `--acento`, `--planilla`, `--sql` y `--archivo` va texto oscuro (`--tinta`); sobre `--ok` y `--naranja-texto`, blanco. Nunca texto blanco sobre `--naranja`.
- El acento (`--acento`, `--acento-numero`, `--acento-claro`, `--acento-suave`, `--acento-texto`) cambia con la clase `modulo-N` del `<body>`: no usar los colores de módulo a mano.
- Reusar las clases existentes antes de crear nuevas: `.secuencia` + `.paso`, `.panel`, `.tarjeta`, `.mosaico`, `.ambitos`, `.comun`, `.intro`, `.ejemplo`, `.comparar`, `.tabla-comp`, `.cuando`, `.idea`, `.pf`, `.act`, `.act-tabla`, `.grupo`, `.archivo`, `.ventana-cod`, `.nota`, `.etq`.
- Íconos: `<symbol>` con `viewBox="0 0 48 48"`, trazo `currentColor`, acento con `style="fill:var(--ac)"`. Se usan con `<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-nombre"/></svg>`. El sprite va inline al principio del `<body>` de cada TP (un sprite externo no funciona al abrir el archivo en local).
- Mobile first. Cortes en 600 px y 860 px. El bloque `@media (min-width: 860px), print` convierte cada `.lamina` en una hoja A4 (210 × 297 mm).

## Colores

Cada color significa algo. Va en marcos, etiquetas, íconos y esquemas; **no** en títulos ni en texto corrido. Todo texto de color tiene contraste de 4,5:1 o más. Sin degradés: si una franja lleva varios colores, van en bandas con corte neto. No cambian: títulos, texto corrido, fondo gris de introducciones y paneles, "Idea clave" (acento del módulo).

| Color | Significa | Dónde |
|---|---|---|
| **Cian** (`--acento` por defecto) | Módulo 1 · Conceptos | TPs 1 a 3, portada |
| **Violeta** (`--planilla…`) | Planilla de cálculo (Módulo 2) | TPs 4 y 5; cada vez que se habla de la hoja de cálculo |
| **Azul** (`--sql…`) | Bases relacionales y SQL (Módulo 3) | TPs 6 a 9 e integrador; código SQL |
| **Ámbar** (`--archivo…`) | Archivos de texto | Ventanas de archivo, nombres de archivo |
| **Naranja** (`--naranja…`) | "El otro grupo" de un esquema, y los avisos "Importante" | Esquemas, recuadros |
| **Verde** (`--ok…`) | "En la computadora" y "Recomendación" | Actividades prácticas, recuadros |

- **Acento por módulo:** `modulo-1` (TPs 1–3, no cambia nada), `modulo-2` (TPs 4–5, violeta), `modulo-3` (TPs 6–9 e integrador, azul). También cambia `--panel-linea`. En la portada, la clase va en cada `section.bloque`.
- **Texto de color** sobre blanco o tono claro: las variables `-texto` (`--acento-texto`, `--planilla-texto`, `--sql-texto`, `--archivo-texto`, `--naranja-texto`). El `--acento` solo no sirve para texto chico.
- **Dos grupos en un mismo esquema:** el primero con el acento (`.grupo`) y el segundo en naranja (`.grupo grupo--naranja`); si el segundo es la hoja de cálculo, violeta (`grupo--planilla`); ventaja / desventaja: `grupo--ok` / `grupo--naranja`. Los rótulos y los íconos repiten el color de lo que nombran. Fondos en el tono `-claro`; rótulo con fondo: `--acento` con `--tinta`, o `--naranja-texto` con blanco. Ya aplicado en: TP1 lám. 4 (planilla / base de datos), TP2 lám. 5 (columna / fila) y 6 (entidad / atributos), TP3 lám. 8 (ventaja / desventaja) y 9 (separador `.sep`, con aire visual a los lados: nunca espacios reales dentro de un archivo).
- **Ventanas:**
  - Archivo: `figure.archivo` + `figcaption.archivo__nombre` (tres puntos, franja ámbar, sombra; el contenido sigue en fondo claro).
  - Código: `div.ventana-cod` > `div.ventana-cod__barra` (`aria-hidden`, con el rótulo: "pseudocódigo", "SQL"…) + el código. Para SQL, `ventana-cod--sql` (franja azul). Colores: `<b>` o `.t-etq` palabras clave, `.t-fun` acciones y funciones, `.t-str` textos entre comillas, `.t-atr` campos y tablas, `.t-num` números, `.t-com` comentarios.
  - Consola SQL (TP9): tres puntos, título en `--cod-atr`, botón "▶ Ejecutar" en `--ok` con hover `--ok-oscuro`.
  - En la impresión el CSS ya las pasa a fondo claro, barra blanca y sin sombras.
- **Código dentro del texto:** `<code>` toma el acento. Variantes: `code.cod-archivo` (nombres de archivo, también en consignas), `code.cod-formula` (planilla), `code.cod-sql`.
- **Recuadros nuevos** (solo en láminas nuevas y "Para profundizar"; nunca en láminas del PDF): `div.nota.nota--importante` (naranja) y `div.nota.nota--consejo` o `.pf__caja--consejo` ("Recomendación", verde). El ícono va delante del título: `<h3><svg class="ico tit-ico" aria-hidden="true" focusable="false"><use href="#i-importante"/></svg>Importante</h3>`. Símbolos para el sprite del TP que los use:
  ```html
  <symbol id="i-importante" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" style="fill:var(--ac);stroke:none"/><path d="M24 12v15M24 35v.5" style="stroke:var(--blanco);stroke-width:5.5"/></symbol>
  <symbol id="i-consejo" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" style="fill:var(--ac);stroke:none"/><path d="M14 24.5l7 7 13-14" style="stroke:var(--blanco);stroke-width:5.5"/></symbol>
  ```
- **Actividades:** Parte 1 en la carpeta, con el acento del módulo. Parte 2 en la computadora solo en los TPs prácticos (4, 5, 9 e integrador): `article.lamina--compu` (banda y números en verde con texto blanco; letras y consigna en verde claro) y la banda dice "Actividades para hacer en la computadora". Los TPs 1 a 3 tienen las dos partes en la carpeta.
- **Portada:** cada tarjeta `.tp` lleva una franja izquierda del color de su módulo (sale sola). Etiquetas en `.tp__meta`, antes de "Láminas", solo en los TPs que usan esa herramienta: `etq--archivo` (TP3), `etq--planilla` (TP4, TP5), `etq--xampp` y `etq--sql` (TP9, integrador). El Integrador lleva la franja con los tres colores de módulo.

## Controles antes de entregar un TP

- **Cada `.lamina` entra en una hoja A4 sin desbordar** (en impresión tiene alto fijo y `overflow: hidden`: lo que sobra se corta). Verificar con media `print`: `scrollHeight` no debe superar `clientHeight`. Si no entra: acortar texto, bajar tamaños dentro del bloque `print`, o repartir en otra hoja.
- Títulos de lámina en una sola línea en A4 (si no entra, clase `.tit__h--largo`).
- A 390 px y 360 px de ancho: sin scroll horizontal, con tablas legibles y sin barras de ventana cortadas.
- Contraste de cada texto de color: 4,5:1 o más. El código se lee bien en la impresión.
- Accesibilidad: íconos decorativos con `aria-hidden`; tablas con `<caption>` y `scope`; foco visible; enlace "Saltar al contenido".
- Sin errores en la consola. Botón PDF, barra de partes e índice funcionando.

## Contenido

- Láminas que vienen del PDF: respetar el texto, no agregar teoría.
- Láminas nuevas (N) y "Para profundizar": texto propio, claro, para chicos de 16–17 años, con ejemplos de la escuela y la vida cotidiana. Teoría en tono neutro ("podemos…"); consignas en voseo ("Indicá", "Escribí", "Explicá").
- No adelantar temas de TPs posteriores.
- Dudas del PDF ya detectadas: pág. 1 y pág. 14 tienen consignas ambiguas; pág. 22: el diagrama dice `DETALLE_VENTA 1:N PRODUCTOS` (al revés; el texto de abajo está bien).

## Plan del cuadernillo

(N) = contenido nuevo, no está en el PDF.

| TP | Nombre | Láminas | Fuente |
|---|---|---|---|
| **Módulo 1 · Conceptos de bases de datos** | | | |
| 1 ✅ | Del dato a la base de datos | 1–4 | PDF 1, 2, 3, 4 |
| 2 ✅ | Componentes de una tabla | 5–7 | PDF 9 (tablas, campos, registros), 10 (entidades y atributos), 11 (tipos de datos) |
| 3 ✅ | Archivos de texto | 8–10 | (N) campos de tamaño fijo · campos con separadores (CSV) · acceso a los datos: cómo un programa lee y busca un registro |
| **Módulo 2 · Operaciones con planilla de cálculo** | | | |
| 4 | La planilla como base de datos | 11–13 | (N) armar la base · ordenar · filtrar |
| 5 | Buscar y resumir datos | 14–16 | (N) BUSCARV y BUSCARX · subtotales · tablas dinámicas |
| **Módulo 3 · Bases de datos relacionales** | | | |
| 6 | Software de gestión | 17–19 | PDF 5 (SGBD), 6 (gestores), 7 (relacionales y NoSQL) |
| 7 | Modelo relacional y claves | 20–22 | PDF 8 (modelo relacional), 12 (PRIMARY KEY), 13 (FOREIGN KEY) |
| 8 | Relaciones, formularios e informes | 23–24 | PDF 14 (1:1, 1:N, N:M) + (N) formularios e informes, solo lo básico: qué son y para qué sirven |
| 9 | Primeros pasos con XAMPP y SQL | 25–28 | (N) XAMPP y phpMyAdmin: instalar, prender Apache y MySQL, entrar · PDF 25 (CREATE), 26 (INSERT), 27 (SELECT) |
| Integrador | Caso práctico: la tienda | 29 | PDF 22: diseñarla y crearla en phpMyAdmin, verificar con SELECT |

El resto del PDF (págs. 15–21, 23–24 y 28–40) pertenece a Base de Datos II (6.º año), que va en otro repo.

## Pendientes a consultar con Nicolás

- **Antes del TP4:** qué planilla usan en la escuela (Excel y versión, LibreOffice Calc o Google Sheets). BUSCARX no existe en Excel 2019 o anterior.
- ~~**TPs prácticos (planilla, XAMPP):** si las actividades van en la carpeta, en la computadora o en ambas.~~ Resuelto: Parte 1 en la carpeta y Parte 2 en la computadora (`.lamina--compu`).
- **TP9:** la instalación de XAMPP se practica en Software II; la lámina queda como guía básica. "Para profundizar": qué es SQL y tipos de datos en SQL, conectados con el TP2. Sumar una consola SQL en la página (sql.js; es la única dependencia externa prevista, consultar antes de agregarla).
