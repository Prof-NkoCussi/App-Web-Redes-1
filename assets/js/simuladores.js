/* ==========================================================
   Redes I — simuladores.js
   Un simulador por TP. Cada uno arranca solo si su sección está en la página.
   Sin el script se ve el ejemplo resuelto que está escrito en el HTML.
   ========================================================== */
(function () {
  "use strict";

  /* ==========================================================
     TP7 · Resolución DNS paso a paso
     ========================================================== */
  function simuladorDns(sim) {
    var SERVIDOR_DNS = "8.8.8.8";
    /* Dominio inventado del cuadernillo; cualquier otro nombre recibe una IP de ejemplo */
    var CONOCIDOS = { "www.redesdelaula.com": "203.0.113.10", "redesdelaula.com": "203.0.113.10" };
    /* Terminaciones que el servidor raíz "conoce" en la simulación */
    var TERMINACIONES = ["com", "net", "org", "edu", "gov", "info", "io", "app", "dev", "ar", "uy", "cl", "py", "bo",
      "br", "mx", "es", "co", "pe", "ve", "ec", "us", "uk", "de", "fr", "it", "tv", "me", "ai", "online", "site", "xyz"];
    /* Terminaciones de dos partes: el dominio tiene tres (redesdelaula.com.ar) */
    var DE_DOS = ["com.ar", "gob.ar", "edu.ar", "org.ar", "net.ar", "com.uy", "com.br", "com.mx", "co.uk", "com.co", "com.pe"];

    var form = sim.querySelector(".sim__form");
    var campo = sim.querySelector("#sim-nombre");
    var lista = sim.querySelector(".sim__pasos");
    var estado = sim.querySelector(".sim__estado");
    var btnSiguiente = sim.querySelector("[data-sim-siguiente]");
    var btnTodo = sim.querySelector("[data-sim-todo]");
    var cachePc = {}, cacheDns = {};
    var pasos = [], mostrados = 0;

    /* ---- Validación del nombre ---- */
    function error(nombre) {
      if (!nombre) { return "Escribí un nombre, por ejemplo www.redesdelaula.com."; }
      if (/\s/.test(nombre)) { return "El nombre no puede tener espacios."; }
      if (!/^[a-z0-9.-]+$/.test(nombre)) { return "Usá solo letras sin tilde, números, guiones y puntos."; }
      if (nombre.indexOf(".") === -1) { return "Falta la terminación: por ejemplo, .com o .ar."; }
      if (nombre.length > 253) { return "El nombre es demasiado largo."; }
      var partes = nombre.split(".");
      for (var i = 0; i < partes.length; i++) {
        if (!partes[i]) { return "Hay dos puntos seguidos, o un punto al principio o al final."; }
        if (partes[i].length > 63) { return "Cada parte del nombre puede tener hasta 63 caracteres."; }
        if (partes[i].charAt(0) === "-" || partes[i].charAt(partes[i].length - 1) === "-") { return "Una parte del nombre no puede empezar ni terminar con guion."; }
      }
      if (!/^[a-z]+$/.test(partes[partes.length - 1])) { return "La terminación lleva solo letras, como .com o .ar."; }
      if (DE_DOS.indexOf(nombre) !== -1) { return "Falta el nombre del dominio: por ejemplo, redesdelaula." + nombre + "."; }
      return "";
    }

    function dominioDe(nombre) {
      var p = nombre.split(".");
      var cuantas = (p.length >= 3 && DE_DOS.indexOf(p.slice(-2).join(".")) !== -1) ? 3 : 2;
      return p.slice(-cuantas).join(".");
    }

    /* IP de ejemplo, siempre la misma para un mismo nombre (rango 203.0.113.0/24, de documentación) */
    function ipDe(nombre) {
      if (CONOCIDOS[nombre]) { return CONOCIDOS[nombre]; }
      var h = 0;
      for (var i = 0; i < nombre.length; i++) { h = (h * 31 + nombre.charCodeAt(i)) % 9973; }
      return "203.0.113." + (20 + h % 230);
    }

    /* ---- Los pasos de una resolución ---- */
    function armarPasos(nombre) {
      var p = [];
      var ip = ipDe(nombre);
      var terminacion = nombre.split(".").pop();
      var dominio = dominioDe(nombre);
      var pregunta = "¿Cuál es la IP de " + nombre + "?";
      function paso(tipo, de, a, msg, red, hacer) { p.push({ tipo: tipo, de: de, a: a, msg: msg, red: red, hacer: hacer }); }

      if (cachePc[nombre]) {
        paso("ok", "PC", "", "Busca " + nombre + " en su caché: está. La IP es " + cachePc[nombre] + ". No hace falta preguntar.");
        return p;
      }
      paso("local", "PC", "", "Busca " + nombre + " en su caché: no está.");
      paso("pide", "PC", "Servidor DNS (" + SERVIDOR_DNS + ")", pregunta, true);
      if (cacheDns[nombre]) {
        paso("local", "Servidor DNS", "", "Busca en su caché: está. No tiene que preguntarle a nadie más.");
        paso("responde", "Servidor DNS", "PC", "Es " + cacheDns[nombre] + ".", true);
        paso("ok", "PC", "", "Guarda la IP en su caché. Ya puede conectarse a " + cacheDns[nombre] + ".", false, function () { cachePc[nombre] = cacheDns[nombre]; });
        return p;
      }
      paso("local", "Servidor DNS", "", "Busca en su caché: no está. Tiene que averiguarla.");
      paso("pide", "Servidor DNS", "Servidor raíz", pregunta, true);
      if (TERMINACIONES.indexOf(terminacion) === -1) {
        paso("error", "Servidor raíz", "Servidor DNS", "No existe ninguna terminación ." + terminacion + ": ese nombre no existe.", true);
        paso("error", "Servidor DNS", "PC", "Ese nombre no existe. El navegador muestra un error y no abre ninguna página.", true);
        return p;
      }
      paso("responde", "Servidor raíz", "Servidor DNS", "No la sé. Preguntale al servidor de ." + terminacion + ".", true);
      paso("pide", "Servidor DNS", "Servidor de ." + terminacion, pregunta, true);
      paso("responde", "Servidor de ." + terminacion, "Servidor DNS", "No la sé. Preguntale al servidor de " + dominio + ".", true);
      paso("pide", "Servidor DNS", "Servidor de " + dominio, pregunta, true);
      paso("responde", "Servidor de " + dominio, "Servidor DNS", "Es " + ip + ".", true);
      paso("responde", "Servidor DNS", "PC", "Es " + ip + ". Antes, la guarda en su caché.", true, function () { cacheDns[nombre] = ip; });
      paso("ok", "PC", "", "Guarda la IP en su caché. Ya puede conectarse a " + ip + ".", false, function () { cachePc[nombre] = ip; });
      return p;
    }

    /* ---- Dibujo ---- */
    function itemPaso(p) {
      var li = document.createElement("li");
      li.className = "sim__paso sim__paso--" + p.tipo;
      li.hidden = true;
      var quien = document.createElement("p");
      quien.className = "sim__quien";
      quien.appendChild(document.createTextNode(p.de));
      if (p.a) {
        var flecha = document.createElement("span");
        flecha.setAttribute("aria-hidden", "true");
        flecha.textContent = " → ";
        var a = document.createElement("span");
        a.className = "sr-only";
        a.textContent = " a ";
        quien.appendChild(flecha);
        quien.appendChild(a);
        quien.appendChild(document.createTextNode(p.a));
      }
      var msg = document.createElement("p");
      msg.className = "sim__msg";
      msg.appendChild(document.createTextNode(p.msg));
      if (p.red) {
        var etq = document.createElement("span");
        etq.className = "etq etq--udp";
        etq.textContent = "UDP 53";
        msg.appendChild(document.createTextNode(" "));
        msg.appendChild(etq);
      }
      li.appendChild(quien);
      li.appendChild(msg);
      return li;
    }

    function dibujarCache(clave, cache) {
      var ul = sim.querySelector("[data-cache='" + clave + "']");
      ul.textContent = "";
      var nombres = Object.keys(cache);
      if (!nombres.length) {
        var vacia = document.createElement("li");
        vacia.className = "sim__vacia";
        vacia.textContent = "Vacía";
        ul.appendChild(vacia);
      }
      nombres.forEach(function (n) {
        var li = document.createElement("li");
        li.textContent = n + " → " + cache[n];
        ul.appendChild(li);
      });
    }

    function dibujarCaches() {
      dibujarCache("pc", cachePc);
      dibujarCache("dns", cacheDns);
    }

    function avisar(texto, esError) {
      estado.textContent = texto;
      estado.classList.toggle("sim__estado--error", !!esError);
    }

    function textoPaso(p) {
      return p.de + (p.a ? " a " + p.a : "") + ": " + p.msg;
    }

    function actualizarBotones() {
      var quedan = mostrados < pasos.length;
      btnSiguiente.disabled = !quedan;
      btnTodo.disabled = !quedan;
    }

    function mostrar(i, animar) {
      var p = pasos[i];
      var li = lista.children[i];
      li.hidden = false;
      li.classList.toggle("sim__paso--nuevo", !!animar);
      if (p.hacer) { p.hacer(); }
    }

    function siguiente() {
      if (mostrados >= pasos.length) { return; }
      mostrar(mostrados, true);
      mostrados++;
      dibujarCaches();
      var p = pasos[mostrados - 1];
      var fin = mostrados === pasos.length ? " Listo." : "";
      avisar("Paso " + mostrados + " de " + pasos.length + ". " + textoPaso(p) + fin, p.tipo === "error");
      actualizarBotones();
    }

    function todo(anunciar) {
      while (mostrados < pasos.length) {
        mostrar(mostrados, false);
        mostrados++;
      }
      dibujarCaches();
      actualizarBotones();
      if (anunciar) {
        var ultimo = pasos[pasos.length - 1];
        avisar("Se muestran los " + pasos.length + " pasos. " + textoPaso(ultimo), ultimo.tipo === "error");
      }
    }

    function empezar(nombre) {
      pasos = armarPasos(nombre);
      mostrados = 0;
      lista.textContent = "";
      pasos.forEach(function (p) { lista.appendChild(itemPaso(p)); });
    }

    function resolver(nombre) {
      var limpio = nombre.trim().toLowerCase().replace(/\.$/, "");
      var falla = error(limpio);
      if (falla) {
        campo.setAttribute("aria-invalid", "true");
        avisar(falla, true);
        return;
      }
      campo.removeAttribute("aria-invalid");
      campo.value = limpio;
      empezar(limpio);
      siguiente();
    }

    /* ---- Eventos ---- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      resolver(campo.value);
    });
    btnSiguiente.addEventListener("click", siguiente);
    btnTodo.addEventListener("click", function () { todo(true); });
    Array.prototype.forEach.call(sim.querySelectorAll("[data-nombre]"), function (b) {
      b.addEventListener("click", function () {
        campo.value = b.getAttribute("data-nombre");
        resolver(campo.value);
      });
    });
    Array.prototype.forEach.call(sim.querySelectorAll("[data-vaciar]"), function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-vaciar") === "pc") { cachePc = {}; } else { cacheDns = {}; }
        dibujarCaches();
        avisar(b.getAttribute("data-vaciar") === "pc" ? "Se vació la caché de la PC." : "Se vació la caché del servidor DNS.");
      });
    });

    /* ---- Estado inicial: el mismo ejemplo resuelto que está escrito en el HTML ---- */
    Array.prototype.forEach.call(sim.querySelectorAll("[data-sim-js]"), function (el) { el.hidden = false; });
    empezar(campo.value);
    todo(false);
  }

  var dns = document.querySelector("[data-sim='dns']");
  if (dns) { simuladorDns(dns); }
})();
