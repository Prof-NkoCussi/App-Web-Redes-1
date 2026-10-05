/* ==========================================================
   Base de Datos I — actividades.js
   Parte técnica común a todos los TPs:
   - Botón "Guardar PDF" (impresión del navegador en A4)
   - Marca la parte visible en la barra (láminas · Para profundizar · Actividades)
   - Recuerda qué TPs se abrieron (solo en este dispositivo)
   Nada se envía a ningún servidor.
   ========================================================== */
(function () {
  "use strict";

  var CLAVE = "bd1:tp-visto-";

  /* ---- Guardado local seguro (puede no estar disponible) ---- */
  function guardar(clave, valor) {
    try { window.localStorage.setItem(clave, valor); } catch (e) { /* sin almacenamiento */ }
  }
  function leer(clave) {
    try { return window.localStorage.getItem(clave); } catch (e) { return null; }
  }

  /* ---- Página de TP: registrar visita ---- */
  var tp = document.body.getAttribute("data-tp");
  if (tp) { guardar(CLAVE + tp, "1"); }

  /* ---- Índice: mostrar TPs ya abiertos ---- */
  var marcas = document.querySelectorAll("[data-visto]");
  Array.prototype.forEach.call(marcas, function (marca) {
    if (leer(CLAVE + marca.getAttribute("data-visto")) === "1") {
      marca.hidden = false;
    }
  });

  /* ---- Botón "Guardar PDF": lo genera el navegador (hoja A4) ---- */
  var botones = document.querySelectorAll("[data-imprimir]");
  Array.prototype.forEach.call(botones, function (boton) {
    boton.addEventListener("click", function () { window.print(); });
  });

  /* ---- Barra de partes: resaltar la sección visible ---- */
  var enlaces = document.querySelectorAll(".partes a[href^='#']");
  if (!enlaces.length || !("IntersectionObserver" in window)) { return; }

  var porId = {};
  Array.prototype.forEach.call(enlaces, function (a) {
    porId[a.getAttribute("href").slice(1)] = a;
  });

  function marcar(id) {
    Array.prototype.forEach.call(enlaces, function (a) {
      a.setAttribute("aria-current", a === porId[id] ? "true" : "false");
    });
    var activo = porId[id];
    var barra = activo && activo.parentNode;
    if (barra && barra.scrollWidth > barra.clientWidth) {
      barra.scrollLeft = activo.offsetLeft - 16;
    }
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { marcar(e.target.id); }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  Object.keys(porId).forEach(function (id) {
    var seccion = document.getElementById(id);
    if (seccion) { observador.observe(seccion); }
  });
})();
