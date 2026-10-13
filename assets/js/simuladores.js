/* ==========================================================
   Redes I — simuladores.js
   Un simulador por TP. Cada uno arranca solo si su sección está en la página.
   Sin el script se ve el ejemplo resuelto que está escrito en el HTML.
   ========================================================== */
(function () {
  "use strict";

  /* ---- Datos comunes a los simuladores ---- */
  /* Dominio inventado del cuadernillo; cualquier otro nombre recibe una IP de ejemplo */
  var CONOCIDOS = { "www.redesdelaula.com": "203.0.113.10", "redesdelaula.com": "203.0.113.10" };
  /* Terminaciones que el servidor raíz "conoce" en la simulación */
  var TERMINACIONES = ["com", "net", "org", "edu", "gov", "info", "io", "app", "dev", "ar", "uy", "cl", "py", "bo",
    "br", "mx", "es", "co", "pe", "ve", "ec", "us", "uk", "de", "fr", "it", "tv", "me", "ai", "online", "site", "xyz"];

  /* IP de ejemplo, siempre la misma para un mismo nombre (rango 203.0.113.0/24, de documentación) */
  function ipDe(nombre) {
    if (CONOCIDOS[nombre]) { return CONOCIDOS[nombre]; }
    var h = 0;
    for (var i = 0; i < nombre.length; i++) { h = (h * 31 + nombre.charCodeAt(i)) % 9973; }
    return "203.0.113." + (20 + h % 230);
  }

  /* ==========================================================
     TP7 · Resolución DNS paso a paso
     ========================================================== */
  function simuladorDns(sim) {
    var SERVIDOR_DNS = "8.8.8.8";
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

  /* ==========================================================
     TP9 · Petición real: un GET a DolarAPI
     ========================================================== */
  function simuladorApi(sim) {
    var BASE = "https://dolarapi.com";
    var ESPERA = 10000;   /* milisegundos sin respuesta antes de dar el pedido por perdido */
    /* El nombre de cada código: con HTTP/2 el navegador no lo trae */
    var TEXTOS = { 200: "OK", 201: "Created", 400: "Bad Request", 403: "Forbidden", 404: "Not Found",
      429: "Too Many Requests", 500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable" };
    /* Partes de un JSON: texto (y si sigue ":", clave), número, true/false/null */
    var FICHAS = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

    var form = sim.querySelector(".sim__form");
    var select = sim.querySelector("#sim-endpoint");
    var estado = sim.querySelector(".sim__estado");
    var ejemplo = sim.querySelector(".api").cloneNode(true);   /* el ejemplo resuelto escrito en el HTML */
    var pedido = 0;

    function parte(nombre) { return sim.querySelector("[data-api='" + nombre + "']"); }

    function avisar(texto, esError) {
      estado.textContent = texto;
      estado.classList.toggle("sim__estado--error", !!esError);
    }

    function nombreCodigo(status) { return status + (TEXTOS[status] ? " " + TEXTOS[status] : ""); }

    /* ---- Dibujo de cada parte ---- */
    function ponerUrl(ruta) {
      var p = parte("url");
      var verbo = document.createElement("b");
      var resto = document.createElement("span");
      verbo.textContent = "GET";
      resto.className = "api__ruta";
      resto.textContent = ruta;
      p.textContent = "";
      p.appendChild(verbo);
      p.appendChild(document.createTextNode(" " + BASE));
      p.appendChild(resto);
    }

    function ponerCodigo(status) {
      var p = parte("codigo");
      var num = document.createElement("b");
      var txt = document.createElement("span");
      p.className = "api__codigo" + (status === null ? "" : status < 300 ? " grupo grupo--ok" : status >= 400 ? " grupo grupo--error" : " grupo");
      num.textContent = status === null ? "…" : String(status);
      txt.textContent = status === null ? "esperando" : (TEXTOS[status] || "");
      p.textContent = "";
      p.appendChild(num);
      p.appendChild(txt);
    }

    function pintarJson(pre, texto) {
      var desde = 0, m, ficha;
      pre.textContent = "";
      FICHAS.lastIndex = 0;
      while ((m = FICHAS.exec(texto)) !== null) {
        if (m.index > desde) { pre.appendChild(document.createTextNode(texto.slice(desde, m.index))); }
        ficha = document.createElement(m[4] ? "b" : "span");
        if (m[1]) { ficha.className = m[2] ? "t-atr" : "t-str"; ficha.textContent = m[1]; }
        else if (m[3]) { ficha.className = "t-num"; ficha.textContent = m[3]; }
        else { ficha.textContent = m[4]; }
        pre.appendChild(ficha);
        if (m[2]) { pre.appendChild(document.createTextNode(m[2])); }
        desde = FICHAS.lastIndex;
      }
      pre.appendChild(document.createTextNode(texto.slice(desde)));
    }

    function ponerSinJson(pre, status, texto) {
      var aviso = document.createElement("span");
      aviso.className = "api__sin-json";
      aviso.textContent = status + ", sin JSON";
      pre.textContent = "";
      pre.appendChild(aviso);
      pre.appendChild(document.createTextNode(texto ? "\nLlegó un texto que no es JSON:\n" + texto.slice(0, 300) : "\nLa respuesta llegó vacía."));
    }

    function ponerCon(campos, fin) {
      var con = parte("con");
      con.textContent = "Con ";
      campos.forEach(function (c, i) {
        if (i > 0) { con.appendChild(document.createTextNode(i === campos.length - 1 ? " y " : ", ")); }
        var code = document.createElement("code");
        code.textContent = c;
        con.appendChild(code);
      });
      con.appendChild(document.createTextNode(fin || "."));
    }

    function esDolar(d) { return !!d && typeof d === "object" && "nombre" in d && "compra" in d && "venta" in d; }

    /* Muestra el dato en "la página", como la receta de la lámina 29. Devuelve si pudo. */
    function ponerPagina(status, datos) {
      var caja = parte("pagina");
      var p = document.createElement("p");
      caja.textContent = "";
      caja.classList.remove("api__pagina--vacia");
      if (status === 200 && Array.isArray(datos) && datos.length && datos.every(esDolar)) {
        var ul = document.createElement("ul");
        datos.forEach(function (d) {
          var li = document.createElement("li");
          li.textContent = d.nombre + ": venta $" + d.venta;
          ul.appendChild(li);
        });
        caja.appendChild(ul);
        ponerCon(["datos[0].nombre", "datos[0].venta"], ", y lo mismo con cada objeto de la lista.");
        return true;
      }
      if (status === 200 && esDolar(datos)) {
        p.textContent = "Dólar " + datos.nombre + ": compra $" + datos.compra + " · venta $" + datos.venta;
        caja.appendChild(p);
        ponerCon(["datos.nombre", "datos.compra", "datos.venta"]);
        return true;
      }
      caja.classList.add("api__pagina--vacia");
      p.textContent = status === 404 ? "No hay ningún dato para mostrar: el recurso no existe." : "No hay ningún dato para mostrar.";
      caja.appendChild(p);
      parte("con").textContent = datos === null ? "Sin JSON, no hay ningún objeto datos para leer." : "Llegó un JSON, pero no trae los campos nombre, compra y venta.";
      return false;
    }

    /* ---- La respuesta ---- */
    function mostrarRespuesta(status, texto) {
      var limpio = texto.trim();
      var datos = null;
      if (limpio) {
        try { datos = JSON.parse(limpio); } catch (e) { datos = null; }
      }
      ponerCodigo(status);
      if (datos !== null) { pintarJson(parte("json"), limpio); } else { ponerSinJson(parte("json"), status, limpio); }
      var mostro = ponerPagina(status, datos);
      parte("ejemplo").textContent = "Respuesta real, recién llegada de DolarAPI.";

      var linea = "Llegó la respuesta: " + nombreCodigo(status) + ". ";
      if (mostro) {
        linea += Array.isArray(datos) ? "El JSON es una lista de " + datos.length + " objetos." : "El JSON trae " + Object.keys(datos).length + " campos, y la página muestra el dato.";
      } else if (status === 404) {
        linea += datos === null ? "Ese recurso no existe: la respuesta llegó vacía, sin JSON." : "Ese recurso no existe.";
      } else if (status >= 500) {
        linea += "Falló el servidor de DolarAPI. Probá de nuevo en un rato.";
      } else {
        linea += "No llegó el dato esperado.";
      }
      avisar(linea, !mostro);
    }

    function volverAlEjemplo() {
      var actual = sim.querySelector(".api");
      actual.parentNode.replaceChild(ejemplo.cloneNode(true), actual);
      avisar("No llegó ninguna respuesta de DolarAPI: puede faltar Internet o la API puede estar caída. Abajo queda el ejemplo resuelto del cuadernillo.", true);
    }

    function enviar() {
      var ruta = select.value;
      var url = BASE + ruta;
      var este = ++pedido;
      var control = typeof AbortController === "function" ? new AbortController() : null;
      var reloj = setTimeout(function () { if (control) { control.abort(); } }, ESPERA);

      /* Si antes falló y quedó el ejemplo, se sigue dibujando sobre él */
      ponerUrl(ruta);
      ponerCodigo(null);
      parte("json").textContent = "Esperando la respuesta…";
      parte("pagina").textContent = "";
      parte("con").textContent = "";
      parte("ejemplo").textContent = "Pedido en curso…";
      avisar("Enviando GET a " + url + "…");

      fetch(url, control ? { cache: "no-store", signal: control.signal } : { cache: "no-store" })
        .then(function (r) {
          return r.text().then(function (texto) { return { status: r.status, texto: texto }; });
        })
        .then(function (res) {
          clearTimeout(reloj);
          if (este === pedido) { mostrarRespuesta(res.status, res.texto); }
        }, function () {
          clearTimeout(reloj);
          if (este === pedido) { volverAlEjemplo(); }
        });
    }

    /* Sin fetch (navegador muy viejo) queda solo el ejemplo resuelto */
    if (typeof window.fetch !== "function") { return; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      enviar();
    });
    Array.prototype.forEach.call(sim.querySelectorAll("[data-sim-js]"), function (el) { el.hidden = false; });
  }

  var dns = document.querySelector("[data-sim='dns']");
  if (dns) { simuladorDns(dns); }
  var api = document.querySelector("[data-sim='api']");
  if (api) { simuladorApi(api); }
})();
