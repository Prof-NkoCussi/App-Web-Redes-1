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
     TP8 · ping y tracert, con la salida de Windows en español
     ========================================================== */
  function simuladorPing(sim) {
    var PROMPT = "C:\\Users\\Alumno>";
    var PC = "192.168.1.25", PC_NOMBRE = "PC-ALUMNO";
    var PUERTA = "192.168.1.1", COMPANERO = "192.168.1.30";
    /* Servidor de ejemplo que está apagado: no responde */
    var APAGADO = "203.0.113.250";
    /* Routers del proveedor entre la puerta de enlace y el destino (rango de documentación) */
    var PROVEEDOR = ["203.0.113.1", "203.0.113.65", "203.0.113.129"];
    /* Nombres que se conocen por su IP (tracert los muestra) */
    var NOMBRE_DE = { "8.8.8.8": "dns.google" };
    /* Tiempo de ida y vuelta (ms) de los destinos de las láminas; los demás salen de su IP */
    var TIEMPO_DE = { "203.0.113.10": 34, "8.8.8.8": 40 };
    /* Tiempos de los saltos 1 a 4 (puerta de enlace y routers del proveedor), como en la lámina 25 */
    var TIEMPO_SALTO = [0, 7, 14, 31];
    var SALTOS_MAX = 30;

    var form = sim.querySelector(".sim__form");
    var campo = sim.querySelector("#sim-destino");
    var salida = sim.querySelector("[data-salida]");
    var estado = sim.querySelector(".sim__estado");
    var temporizador = null;

    /* ---- Formato de la salida ---- */
    function relleno(texto, ancho) {
      texto = String(texto);
      while (texto.length < ancho) { texto = " " + texto; }
      return texto;
    }
    /* Un tiempo de tracert: "    <1 ms", "    12 ms" o "     *   " (9 caracteres) */
    function tiempoSalto(t) {
      if (t === null) { return "     *   "; }
      return relleno(t < 1 ? "<1" : t, 6) + " ms";
    }
    function lineaSalto(n, tiempos, equipo) {
      return relleno(n, 3) + tiempos.map(tiempoSalto).join("") + "  " + equipo;
    }
    function sorteo(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

    /* ---- Qué hay en cada destino ---- */
    function esIp(texto) {
      if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(texto)) { return false; }
      return texto.split(".").every(function (n) { return Number(n) <= 255; });
    }
    function esPrivada(p) {
      return p[0] === 10 || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || (p[0] === 169 && p[1] === 254);
    }

    /* Devuelve el destino: su IP, el nombre que tiene, cómo responde y por dónde pasa */
    function buscar(texto) {
      var minus = texto.toLowerCase();
      var d = { escrito: texto, ip: "", nombre: "", inverso: "", caso: "", ttl: 0, rango: [0, 0], camino: [] };
      if (minus === "localhost" || minus === "::1") {
        d.ip = "::1"; d.nombre = minus === "localhost" ? PC_NOMBRE : ""; d.inverso = PC_NOMBRE; d.caso = "propia";
        return d;
      }
      if (minus.indexOf(":") !== -1 && /^[0-9a-f:.%]+$/.test(minus)) {
        d.caso = "ipv6";
        return d;
      }
      if (esIp(texto)) {
        d.ip = texto.split(".").map(Number).join(".");
      } else if (minus === "dns.google") {
        d.ip = "8.8.8.8"; d.nombre = texto;
      } else if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(minus) && TERMINACIONES.indexOf(minus.split(".").pop()) !== -1) {
        d.ip = ipDe(minus); d.nombre = texto;
      } else {
        d.caso = "sin-nombre";
        return d;
      }
      var p = d.ip.split(".").map(Number);
      if (NOMBRE_DE[d.ip]) { d.inverso = NOMBRE_DE[d.ip]; }
      if (p[0] === 0 || p[0] >= 224) {
        d.caso = "error-general"; d.codigo = p[0] === 0 ? 1214 : 1232;
      } else if (p[0] === 127 || d.ip === PC) {
        d.caso = "propia"; d.ttl = 128; d.inverso = PC_NOMBRE;
      } else if (d.ip === PUERTA) {
        d.caso = "responde"; d.ttl = 64; d.rango = [1, 3]; d.camino = [];
      } else if (d.ip === COMPANERO) {
        d.caso = "responde"; d.ttl = 128; d.rango = [0, 1]; d.camino = [];
      } else if (p[0] === 192 && p[1] === 168 && p[2] === 1) {
        d.caso = p[3] === 255 ? "no-responde" : "inaccesible"; d.ultimoSalto = 0;
      } else if (esPrivada(p)) {
        d.caso = "no-responde"; d.camino = [PUERTA]; d.ultimoSalto = 1;
      } else if (d.ip === APAGADO) {
        d.caso = "no-responde"; d.camino = [PUERTA].concat(PROVEEDOR); d.ultimoSalto = 4;
      } else {
        /* Destino en Internet: 4 routers hasta llegar, y cada uno le resta 1 al TTL (64) */
        var base = TIEMPO_DE[d.ip] || 34 + (p[3] * 7 + p[2]) % 26;
        d.caso = "responde"; d.ttl = 64 - 4; d.rango = [base, base + 3]; d.camino = [PUERTA].concat(PROVEEDOR);
      }
      return d;
    }

    /* ---- La salida de cada comando: una lista de renglones { texto, clase } ---- */
    function ping(d) {
      var r = [];
      function linea(texto, clase) { r.push({ texto: texto, clase: clase || "" }); }
      if (d.caso === "ipv6") { return null; }
      if (d.caso === "sin-nombre") {
        linea("La solicitud de ping no pudo encontrar el host " + d.escrito + ". Compruebe el nombre y", "t-error");
        linea("vuelva a intentarlo.", "t-error");
        return { renglones: r, tipo: "error", resumen: "El nombre no se resuelve: no se encontró ninguna IP para «" + d.escrito + "». Está mal escrito o falla el DNS. No se envió ningún paquete." };
      }
      linea("");
      linea("Haciendo ping a " + (d.nombre ? d.nombre + " [" + d.ip + "]" : d.ip) + " con 32 bytes de datos:");
      var tiempos = [], recibidos = 0;
      for (var i = 0; i < 4; i++) {
        if (d.caso === "responde" || d.caso === "propia") {
          var t = d.caso === "propia" ? 0 : sorteo(d.rango[0], d.rango[1]);
          tiempos.push(t);
          recibidos++;
          var tiempo = t < 1 ? "tiempo<1m" : "tiempo=" + t + "ms";
          linea(d.ip === "::1" ? "Respuesta desde ::1: " + tiempo + " " : "Respuesta desde " + d.ip + ": bytes=32 " + tiempo + " TTL=" + d.ttl, "t-ok");
        } else if (d.caso === "inaccesible") {
          recibidos++;
          linea("Respuesta desde " + PC + ": Host de destino inaccesible.", "t-error");
        } else if (d.caso === "error-general") {
          linea("PING: error en la transmisión. Error general. ", "t-error");
        } else {
          linea("Tiempo de espera agotado para esta solicitud.", "t-error");
        }
      }
      var perdidos = 4 - recibidos;
      linea("");
      linea("Estadísticas de ping para " + d.ip + ":");
      linea("    Paquetes: enviados = 4, recibidos = " + recibidos + ", perdidos = " + perdidos);
      linea("    (" + (perdidos * 25) + "% perdidos),");
      if (tiempos.length) {
        var suma = tiempos.reduce(function (a, b) { return a + b; }, 0);
        linea("Tiempos aproximados de ida y vuelta en milisegundos:");
        linea("    Mínimo = " + Math.min.apply(null, tiempos) + "ms, Máximo = " + Math.max.apply(null, tiempos) + "ms, Media = " + Math.floor(suma / 4) + "ms");
      }
      var resumen = {
        "responde": ["ok", "El destino responde: 4 enviados, 4 recibidos, 0 perdidos (0% perdidos)."],
        "propia": ["ok", "Responde la propia PC: TCP/IP funciona en esta PC."],
        "no-responde": ["error", "El destino no responde: se perdieron los 4 paquetes (100% perdidos)."],
        "inaccesible": ["error", "Ningún equipo de la red tiene la IP " + d.ip + ". «Host de destino inaccesible» lo responde la propia PC (" + PC + "): aunque diga «recibidos = 4», el destino no respondió."],
        "error-general": ["error", "Esa dirección no sirve como destino: Windows no puede enviar el ping."]
      }[d.caso];
      return { renglones: r, tipo: resumen[0], resumen: resumen[1] };
    }

    function tracert(d) {
      var r = [];
      function linea(texto, clase) { r.push({ texto: texto, clase: clase || "" }); }
      if (d.caso === "ipv6") { return null; }
      if (d.caso === "sin-nombre") {
        linea("No se puede resolver el nombre del sistema de destino " + d.escrito + ".", "t-error");
        return { renglones: r, tipo: "error", resumen: "El nombre no se resuelve: tracert no tiene a qué IP mandar los paquetes. Está mal escrito o falla el DNS." };
      }
      /* El encabezado lleva el nombre escrito (o el que tiene la IP); el último salto, solo el nombre que tiene la IP */
      var conNombre = d.nombre || d.inverso;
      var equipoFinal = d.inverso ? d.inverso + " [" + d.ip + "]" : d.ip;
      linea("");
      if (conNombre && d.caso !== "error-general") {
        linea("Traza a la dirección " + conNombre + " [" + d.ip + "]");
        linea("sobre un máximo de " + SALTOS_MAX + " saltos:");
      } else {
        linea("Traza a " + d.ip + " sobre caminos de " + SALTOS_MAX + " saltos como máximo.");
      }
      linea("");
      var resumen;
      var sinRespuesta = "Tiempo de espera agotado para esta solicitud.";
      if (d.caso === "error-general") {
        linea("  1  Código de error Windows " + d.codigo, "t-error");
        resumen = ["error", "Esa dirección no sirve como destino: tracert no puede enviar los paquetes."];
      } else if (d.caso === "inaccesible") {
        linea(lineaSalto(1, [null, null, null], sinRespuesta), "t-error");
        linea(relleno(2, 3) + tiempoSalto(null) + tiempoSalto(null) + "  " + PC_NOMBRE + " [" + PC + "]  informes: Host de destino inaccesible.", "t-error");
        resumen = ["error", "Ningún equipo de la red tiene la IP " + d.ip + ": la propia PC avisa «Host de destino inaccesible»."];
      } else {
        var saltos = d.camino.map(function (equipo, i) {
          var desde = TIEMPO_SALTO[i], hasta = desde + (i === 0 ? 1 : 2);
          return { equipo: equipo, tiempos: [sorteo(desde, hasta), sorteo(desde, hasta), sorteo(desde, hasta)] };
        });
        if (d.caso === "responde" || d.caso === "propia") {
          var t = d.caso === "propia" ? [0, 0] : d.rango;
          saltos.push({ equipo: equipoFinal, tiempos: [sorteo(t[0], t[1]), sorteo(t[0], t[1]), sorteo(t[0], t[1])] });
          saltos.forEach(function (s, i) { linea(lineaSalto(i + 1, s.tiempos, s.equipo)); });
          resumen = ["ok", saltos.length === 1 ? "Llegó al destino en 1 salto: está en la misma red (o es la propia PC)." : "Llegó al destino en " + saltos.length + " saltos. El 1 es la puerta de enlace; el último, el destino."];
        } else {
          saltos.forEach(function (s, i) { linea(lineaSalto(i + 1, s.tiempos, s.equipo)); });
          for (var n = saltos.length + 1; n <= SALTOS_MAX; n++) { linea(lineaSalto(n, [null, null, null], sinRespuesta), "t-error"); }
          resumen = ["error", d.ultimoSalto ? "El camino se corta después del salto " + d.ultimoSalto + ": desde ahí, todo da * hasta el salto " + SALTOS_MAX + "." : "Ningún salto responde: todo da * hasta el salto " + SALTOS_MAX + "."];
        }
      }
      linea("");
      linea("Traza completa.", resumen[0] === "ok" ? "t-ok" : "");
      return { renglones: r, tipo: resumen[0], resumen: resumen[1] };
    }

    /* ---- Dibujo: los renglones aparecen de a uno, como en la consola ---- */
    function renglon(texto, clase) {
      var nodo = clase ? document.createElement("span") : document.createTextNode(texto);
      if (clase) { nodo.className = clase; nodo.textContent = texto; }
      return nodo;
    }

    function avisar(texto, tipo) {
      estado.textContent = texto;
      estado.classList.toggle("sim__estado--error", tipo === "error");
      estado.classList.toggle("sim__estado--ok", tipo === "ok");
    }

    function sinMovimiento() {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function ejecutar(comando, texto) {
      var destino = texto.trim();
      if (!destino) {
        campo.setAttribute("aria-invalid", "true");
        avisar("Escribí una IP o un nombre, por ejemplo www.redesdelaula.com.", "error");
        return;
      }
      if (/\s/.test(destino)) {
        campo.setAttribute("aria-invalid", "true");
        avisar("El destino va sin espacios: una IP o un nombre.", "error");
        return;
      }
      campo.removeAttribute("aria-invalid");
      campo.value = destino;

      var d = buscar(destino);
      var resultado = comando === "tracert" ? tracert(d) : ping(d);
      if (!resultado) {
        campo.setAttribute("aria-invalid", "true");
        avisar("El simulador trabaja con IPv4: escribí una IP como 192.168.1.1 o un nombre.", "error");
        return;
      }
      var renglones = resultado.renglones.concat([{ texto: "", clase: "" }, { texto: PROMPT, clase: "t-prompt" }]);

      /* Con una URL completa Windows no encuentra el host: se avisa qué escribir */
      if (d.caso === "sin-nombre" && destino.indexOf("://") !== -1) {
        resultado.resumen = "Windows no entiende «" + destino.split("://")[0] + "://»: el destino es solo el nombre, por ejemplo www.redesdelaula.com.";
      }

      clearTimeout(temporizador);
      salida.textContent = "";
      salida.appendChild(renglon(PROMPT, "t-prompt"));
      salida.appendChild(renglon(comando + " " + destino, "t-cmd"));
      avisar("Ejecutando " + comando + " " + destino + "…", "");

      var i = 0;
      var pausa = sinMovimiento() ? 0 : (comando === "tracert" ? 160 : 320);
      function siguiente() {
        while (i < renglones.length) {
          var r = renglones[i];
          i++;
          salida.appendChild(document.createTextNode("\n"));
          if (r.texto) { salida.appendChild(renglon(r.texto, r.clase)); }
          salida.scrollTop = salida.scrollHeight;
          /* Pausa en los renglones con respuesta (o sin ella), como cuando Windows espera */
          if (pausa && /^(Respuesta|Tiempo de espera|PING:|\s+\d+ )/.test(r.texto)) {
            temporizador = setTimeout(siguiente, pausa);
            return;
          }
        }
        avisar(resultado.resumen, resultado.tipo);
      }
      siguiente();
    }

    function comandoElegido() {
      var marcado = sim.querySelector("input[name='sim-cmd']:checked");
      return marcado ? marcado.value : "ping";
    }

    /* ---- Eventos ---- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      ejecutar(comandoElegido(), campo.value);
    });
    Array.prototype.forEach.call(sim.querySelectorAll("[data-destino]"), function (b) {
      b.addEventListener("click", function () {
        campo.value = b.getAttribute("data-destino");
        ejecutar(comandoElegido(), campo.value);
      });
    });

    /* ---- Estado inicial: el ejemplo resuelto que está escrito en el HTML ---- */
    Array.prototype.forEach.call(sim.querySelectorAll("[data-sim-js]"), function (el) { el.hidden = false; });
  }

  var dns = document.querySelector("[data-sim='dns']");
  if (dns) { simuladorDns(dns); }
  var pingSim = document.querySelector("[data-sim='ping']");
  if (pingSim) { simuladorPing(pingSim); }
})();
