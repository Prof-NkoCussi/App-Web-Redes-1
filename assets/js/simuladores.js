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
     TP8 · Panel de un router: Wi-Fi, rango DHCP y reservas
     ========================================================== */
  function simuladorRouter(sim) {
    var RED = "192.168.1.";
    var PROMPT = "C:\\Users\\Alumno>";
    var EQUIPOS = [
      { nombre: "PC del aula", conexion: "Cable", mac: "3C-52-82-4A-1F-07" },
      { nombre: "Notebook", conexion: "Wi-Fi", mac: "8C-16-45-2B-9E-31" },
      { nombre: "Celular", conexion: "Wi-Fi", mac: "5A-7D-C3-90-12-6E" },
      { nombre: "Impresora", conexion: "Cable", mac: "00-1B-A9-3F-52-C4" }
    ];
    /* Reservas: número del equipo → último número de su IP (el ejemplo resuelto: la impresora) */
    var reservas = { 3: 10 };

    var form = sim.querySelector(".rt-form");
    var campo = {
      ssid: sim.querySelector("#rt-ssid"), seg: sim.querySelector("#rt-seg"), clave: sim.querySelector("#rt-clave"),
      desde: sim.querySelector("#rt-desde"), hasta: sim.querySelector("#rt-hasta"),
      equipo: sim.querySelector("#rt-equipo"), ip: sim.querySelector("#rt-ip")
    };
    var listaReservas = sim.querySelector(".rt-reservas");
    var estado = sim.querySelector(".sim__estado");
    var config = sim.querySelector("[data-config]");
    var tabla = sim.querySelector("[data-equipos]");
    var ipconfig = sim.querySelector("[data-ipconfig]");

    /* ---- Validación ---- */
    /* Devuelve el último número de una IP de la red 192.168.1.0, o un texto con el error */
    function numero(texto, que) {
      var t = texto.trim();
      if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(t)) { return que + ": escribí una IP completa, como 192.168.1.30."; }
      var p = t.split(".").map(Number);
      if (p.some(function (n) { return n > 255; })) { return que + ": cada número de una IP va de 0 a 255."; }
      if (p[0] !== 192 || p[1] !== 168 || p[2] !== 1) { return que + ": tiene que ser de la red del router (192.168.1.…)."; }
      if (p[3] === 0 || p[3] === 255) { return que + ": las IP terminadas en 0 y en 255 no se pueden usar en un equipo."; }
      return p[3];
    }

    function errorWifi() {
      var ssid = campo.ssid.value.trim();
      if (!ssid) { return [campo.ssid, "Escribí un nombre para la red (SSID)."]; }
      if (ssid.length > 32) { return [campo.ssid, "El SSID puede tener hasta 32 caracteres; tiene " + ssid.length + "."]; }
      if (campo.seg.value !== "Sin seguridad") {
        var n = campo.clave.value.length;
        if (n < 8 || n > 63) { return [campo.clave, "Con " + campo.seg.value + ", la clave lleva de 8 a 63 caracteres; tiene " + n + "."]; }
      }
      return null;
    }

    function errorRango() {
      var d = numero(campo.desde.value, "Desde");
      if (typeof d === "string") { return [campo.desde, d]; }
      var h = numero(campo.hasta.value, "Hasta");
      if (typeof h === "string") { return [campo.hasta, h]; }
      if (d > h) { return [campo.hasta, "«Hasta» tiene que ser mayor que «Desde»."]; }
      if (d === 1) { return [campo.desde, "El rango no puede incluir la IP del router (192.168.1.1)."]; }
      return null;
    }

    /* ---- Avisos ---- */
    function avisar(texto, tipo) {
      estado.textContent = texto;
      estado.classList.toggle("sim__estado--error", tipo === "error");
      estado.classList.toggle("sim__estado--ok", tipo === "ok");
    }
    function limpiarErrores() {
      Object.keys(campo).forEach(function (k) { campo[k].removeAttribute("aria-invalid"); });
    }
    function fallo(par, prefijo) {
      par[0].setAttribute("aria-invalid", "true");
      avisar((prefijo || "") + par[1], "error");
    }

    /* ---- Reservas ---- */
    function dibujarReservas() {
      listaReservas.textContent = "";
      var claves = Object.keys(reservas);
      if (!claves.length) {
        var vacia = document.createElement("li");
        vacia.className = "sim__vacia";
        vacia.textContent = "Ninguna reserva.";
        listaReservas.appendChild(vacia);
      }
      claves.forEach(function (k) {
        var e = EQUIPOS[k];
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(e.nombre + " (" + e.mac + ") → " + RED + reservas[k] + " "));
        var quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "boton boton--claro boton--chico";
        quitar.textContent = "Quitar";
        quitar.setAttribute("aria-label", "Quitar la reserva de " + e.nombre);
        quitar.addEventListener("click", function () {
          delete reservas[k];
          dibujarReservas();
          avisar("Se quitó la reserva de " + e.nombre + ". Guardá para volver a conectar los equipos.", "");
        });
        li.appendChild(quitar);
        listaReservas.appendChild(li);
      });
    }

    function agregarReserva() {
      limpiarErrores();
      var i = Number(campo.equipo.value);
      var n = numero(campo.ip.value, "IP reservada");
      if (typeof n === "string") { fallo([campo.ip, n]); return; }
      if (n === 1) { fallo([campo.ip, "Esa es la IP del router: elegí otra."]); return; }
      for (var k in reservas) {
        if (reservas[k] === n && Number(k) !== i) { fallo([campo.ip, "La IP " + RED + n + " ya está reservada para " + EQUIPOS[k].nombre + "."]); return; }
      }
      var cambio = reservas[i] !== undefined;
      reservas[i] = n;
      campo.ip.value = RED + n;
      dibujarReservas();
      avisar((cambio ? "Reserva cambiada: " : "Reserva agregada: ") + EQUIPOS[i].nombre + " → " + RED + n + ". Guardá para conectar los equipos.", "");
    }

    /* ---- Conexión de los equipos: primero las reservas; después, la primera IP libre del rango ---- */
    function conectar(desde, hasta) {
      var usadas = {};
      Object.keys(reservas).forEach(function (k) { usadas[reservas[k]] = true; });
      return EQUIPOS.map(function (e, i) {
        if (reservas[i] !== undefined) { return { ip: RED + reservas[i], como: "Reserva" }; }
        for (var n = desde; n <= hasta; n++) {
          if (!usadas[n]) { usadas[n] = true; return { ip: RED + n, como: "DHCP" }; }
        }
        return { ip: "", como: "Sin IP: el rango no alcanzó" };
      });
    }

    function celda(fila, etiqueta, texto) {
      var c = document.createElement(etiqueta);
      if (etiqueta === "th") { c.scope = "row"; }
      c.textContent = texto;
      fila.appendChild(c);
      return c;
    }

    function dibujarTabla(resultado) {
      tabla.textContent = "";
      EQUIPOS.forEach(function (e, i) {
        var tr = document.createElement("tr");
        celda(tr, "th", e.nombre);
        celda(tr, "td", e.conexion);
        celda(tr, "td", e.mac);
        celda(tr, "td", resultado[i].ip || "—");
        var como = celda(tr, "td", resultado[i].como);
        if (!resultado[i].ip) { tr.className = "rt-sin-ip"; como.className = "rt-falla"; }
        tabla.appendChild(tr);
      });
    }

    /* Salida de ipconfig en la PC (mismo formato que muestra Windows en español) */
    function dibujarIpconfig(ip) {
      ipconfig.textContent = "";
      function linea(texto, clase) {
        if (clase) {
          var s = document.createElement("span");
          s.className = clase;
          s.textContent = texto;
          ipconfig.appendChild(s);
        } else {
          ipconfig.appendChild(document.createTextNode(texto));
        }
      }
      linea(PROMPT, "t-prompt");
      linea("ipconfig", "t-cmd");
      linea("\n\nConfiguración IP de Windows\n\n\nAdaptador de Ethernet Ethernet:\n\n" +
        "   Sufijo DNS específico para la conexión. . :\n" +
        "   Vínculo: dirección IPv6 local. . . : fe80::a1c:2b7e:91d3:6f5%7\n");
      if (ip) {
        linea("   Dirección IPv4. . . . . . . . . . . . . . : "); linea(ip, "t-str");
        linea("\n   Máscara de subred . . . . . . . . . . . . : "); linea("255.255.255.0", "t-str");
        linea("\n   Puerta de enlace predeterminada . . . . . : "); linea("192.168.1.1", "t-str");
      } else {
        /* Sin servidor DHCP que le responda, Windows se pone una IP 169.254 (ver "Para profundizar") */
        linea("   Dirección IPv4 de configuración automática: "); linea("169.254.83.107", "t-error");
        linea("\n   Máscara de subred . . . . . . . . . . . . : 255.255.0.0");
        linea("\n   Puerta de enlace predeterminada . . . . . :");
      }
    }

    function dibujarConfig(desde, hasta) {
      config.textContent = "";
      config.appendChild(document.createTextNode("Red Wi-Fi "));
      var b = document.createElement("strong");
      b.textContent = campo.ssid.value.trim();
      config.appendChild(b);
      var seg = campo.seg.value === "Sin seguridad" ? ", sin seguridad." : ", con " + campo.seg.value + ".";
      var claves = Object.keys(reservas);
      var lista = claves.map(function (k) { return EQUIPOS[k].nombre + " → " + RED + reservas[k]; }).join("; ");
      config.appendChild(document.createTextNode(seg + " Rango DHCP: de " + RED + desde + " a " + RED + hasta + ". " +
        (claves.length === 1 ? "Reserva: " : "Reservas: ") + (lista || "ninguna") + "."));
    }

    /* ---- Guardar ---- */
    function guardar() {
      limpiarErrores();
      var e = errorWifi() || errorRango();
      if (e) { fallo(e, "No se guardó. "); return; }
      var desde = numero(campo.desde.value, ""), hasta = numero(campo.hasta.value, "");
      campo.desde.value = RED + desde;
      campo.hasta.value = RED + hasta;
      var resultado = conectar(desde, hasta);
      dibujarConfig(desde, hasta);
      dibujarTabla(resultado);
      dibujarIpconfig(resultado[0].ip);

      var porDhcp = 0, conReserva = 0, sinIp = [];
      resultado.forEach(function (r, i) {
        if (r.como === "DHCP") { porDhcp++; } else if (r.como === "Reserva") { conReserva++; } else { sinIp.push(EQUIPOS[i].nombre); }
      });
      var texto, tipo = "ok";
      if (sinIp.length) {
        tipo = "error";
        var nombres = sinIp.length === 1 ? sinIp[0] : sinIp.slice(0, -1).join(", ") + " y " + sinIp[sinIp.length - 1];
        texto = "Guardado, pero el rango DHCP no alcanzó: " + nombres + (sinIp.length === 1 ? " quedó" : " quedaron") +
          " sin IP. Un equipo sin IP del DHCP se pone una 169.254…, con la que no hay red.";
      } else {
        texto = "Guardado. Se conectaron los 4 equipos: " + porDhcp + " por DHCP y " + conReserva + " con reserva.";
      }
      if (campo.seg.value === "Sin seguridad") {
        tipo = "error";
        texto += " Ojo: la red Wi-Fi no tiene seguridad; cualquiera puede conectarse y ver lo que viaja.";
      }
      avisar(texto, tipo);
    }

    /* ---- Eventos ---- */
    EQUIPOS.forEach(function (e, i) {
      var op = document.createElement("option");
      op.value = String(i);
      op.textContent = e.nombre + " · " + e.mac;
      campo.equipo.appendChild(op);
    });
    form.addEventListener("submit", function (ev) { ev.preventDefault(); guardar(); });
    sim.querySelector("[data-reservar]").addEventListener("click", agregarReserva);
    campo.seg.addEventListener("change", function () {
      campo.clave.disabled = campo.seg.value === "Sin seguridad";
    });
    /* La configuración del ejemplo resuelto: cada "Probá con" parte de acá y cambia una sola cosa */
    function volverAlEjemplo() {
      campo.ssid.value = "Aula-Redes";
      campo.seg.value = "WPA2 Personal";
      campo.clave.disabled = false;
      campo.clave.value = "clave-del-aula";
      campo.desde.value = "192.168.1.25";
      campo.hasta.value = "192.168.1.199";
      reservas = { 3: 10 };
      dibujarReservas();
    }
    Array.prototype.forEach.call(sim.querySelectorAll("[data-probar]"), function (b) {
      b.addEventListener("click", function () {
        var caso = b.getAttribute("data-probar");
        volverAlEjemplo();
        if (caso === "clave") {
          campo.clave.value = "123456";
        } else if (caso === "router") {
          campo.desde.value = "192.168.1.1";
          campo.hasta.value = "192.168.1.199";
        } else {
          campo.desde.value = "192.168.1.25";
          campo.hasta.value = "192.168.1.25";
        }
        guardar();
      });
    });

    /* ---- Estado inicial: el ejemplo resuelto que está escrito en el HTML ---- */
    dibujarReservas();
    Array.prototype.forEach.call(sim.querySelectorAll("[data-sim-js]"), function (el) { el.hidden = false; });
  }

  var dns = document.querySelector("[data-sim='dns']");
  if (dns) { simuladorDns(dns); }
  var router = document.querySelector("[data-sim='router']");
  if (router) { simuladorRouter(router); }
})();
