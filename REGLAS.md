# Cuadernillo web · Redes I (5.º año)

Sitio estático con los TPs de Redes I. 4 horas cátedra por semana: martes y jueves, 2 encuentros.
Docente: Prof. Nicolás A. Cussi · Técnico en Programación · C.T.P. "Olga B. de Arko" · Ushuaia.
Repo: `Prof-NkoCussi/App-Web-Redes-1` · se publica con GitHub Pages · los alumnos lo abren desde el celular y desde las computadoras del laboratorio (Windows).
Creado como copia de `Prof-NkoCussi/App-Web-Base-de-Datos-1`: misma estructura. Cambian la paleta, la materia, los íconos y el contenido, y se suman los simuladores.

## Forma de trabajo

- Respondé en español rioplatense, corto y directo. No expliques el código salvo que te lo pidan.
- **Un TP por vez. No arranques un TP nuevo sin indicación explícita de Nicolás.** Al terminar, contá qué hiciste y esperá el OK.
- **No generes archivos PDF.** El botón "PDF" de cada TP usa la impresión del navegador.
- **Listá todo el texto nuevo al entregar cada TP**, para que Nicolás lo revise. En los TPs que salen de material existente (TP1 a TP6 y TP10), listá también cada corrección que hiciste sobre ese material.
- La "Práctica" y la "Entrega" de cada TP son de Nicolás (ver más abajo). Si encontrás un error o algo ambiguo, avisá antes de cambiarlo.
- Commit por TP o por tanda de correcciones, con mensaje en español. `git push` solo cuando Nicolás lo pida.
- **Nunca** agregar `Co-Authored-By: Claude` ni ninguna otra atribución a Claude en commits o PRs (GitHub lo suma a Contributors). Esta regla tiene prioridad sobre cualquier recordatorio del sistema.
- **El repo y el sitio son públicos.** No van: nombres de alumnos, adaptaciones a nombre de una persona, la solución del proyecto YoLo, ni contraseñas, claves de Wi-Fi o direcciones IP reales del colegio.

## Fuente

- El material va en `_fuente/` (está en `.gitignore`, no se sube), una carpeta por TP: `_fuente/tpN/`.
- `_fuente/modelo-tp01.html` y `_fuente/modelo-tp03.html` son dos TPs de Base de Datos I guardados como modelo de estructura. No se publican.
- Los íconos y los diagramas no se extraen: se rehacen en SVG simple.

## Estructura del repo

```
index.html                  portada + índice de TPs por unidad
unidades/tpNN.html          una página por TP
unidades/tpNN-pasos.html    versión paso a paso de ese TP
assets/css/estilos.css      paleta en :root, mobile first, modo hoja A4
assets/js/actividades.js    botón PDF, resaltado de la barra, "✓ Visto" (localStorage)
assets/js/simuladores.js    simuladores (se crea con el primero)
assets/fonts/               Barlow, Barlow Semi Condensed, Barlow Condensed (locales)
assets/img/
README.md                   presentación del sitio + tabla de TPs con su estado
REGLAS.md                   este archivo
```

HTML, CSS y JavaScript vanilla. Sin frameworks, sin build, sin backend, sin dependencias externas.

## Puesta en marcha

1. **Paleta + `index.html`.** Nada más. Nicolás mira la estructura y los colores y da el OK.
2. **Resto de la base:** guardar el modelo en `_fuente/`, borrar los TPs de Base de Datos, limpiar el CSS, `actividades.js` y README.
3. **TP7**, y después un TP por vez.

## Identidad

Paleta **verde azulada**: parecida a la de Base de Datos I, tirando a verde. Tiene la misma estructura de variables que el repo de origen; cambia el tono. **Está a prueba:** Nicolás la aprueba viendo el `index.html`.

En `:root`, estas variables toman estos valores. Las de ventanas, código, grises, `--radio` y `--fuente*` no se tocan.

```css
  /* Identidad */
  --acento: #26C9A1;         /* verde azulado: íconos, barras, flechas, recuadros. Encima va texto oscuro */
  --acento-numero: #069873;  /* número de cada título (3,6:1 sobre blanco: solo texto grande) */
  --acento-claro: #C9F2E8;   /* encabezados de tarjetas */
  --acento-suave: #E3F7F2;   /* fondo de "Idea clave" */
  --acento-texto: #096750;   /* texto de color sobre blanco o sobre el tono claro (5,6:1 o más) */
  --panel-linea: #C6EBE2;    /* divisor dentro de recuadros */

  /* Colores con significado propio */
  --naranja: #EA580C;  --naranja-texto: #C2410C;  --naranja-claro: #FFEDD5;
  --ok: #15803D;       --ok-oscuro: #166534;      --ok-claro: #DCFCE7;
  --error: #B91C1C;    --error-claro: #FEE2E2;                               /* nueva */
  --archivo: #F59E0B;  --archivo-texto: #92400E;  --archivo-claro: #FEF3C7;  --archivo-linea: #FDE68A;

  /* Terminal */
  --consola-ok: #86EFAC;  --consola-error: #FCA5A5;                          /* nuevas */
```

Cambios sobre el CSS de Base de Datos I:
- **Sin colores por módulo.** `--acento` lleva su valor directo (ya no `var(--conceptos)`). Se borran `--conceptos`, `--planilla*`, `--sql*`, `--campo-*`, las clases `.modulo-2` y `.modulo-3`, `.grupo--planilla`, `.ventana-cod--sql`, `.tp--integrador`, `.etq--planilla`, `.etq--sql`, `.etq--xampp`, `code.cod-formula` y `code.cod-sql`. El `<body>` de cada TP lleva solo `data-tp="N"`.
- **Nuevas:** `.grupo--error`, `.etq--sim` y `.etq--compu`, hechas igual que sus hermanas.
- Lo demás que sea exclusivo de Base de Datos y no se reuse (por ejemplo `.pseudo`, `.tabla-campos`) se borra. Ante la duda, dejarlo y avisar.
- Todo lo otro queda como está: sobre `--acento` sigue yendo texto oscuro (`--tinta`).

Textos fijos:
- **Cabecera de cada hoja:** `<b>REDES I</b><span>TÉCNICO EN PROGRAMACIÓN · 5.º AÑO</span>` y, a la derecha, `TRABAJO PRÁCTICO N°X` con la barra vertical. Mismas reglas de tamaño y de celular que el repo de origen; la bajada es más larga, verificar a 360 px. La portada no lleva "TRABAJO PRÁCTICO".
- **Pie de cada hoja y de la portada:** `Redes I — Prof. Nicolás A. Cussi` + número de lámina (o `TP N` en profundizar y actividades). En `index.html`, sin número. Antes de "Prof." va guion largo (—).
- **Portada (`index.html`),** con el formato de la de Programación y el nombre de la escuela:
  ```html
  <h1>Redes <span>I</span></h1>
  <p class="tit__sub">Cuadernillo de actividades · 5.º año</p>
  …
  <p class="portada__datos">
    <strong>Redes I • Prof. Nicolás A. Cussi</strong><br>
    Técnico en Programación · C.T.P. "Olga B. de Arko" · Ushuaia
  </p>
  ```
  Recuadro "Cómo usarlo": cada TP tiene sus láminas, un simulador para probar, una página "Para profundizar" y, al final, las actividades.
- **README:** también con el nombre de la escuela.
- **`<title>`, descripción y `theme-color`** (`#26C9A1`) de cada página.
- **Ícono de la materia:** tres equipos conectados a un nodo central (red en estrella), en versión sólida para la cabecera.
- **Sin eslóganes ni frases decorativas.**
- **Sin años calendario en el sitio** (ni 2026 ni 2027): el cuadernillo se reusa todos los años.
- **Progreso:** la clave de `localStorage` es `redes:tp-visto-`. No usar `bd1:`, `prog:` ni `tpd1:`: todos los cuadernillos comparten el dominio `prof-nkocussi.github.io`.

## Colores

Cada color significa algo y nunca es el único dato: siempre va con texto o ícono. Va en marcos, etiquetas, íconos y esquemas; **no** en títulos ni en texto corrido. Todo texto de color: 4,5:1 o más. Sin degradés.

| Color | Significa | Dónde |
|---|---|---|
| **Verde azulado** (`--acento…`) | La materia. En un esquema cliente-servidor, el cliente: quien pide | Barras, íconos, recuadros, "Idea clave" |
| **Naranja** (`--naranja…`) | El servidor: quien responde. "El otro grupo" de un esquema. Los avisos "Importante" | Esquemas, recuadros |
| **Verde** (`--ok…`) | Funciona. "En el router del laboratorio". "Recomendación" | Resultados, recuadros |
| **Rojo** (`--error…`) | Falla: sin respuesta, error | Resultados de diagnóstico |
| **Ámbar** (`--archivo…`) | Carpetas y archivos | TP6, nombres de archivo |

- **Dos grupos en un mismo esquema:** el primero con el acento (`.grupo`) y el segundo en naranja (`.grupo.grupo--naranja`). Cliente y servidor van siempre así, en todos los TPs. Funciona y falla: `grupo--ok` y `grupo--error`.
- **Texto sobre color:** sobre `--acento` y `--archivo`, texto oscuro (`--tinta`). Sobre `--ok`, `--naranja-texto` y `--error`, blanco. Nunca texto blanco sobre `--acento` ni sobre `--naranja`.
- **Texto de color** sobre blanco o tono claro: las variables `-texto`. El `--acento` solo no sirve para texto.
- **Capas OSI y TCP/IP:** escala de tonos del acento, con el nombre de la capa escrito. No asignar un color distinto a cada capa.
- **Cableado (TP3):** los colores reales de los hilos, como variables `--hilo-*`, y cada hilo con su nombre escrito.
- **Campos de los simuladores** (inputs, selects): borde `--gris`. El `--acento` da 2,1:1 sobre blanco y no alcanza para un control.
- **Ventanas de código y terminal:** `div.ventana-cod` > `div.ventana-cod__barra` (`aria-hidden`, con el rótulo: "JavaScript", "JSON", "HTTP", "Símbolo del sistema") + el contenido. Colores: `<b>` palabras clave, `.t-fun` funciones, `.t-str` textos, `.t-atr` campos y propiedades, `.t-num` números, `.t-com` comentarios. En la terminal, lo que sale bien en `--consola-ok` y los errores en `--consola-error`. En la impresión pasan a fondo claro (el CSS ya lo hace).
- **Código dentro del texto:** `<code>` toma el acento. Sirve para comandos, IP, puertos y rutas. `code.cod-archivo` para carpetas y nombres de archivo.
- **Recuadros:** `div.nota.nota--importante` (naranja) y `div.nota.nota--consejo` o `.pf__caja--consejo` ("Recomendación", verde), con su ícono delante del título (`#i-importante`, `#i-consejo`).
- **Actividades:** en la carpeta, con el acento. En la computadora, `article.lamina--compu`, con `--acento-fuerte` (el acento un tono más oscuro, con texto oscuro encima), para seguir el mismo hilo de color (10/10).
- **Portada:** cada tarjeta `.tp` lleva la franja izquierda del acento. Etiquetas en `.tp__meta`, antes de "Láminas": `etq--sim` ("Simulador", en los TPs que tienen uno) y `etq--compu` ("En la compu", verde, en los TP8, TP9 y TP10).

## Formato de cada TP

Copiar la estructura de `_fuente/modelo-tp01.html` hasta que exista el primer TP de Redes; después, la de ese TP.

1. **Barra superior** (`header.barra`): botón "Índice" · "TP N°X — nombre del TP" · botón PDF (`data-imprimir`). Debajo, `nav.partes` con accesos a cada lámina, al simulador, a "Para profundizar", a "Actividades" y a "Paso a paso". Verificar a 360 px (el TP7 tiene nombre largo).
2. **Láminas** (`article.lamina#pag-N`): `.cab` → `.tit` (número + título + subtítulo) → bloques → `.idea` (Idea clave) → `.pie`. **3 láminas por TP**; el TP7 tiene 5, el TP9 4 y el TP10 1.
3. **Para profundizar** (`article.lamina.lamina--pf#profundizar`): `.pf-grid` de 2×2, un bloque `.pf` por lámina (texto + recuadro `.pf__caja`). Con 3 láminas, el cuarto bloque integra. En el TP7 puede usar dos hojas; en el TP9 (4 láminas, un bloque por lámina), también.
4. **Actividades para hacer en la carpeta** (`article.lamina.lamina--act#actividades`), con la estructura de los .docx de la materia:
   - Secciones numeradas `N- Tema`, desde 1 en cada TP.
   - Incisos `a)`, `b)`, `c)` con la letra destacada.
   - Cuadros comparativos para completar (`.act-tabla`).
   - **Un punto por lámina + un caso integrador.** En una sola hoja (dos en el TP7). Más cortas que en Base de Datos: no se suman 2 o 3 puntos extra.
   - Sin cierre: no llevan `REALIZAR EN LA CARPETA.` ni `Fecha límite`.
   - Sin corrección automática.
5. **Actividades para hacer en la computadora** (`article.lamina--compu#actividades-2`), solo en los TP8, TP9 y TP10: pasos numerados y un recuadro "Entrega" con la lista de lo que se entrega, con viñetas (10/10: sin casillas; en el TP8, una sola línea, sin lista).
6. **Mini-juego:** si el TP tiene juego en la app Redes I Games, cierra con el botón "Jugar el mini-juego de este TP". Ver "Componentes nuevos".

Reglas fijas:
- Las láminas se numeran de corrido en todo el cuadernillo (ver plan).
- Al terminar un TP: activarlo en `index.html` (de `div.tp.tp--pronto` a `a.tp` con `href` y su `tp__visto`) y pasar su estado a "✅ Disponible" en el README.
- Objetivo de tiempo: 4 encuentros por TP. El TP8 se da en 2 y el TP10 en 6.

## Regla de las actividades (innegociable)

**Las actividades de un TP se resuelven únicamente con el contenido de ese TP** (láminas y "Para profundizar"). Nada que no esté en el material. La terminología de cada consigna coincide palabra por palabra con la del contenido.

Antes de entregar, revisar inciso por inciso: ¿dónde está la respuesta? Si no está, se agrega al contenido o se saca el inciso. Por eso "investigá" pasa a "explicá con el material".

## Componentes nuevos

El repo de origen no tiene nada interactivo. Lo que sigue se crea en el TP donde aparece por primera vez; la lógica va en `assets/js/simuladores.js`, corta y sin librerías.

- **Terminal:** una `ventana-cod` con el rótulo "Símbolo del sistema", el comando y su salida en texto real y en español, como la muestra Windows. Máximo unas 14 líneas dentro de una lámina.
- **Simulador** (`section.simulador`): una parte interactiva por TP, que hace visible algo que en papel no se ve.
  - En el HTML siempre va escrito **un ejemplo resuelto**: es lo que se ve sin JavaScript y en la impresión.
  - Lleva la aclaración "Simulación: los valores son de ejemplo", salvo el del TP9, que hace una petición real.
  - Usable con teclado; los cambios se avisan con `aria-live="polite"`; respeta `prefers-reduced-motion`.
  - Va dentro de la lámina de su tema si la hoja entra en A4. Si no, en una hoja propia después de las láminas, sin número de lámina.

  | TP | Simulador |
  |---|---|
  | 4 | Conversor IP ↔ binario |
  | 5 | Tabla NAT que se completa al "mandar" paquetes |
  | 6 | Validador de rutas UNC |
  | 7 | Resolución DNS paso a paso |
  | 8 | (11/10) Sin simulador dentro de la página: se sacó el panel genérico porque la práctica se hace en el simulador del panel, una app aparte (ver abajo) |
  | 9 | Petición real: un GET a DolarAPI, con la URL armada, su código de respuesta, su JSON y el dato mostrado en la página |

- **Datos de ejemplo, iguales en todo el cuadernillo:** red `192.168.1.0/24`, puerta de enlace `192.168.1.1`, PC `192.168.1.25`, DNS `8.8.8.8`. IP públicas de ejemplo: rango `203.0.113.0/24`, reservado para documentación. Dominio de ejemplo: uno inventado, siempre el mismo (`redesdelaula.com`, que no existe). Los dominios reales van solo en la práctica de laboratorio, donde la salida la ve el alumno en su PC.
  - **Excepción del TP9 (13/10):** las API públicas van con su dominio real (`dolarapi.com`, `api.open-meteo.com`, `pokeapi.co`). La API inventada de la biblioteca de la escuela usa un dominio inventado: `api.redesdelaula.com` (`/libros`, `/libros/12`).
- **Captura anotada** (TP7): esquema SVG de una ventana de Wireshark (columnas No., Time, Source, Destination, Protocol, Info) con una consulta DNS y su respuesta, y un GET de HTTP con su `200 OK`, con flechas que explican cada fila. Solo DNS y HTTP; ARP queda afuera.
- **Pantallas del router** (TP8): esquemas SVG simplificados del panel del TP-Link, no capturas ni fotos. Cada esquema muestra solo lo que hay que tocar, con el nombre exacto de la opción. Modelo: TP-Link TL-WR850N v3, con el panel en inglés: cada menú va en inglés, como en el panel, con la traducción al lado. Los datos salen de la guía oficial que pasó Nicolás y de las capturas del panel real; lo que no esté ahí lleva el marcador visible [VERIFICAR EN EL PANEL].
  - (10/10) El panel tiene tres pestañas: Quick Setup, Basic (lo más usado) y Advanced (todos los menús). Las rutas llevan la pestaña: `Advanced › Network › LAN Settings`. La traducción va sin la pestaña: (Red › Configuración de LAN).
  - Los dispositivos conectados se ven en `Basic › Network Map` y en `Advanced › Network › LAN Settings` › Client List, no en Status. Status muestra la IP del lado Internet.
- **Simulador del panel del router** (TP8, 10/10): app aparte, en el repo `Prof-NkoCussi/App-Router-Simulador`, publicada en https://prof-nkocussi.github.io/App-Router-Simulador/. Solo para computadora. Reproduce el panel del TL-WR850N v3 con diseño propio, sin logo ni marca, y al lado tiene «Práctica», «Tu PC», «Otra PC», «Celular» y «Router». La práctica en la compu del TP8 se hace ahí, para no pasar con el router real PC por PC.
  - Los pasos de «Práctica» (`assets/js/practica.js`) llevan las mismas palabras que las actividades en la compu del TP8: si se cambia una, se cambia la otra.
  - La entrega es solo la captura del resumen, que trae un código y muestra cada paso con ✓ (10/10: sin el `config.bin`).
  - Pantallas provisorias, armadas sin captura del router real: Backup & Restore, el formulario Add de Address Reservation, Administration y el formulario Add de Access Control. Se corrigen cuando Nicolás mande las capturas.
- **Diagramas:** todos en SVG simple, con `role="img"` y texto alternativo: topologías, recorrido de un paquete, handshake, encapsulación, cliente-servidor, capas, publicar/suscribirse de MQTT, arquitectura del YoLo. Si hace falta una foto real (rack, patch panel), dejar un marcador visible: `[FOTO: qué mostrar]`.
- **Botón del mini-juego:** enlace a la app ya publicada (`https://prof-nkocussi.github.io/App-redes-games/`, repo `Prof-NkoCussi/App-redes-games`, un juego por carpeta `games/tpN/`). Confirmar la URL de cada juego en ese repo. Hoy hay juego de los TP1 a TP5. El botón va solo en los TPs que tienen juego. El cuadernillo linkea a la app: no se fusionan.
- **Código JavaScript** (TP9 y TP10): `let` y `const`, `===`, punto y coma, comillas dobles, textos unidos con `+`. Las peticiones se escriben con `async function` y `await fetch()`, como receta fija; `.then()` solo se nombra en "Para profundizar". Al lado de cada ejemplo va escrita la salida esperada.

## Versión paso a paso

Cada TP tiene además `unidades/tpNN-pasos.html`: el mismo tema en formato guiado. Está abierta a todo el curso y se enlaza desde la barra del TP. **No se dice para quién es.**

- Texto en imprenta mayúscula (con `text-transform: uppercase`; el HTML se escribe normal) y tamaño grande.
- Esquemas e imágenes a color, grandes.
- Un concepto o una consigna por pantalla, con "Anterior" y "Siguiente" y el aviso "Paso 2 de 6".
- Consignas de un solo paso: unir con flechas, completar con una palabra, marcar la opción, dibujar.
- No pide: cálculos de subnetting, memorizar las capas con sus PDU, ejercicios de NAT, CIDR o binario, ni programar.
- Cierra con el botón al cuestionario de Google Forms de ese TP. El botón se agrega cuando Nicolás pase el link; mientras tanto no se muestra.
- En el TP10 es la guía del rol de documentación: fotos del armado, registro de los pasos de puesta en marcha y pruebas de `ping` en dupla.

## Diseño

- Colores solo por variables de `:root` en `estilos.css`.
- Reusar las clases existentes antes de crear nuevas: `.secuencia` + `.paso`, `.panel`, `.tarjeta`, `.mosaico`, `.ambitos`, `.comun`, `.intro`, `.ejemplo`, `.comparar`, `.tabla-comp`, `.cuando`, `.idea`, `.pf`, `.act`, `.act-tabla`, `.grupo`, `.archivo`, `.ventana-cod`, `.nota`, `.etq`.
- Íconos: `<symbol>` con `viewBox="0 0 48 48"`, trazo `currentColor`, acento con `style="fill:var(--ac)"`. El sprite va inline al principio del `<body>` de cada TP.
- Teclas como teclas (`<kbd>Win</kbd> + <kbd>R</kbd>`).
- Mobile first. Cortes en 600 px y 860 px. El bloque `@media (min-width: 860px), print` convierte cada `.lamina` en una hoja A4.

## Controles antes de entregar un TP

- Cada `.lamina` entra en una hoja A4 sin desbordar (media `print`: `scrollHeight` no supera `clientHeight`).
- Títulos de lámina en una sola línea en A4 (si no entra, `.tit__h--largo`).
- A 390 px y 360 px: sin scroll horizontal, con tablas legibles y sin barras de ventana cortadas.
- Contraste de cada texto de color: 4,5:1 o más.
- **Todo dato técnico verificado:** puertos, protocolo de transporte, códigos de estado, rangos, salida de cada comando. Cada comando, probado en Windows.
- Cada simulador: probarlo entero, también con datos mal escritos. Sin JavaScript se ve el ejemplo resuelto.
- La regla de las actividades, inciso por inciso.
- Impresión: código y terminal en fondo claro, sin botones.
- Accesibilidad: íconos decorativos con `aria-hidden`; esquemas SVG con `role="img"` y texto alternativo; tablas con `<caption>` y `scope`; foco visible; controles usables con teclado; enlace "Saltar al contenido".
- Sin errores en la consola. Botón PDF, barra de partes e índice funcionando.

## Contenido

- **A quién va:** chicos de 16–17 años. Frases cortas, un concepto por bloque, ejemplos de la escuela y la vida cotidiana (el Wi-Fi de la casa, el laboratorio, el celular).
- Teoría en tono neutro ("podemos…"); consignas en voseo ("Indicá", "Escribí", "Completá").
- **No adelantar temas de TPs posteriores.** Sí retomar los anteriores, nombrando el TP.
- **Windows:** `ipconfig` en el TP8 y `ping`, explicado brevemente, en el TP10. `tracert`, `nslookup` y `netstat` quedan para Redes II. El equivalente de Linux (`ifconfig`) se nombra solo en "Para profundizar".
- **Simplificaciones acordadas:** DNS y DHCP usan UDP; HTTP, HTTPS, FTP, SSH, SMTP, POP3 e IMAP usan TCP. No entrar en excepciones (DNS sobre TCP, HTTP/3).
- **Seguridad:** el TP11 es de soporte y puede no darse. Lo mínimo va antes: HTTPS en el TP7; credenciales por defecto y WPA2/WPA3 en el TP8.
- Palabras: "celular", "notebook", "puerta de enlace" (y `gateway` entre paréntesis la primera vez), "contraseña".

## Plan del cuadernillo

11 TPs · 34 láminas · 2 unidades. El número de TP coincide con el orden de dictado.

| TP | Nombre | Láminas | Temas, una lámina por tema | Simulador |
|---|---|---|---|---|
| **Unidad 1 · Fundamentos, infraestructura y direccionamiento** | | | | |
| 1 | Señales, medios de transmisión y topologías | 1–3 | señal analógica y digital · medios (UTP, fibra óptica, Wi-Fi, Bluetooth) · topologías (estrella, malla, bus) | — |
| 2 | Clasificación de redes, componentes y diseño de una red escolar | 4–6 | PAN, LAN, MAN, WAN; pública y privada; Half-Duplex y Full-Duplex · componentes (switch, router, access point, patch panel, rack) · diseño de la red de la escuela | — |
| 3 | Cableado 568A/568B y modelos OSI y TCP/IP | 7–9 | normas 568A y 568B, cable directo y cruzado · modelo OSI · TCP/IP y encapsulación | — |
| 4 | Direccionamiento IPv4, subnetting e IPv6 | 10–12 | IPv4 (estático y dinámico, público y privado, clases) · subnetting · IPv6 | IP ↔ binario |
| 5 | Enrutamiento y NAT, PAT | 13–15 | enrutamiento (función del router, estático y dinámico) · NAT (agotamiento de IPv4 y objetivos) · tipos de NAT (estática, dinámica y PAT) | Tabla NAT |
| 6 | Recursos compartidos en red | 16–18 | carpetas compartidas y permisos · rutas UNC · impresora compartida | Rutas UNC |
| **Unidad 2 · Protocolos, seguridad y aplicaciones** | | | | |
| 7 | Transporte y protocolos de aplicación | 19–23 | TCP y UDP, con el handshake de tres pasos · puertos · DNS y DHCP · HTTP y HTTPS · FTP, SSH y correo | DNS |
| 8 | Configurando el router | 24–26 | la IP de la PC: `ipconfig` e IP fija en Windows · cómo funciona un router y cómo se entra · configurar el router: Wi-Fi, DHCP e IP fijas | Simulador del panel, app aparte |
| 9 | APIs REST y MQTT | 27–30 | cliente-servidor, recursos y endpoints · verbos HTTP y códigos de respuesta · JSON y `fetch` · MQTT: broker, publisher, subscriber y tópicos | Petición real |
| 10 | Proyecto integrador YoLo | 31 | mapa del proyecto: navegador → servidor → broker MQTT → ESP32 → motores, el protocolo de cada tramo y el esquema de red. El resto es práctica en la compu (6 clases) | — |
| 11 | Seguridad en redes (de soporte) | 32–34 | amenazas (sniffing, spoofing, Man-in-the-Middle, DoS) · firewall, DMZ y VPN · HTTPS, certificados y Wi-Fi (WPA2, WPA3, redes públicas) | — |

### Detalle de los TP7 a TP11 (texto nuevo)

**TP7 · Transporte y protocolos de aplicación**
- L19 **TCP y UDP:** qué hace la capa de transporte; orientado a conexión o no; confiabilidad, velocidad y control de flujo; handshake de tres pasos (SYN, SYN-ACK, ACK) en SVG; casos de uso (videollamada, descarga de un archivo, streaming, juego online, email, consulta DNS).
- L20 **Puertos:** qué es un puerto; IP + puerto; bien conocidos (0–1023), registrados (1024–49151) y dinámicos (49152–65535).
- L21 **DNS (53) y DHCP (67/68):** resolución de nombres y caché; asignación automática y proceso DORA (retoma el TP4). Simulador de DNS.
- L22 **HTTP (80) y HTTPS (443):** solicitud (método, URL, headers) y respuesta; códigos 200, 301, 403, 404 y 500; HTTPS como HTTP cifrado.
- L23 **FTP (20/21), SSH (22) y correo:** SMTP (25) para enviar, POP3 (110) e IMAP (143) para recibir; diferencia entre POP3 e IMAP.
- Cada lámina dice el puerto y si usa TCP o UDP.
- "Para profundizar": tabla resumen de puertos (20/21, 22, 25, 53, 67/68, 80, 110, 143, 443 y 3306 de MySQL) y la captura anotada.

**TP8 · Configurando el router** (C, 9/10: antes "Diagnóstico de red")
- Enfoque: que entiendan cómo funciona un router, entren al panel y lo configuren. Es individual y sirve de práctica para el proyecto final, donde cada grupo configura su router.
- L24 **La IP de la PC:** `ipconfig` y `ipconfig /all` (IP, máscara, puerta de enlace, MAC, DHCP habilitado); IP dinámica y fija; cómo poner una IP fija en Windows (`ncpa.cpl` › Propiedades › TCP/IPv4), con el esquema SVG de esa ventana.
- L25 **Cómo funciona un router:** los dos lados (WAN con la IP pública, LAN con la puerta de enlace) en SVG; qué hace (enruta, NAT, DHCP, Wi-Fi, switch); entrar al panel; contraseña de administrador y credenciales por defecto; dónde se ve la IP pública.
- L26 **Configurar el router:** plan de la red (router, IP fijas, rango DHCP); SSID, clave, WPA2 y WPA3; rango DHCP y dispositivos conectados; reserva de IP por MAC (retoma la impresora del TP6), comprobada con `ipconfig /release` e `ipconfig /renew`; copia de seguridad. Esquema SVG del panel del TL-WR850N v3.
- Cada opción lleva al lado el recuadro "En el router del laboratorio", con la ruta en el TL-WR850N v3.
- "Para profundizar": la IP 169.254 cuando no hay DHCP; `ifconfig` en Linux; la IP pública en el laboratorio y port forwarding; control de acceso; firmware, reiniciar y reset de fábrica.
- `ping`, `tracert`, `nslookup` y `netstat` quedan para Redes II.

**TP9 · APIs REST y MQTT** (C, 13/10: antes "APIs REST", 3 láminas; MQTT sale del TP10 y entra acá)
- L27 **Cliente-servidor y API REST:** cliente (acento) y servidor (naranja), como en el TP7; qué es una API REST, qué es un recurso y qué es un endpoint. Esquema de la URL en partes: `https://` + dominio + ruta del recurso + parámetros después del `?`, con la URL de Open-Meteo (clima de Ushuaia).
- L28 **Verbos y códigos:** GET, POST, PUT y DELETE, cada uno con su acción. Códigos: se retoman 200, 404 y 500 del TP7 y se suman 201 y 400. Las API públicas solo dejan leer (GET): POST, PUT y DELETE se explican con la API inventada de la biblioteca de la escuela (`/libros`, `/libros/12`). No se usa la luz, que es el ejemplo del TP10.
- L29 **JSON y `fetch`:** sintaxis de JSON (objeto, clave y valor, textos, números, `true`/`false` y listas) y la receta fija: `async function`, `await fetch()`, `await respuesta.json()` y mostrar el dato en la página. Al lado de cada ejemplo, la salida esperada.
- L30 **MQTT:** qué es y para qué se usa (dispositivos como el ESP32); broker (Mosquitto, el del proyecto), publisher, subscriber y tópicos; puerto 1883. Cuadro HTTP vs MQTT: pedir/responder o publicar/suscribirse, conexión que se abre y se cierra o que queda abierta, mensaje pesado o liviano, cuándo conviene cada uno. Esquema SVG de publicar/suscribirse con el broker en el medio.
- Simulador "Petición real", en una hoja propia después de las láminas: el alumno elige un endpoint de DolarAPI, toca "Enviar GET" y ve la URL armada, el código (200 en verde, 404 en rojo), el JSON que llegó y el dato mostrado en la página. El 404 de DolarAPI se muestra tal cual: "404, sin JSON". Sin Internet o si la API falla: aviso claro, y queda a la vista el ejemplo resuelto escrito en el HTML.
- "Para profundizar", un bloque por lámina: CORS (por qué algunas API no responden desde el navegador), ver la petición con F12 › Red, por qué JSON reemplazó a XML y `.then()` solo nombrado, y un bloque de MQTT.
- Sin mini-juego.
- **API probadas** (13/10, desde la compu de Nicolás; falta la prueba en el colegio). Antes de escribir un ejemplo, se vuelve a pedir la API y se copia la respuesta real, sin inventar campos.
  - **DolarAPI** (`https://dolarapi.com/v1/dolares/oficial`): 200, permite CORS, JSON de 6 campos (`moneda`, `casa`, `nombre`, `compra`, `venta`, `fechaActualizacion`). Un recurso inventado da 404 vacío, sin JSON. Va en el simulador y en los ejemplos.
  - **Open-Meteo** (clima de Ushuaia): 200, sin clave, con parámetros `?latitude=…&longitude=…`. Va en el esquema de las partes de la URL de la lámina 27.
  - **PokéAPI:** 200, pero el JSON pesa unos 300 KB; un nombre mal escrito da 404 con un JSON corto. Solo como opción de la práctica.
  - **RestCountries:** contesta 301. No va.

**TP10 · Proyecto integrador YoLo** (C, 13/10)
- L31 **Mapa del proyecto:** la arquitectura navegador → servidor → broker MQTT → ESP32 → motores, qué protocolo va en cada tramo y el esquema de red.
- El resto del TP10 es todo práctica: una guía de 6 clases en la computadora. Nicolás les da una app web muy básica, que los alumnos reestructuran y diseñan con CSS a su gusto. Además usan GitHub y README (articula con Software II), configuran en el router una red Wi-Fi fija para el robot y prueban las conexiones con `ping`.
- **El cuadernillo no publica la solución.**

**TP11 · Seguridad en redes**
- L32 **Amenazas:** sniffing, spoofing, Man-in-the-Middle y DoS: cómo funciona cada una, qué daño causa y cómo se defiende.
- L33 **Firewall, DMZ y VPN:** qué hace cada uno y en qué parte de la red se ubica.
- L34 **HTTPS y Wi-Fi:** HTTP y HTTPS, certificados digitales; WPA2 y WPA3; riesgos de una red Wi-Fi pública.
- Caso integrador: el propio YoLo. ¿Qué le falta para ser seguro?

### TP1 a TP6: migración

El contenido ya está escrito y verificado. Fuente: las diapositivas de Gamma (exportadas a `.md` o PDF) y los .docx de actividades, en `_fuente/tpN/`. Es traducción de formato, no redacción nueva: respetar el texto y avisar los errores antes de corregir. La división en 3 láminas de la tabla es tentativa hasta ver las diapositivas.

## Práctica y entrega de cada TP (texto de Nicolás)

(C) = cambio sobre el detalle original.

- **TP1 a TP6.** Las actividades son las del .docx de cada TP, tal cual, pasadas a este formato. El caso integrador es el del .docx.
- **TP7.** (C) Une los TP7 y TP8 originales. Solo carpeta.
  - TCP y UDP: cuadro comparativo (orientación a conexión, confiabilidad, velocidad, control de flujo, casos de uso típicos); escenarios (videollamada, descarga de un archivo, streaming, juego online, envío de un email, consulta DNS), justificando qué protocolo conviene; dibujar el handshake de tres pasos.
  - Puertos: tabla con los puertos 80, 443, 21, 22, 25, 53 y 3306 y su protocolo o servicio.
  - HTTP: analizar una solicitud (método, URL, headers) y los códigos de estado 200, 301, 404 y 500.
  - Caso integrador: "Un alumno enciende su notebook, se conecta al Wi-Fi, abre el navegador, escribe una URL, navega, descarga un archivo y envía un email". Identificar qué protocolo de aplicación interviene en cada paso y en qué orden. Tabla con DNS, DHCP, HTTP, HTTPS, FTP, SSH y SMTP: función, puerto, si usa TCP o UDP y un ejemplo de uso. (C) La captura se lee del cuadernillo: identificar los protocolos presentes.
- **TP8.** (C, 9/10) Carpeta: un punto por lámina, sin caso integrador (10/10: se sacó la planilla de configuración). Computadora, individual: configurar el router en el simulador del panel (10/10), como práctica para el proyecto final. Reset de fábrica si ya se usó; entrar al panel y crear la contraseña de administrador; SSID y clave con WPA/WPA2 Personal; ver el rango DHCP y los dispositivos; reservar una IP para la PC y comprobarla con `ipconfig`; poner una IP fija en Windows; copia de seguridad. Entrega por Classroom: la captura del resumen del simulador, con todos los pasos en ✓.
- **TP9.** Carpeta: un punto por lámina (separar las partes de una URL, cuadro de verbos y códigos, leer un JSON y completar un `fetch`, cuadro HTTP vs MQTT) y el caso integrador: el recorrido botón → `fetch` → servidor → código → JSON → página, que cierra con el tramo siguiente: el servidor publica en MQTT y el ESP32 lo recibe. Sin cierre, como el TP8. Computadora: desarrollar en HTML + JavaScript una página que consuma al menos una API pública (C, 13/10: DolarAPI, PokéAPI mostrando solo algunos campos, u Open-Meteo; RestCountries sale porque contesta 301), con `fetch()`, procesando la respuesta JSON y mostrando los datos en la página, en pasos numerados. Entrega, con viñetas y sin casillas: carpeta en `.zip` por Classroom + informe breve (qué endpoints consumieron, qué métodos HTTP usaron y cómo procesaron la respuesta).
- **TP10.** (C, 13/10) Una sola lámina, el mapa del proyecto. El resto del TP10 es todo práctica: una guía de 6 clases en la computadora. Nicolás les da una app web muy básica, que los alumnos reestructuran y diseñan con CSS a su gusto. Además usan GitHub y README (articula con Software II), configuran en el router una red Wi-Fi fija para el robot y prueban las conexiones con `ping`. El cuadernillo no publica la solución. La tabla de clases se rearma cuando se haga el TP10. (C) "Identificar vulnerabilidades" pasa al TP11.
- **TP11.** Trabajo grupal: cada grupo toma una amenaza (sniffing, spoofing, Man-in-the-Middle, DoS) y explica cómo funciona, qué daño causa y qué defensas existen. Cuadro general de amenazas y contramedidas. Diagrama con la ubicación de firewall, DMZ y VPN. Diferencia entre HTTP y HTTPS y qué son los certificados digitales. WPA2, WPA3 y riesgos de las redes Wi-Fi públicas. (C) "Investigación" pasa a "explicación con el material". (C) Caso integrador sobre el YoLo.

## Orden de producción

TP7 → TP8 → TP9 → TP10 → TP11 → TP1 a TP6. Este ciclo se dictan primero los TP7 a TP10; el TP11 solo si sobra tiempo; los TP1 a TP6 se migran después, porque los alumnos ya los tienen en .docx. Mientras tanto, en el índice los TP1 a TP6 figuran con "Material en Classroom" y los demás con "Próximamente".

## Decisiones confirmadas (4/10)

- 11 TPs: TP1 a TP6 sin cambios; TCP/UDP y protocolos de aplicación en un solo TP7 de 5 láminas; después Diagnóstico, APIs REST, YoLo y, al final, Seguridad como soporte.
- Paleta verde azulada, parecida a la de Base de Datos I y tirando a verde. A prueba hasta que Nicolás vea el index (5/10).
- Portada con el formato de la de Programación y el nombre de la escuela (5/10).
- 3 láminas por TP (5 en el TP7). Actividades en una hoja.
- Simuladores. El cuadernillo linkea a la app de juegos.
- Wireshark: captura anotada de DNS y HTTP en el TP7.
- Panel del TP-Link en esquemas SVG.
- Versión paso a paso por TP, abierta a todos y sin nombres.
- YoLo: los alumnos completan endpoints y `fetch` (13/10: reemplazado, ver abajo).

## Decisiones confirmadas (9/10)

- TP8 pasa a "Configurando el router": la IP de la PC, cómo funciona un router y cómo configurarlo. Es individual y sirve de práctica para el proyecto final, donde cada grupo configura su router.
- Router del laboratorio: TP-Link TL-WR850N v3, panel en inglés (cada menú con su traducción al lado).
- `ping`, `tracert`, `nslookup` y `netstat` quedan para Redes II; `ping` se explica brevemente en el TP10.
- Las actividades no llevan cierre ("REALIZAR EN LA CARPETA." ni "Fecha límite").

## Decisiones confirmadas (13/10)

- TP9 pasa a "APIs REST y MQTT", con 4 láminas (27 a 30): MQTT sale del TP10 y entra acá.
- TP10 · Proyecto integrador YoLo: 1 lámina (31), el mapa del proyecto. El resto es práctica en la compu, en 6 clases.
- TP11 · Seguridad pasa a las láminas 32 a 34. Total: 34 láminas.
- El robot del proyecto se llama **YoLo** (antes "Yarvi").
- TP5: "Enrutamiento y NAT, PAT".
- `netstat` sale del TP10: pasó a Redes II.
- TP9: las API públicas van con su dominio real; la API inventada de la biblioteca, con un dominio inventado.

## Pendientes a consultar con Nicolás

- **TP9:** probar desde el colegio DolarAPI (simulador y ejemplos), Open-Meteo y PokéAPI.
- **TP9:** versión paso a paso (`tp09-pasos.html`), después de que Nicolás apruebe el texto. Solo conceptos, sin programar.
- **TP10:** copiar el .docx del YoLo y el código de la plantilla en `_fuente/tp10/`.
- **Paso a paso:** link del cuestionario de Google Forms de cada TP.
- **Simulador del router:** capturas de Backup & Restore y del formulario Add de Address Reservation (y, si se puede, de Administration) para cambiar las pantallas provisorias.

## Portada principal (5/10)

- `index.html` es la **portada principal**: REDES I, "5° Año • Cuadernillo Digital", el colegio, el docente y el botón "Entrar al cuadernillo". Sus estilos van dentro del mismo archivo. **No se toca** salvo que Nicolás lo pida.
- `indice.html` es el **índice de TPs** (antes era `index.html`). Todo lo que este archivo dice sobre "el índice", "la portada con los TPs" o `index.html` se aplica ahora a `indice.html`.
- En cada TP, el botón "Índice" apunta a `../indice.html`. Lo mismo en las páginas `tpNN-pasos.html`.
- Al terminar un TP, se activa en `indice.html`.
- En la portada, el contenedor de "5° Año • Cuadernillo Digital" usa fondo `--acento-numero` con texto blanco (3,6:1, solo para ese texto grande).
