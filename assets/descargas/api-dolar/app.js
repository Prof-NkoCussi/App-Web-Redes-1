// Busca en la página el botón y el párrafo, por su id
const boton = document.getElementById("boton");
const resultado = document.getElementById("resultado");

// Función que pide los datos a la API y los muestra
async function consultarDolar() {
  // Le pide los datos a la API y espera la respuesta
  const respuesta = await fetch("https://dolarapi.com/v1/dolares/oficial");
  // Convierte la respuesta (JSON) en datos que JavaScript entiende
  const datos = await respuesta.json();
  // Escribe en el párrafo la compra y la venta del dólar
  resultado.textContent = "Compra: $" + datos.compra + " · Venta: $" + datos.venta;
}

// Cuando se hace clic en el botón, se ejecuta la función
boton.addEventListener("click", consultarDolar);
