# Redes I · Cuadernillo web

Cuadernillo de actividades de **Redes I** (5.º año)

Técnico en Programación · C.T.P. "Olga B. de Arko" · Ushuaia

**Prof. Nicolás A. Cussi**

👉 **Entrá acá:** https://prof-nkocussi.github.io/App-Web-Redes-1/

## Qué es

Una versión web del cuadernillo de Redes I, pensada para leer desde la computadora o el celular. Está organizada en trabajos prácticos (TP). Cada TP tiene:

1. **Láminas** con la teoría, una por tema.
2. **Simulador** (en los TPs que lo tienen): una parte interactiva para probar lo que se ve en las láminas.
3. **Para profundizar**: una página que amplía cada lámina con ejemplos.
4. **Actividades para hacer en la carpeta** y, en los TP8, TP9 y TP10, también **en la computadora**.
5. **Paso a paso**: el mismo tema en formato guiado, un paso por pantalla.

## Cómo se usa

- Abrí el link y elegí un TP en el índice.
- Con la barra de arriba saltás a cada lámina, al simulador, a "Para profundizar", a las actividades o al paso a paso.
- El botón **PDF** guarda el TP en hojas A4 (usa la opción de imprimir del navegador: elegí "Guardar como PDF").
- El índice marca con **✓ Visto** los TPs que ya abriste. Eso se guarda solo en tu dispositivo.

## Contenidos

| TP | Tema | Estado |
|---|---|---|
| **Unidad 1 · Fundamentos, infraestructura y direccionamiento** | | |
| 1 | Señales, medios de transmisión y topologías | Material en Classroom |
| 2 | Clasificación de redes, componentes y diseño de una red escolar | Material en Classroom |
| 3 | Cableado 568A/568B y modelos OSI y TCP/IP | Material en Classroom |
| 4 | Direccionamiento IPv4, subnetting e IPv6 | Material en Classroom |
| 5 | Enrutamiento y NAT, PAT | Material en Classroom |
| 6 | Recursos compartidos en red | Material en Classroom |
| **Unidad 2 · Protocolos, seguridad y aplicaciones** | | |
| 7 | Transporte y protocolos de aplicación | ✅ Disponible |
| 8 | Configurando el router | ✅ Disponible |
| 9 | APIs REST | Próximamente |
| 10 | Proyecto integrador Yarvi | Próximamente |
| 11 | Seguridad en redes | Próximamente |

## Estructura del repositorio

```
index.html                  portada e índice de TPs
unidades/tpNN.html          una página por TP
unidades/tpNN-pasos.html    versión paso a paso de cada TP
assets/css/estilos.css      estilos y paleta de colores
assets/js/actividades.js    botón PDF, barra de navegación y marca de "Visto"
assets/js/simuladores.js    simuladores
assets/fonts/               tipografías
assets/img/                 imágenes
REGLAS.md                   criterios con los que se arma el cuadernillo
```

Es un sitio estático: HTML, CSS y JavaScript, sin instalación ni servidor. Para verlo en tu computadora, descargá el repositorio y abrí `index.html` en el navegador.

## Créditos

- Contenido y adaptación: Prof. Nicolás A. Cussi.
- Tipografías Barlow, Barlow Semi Condensed y Barlow Condensed, bajo licencia SIL Open Font License (ver `assets/fonts/OFL.txt`).
