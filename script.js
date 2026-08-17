const URL_BASE_API = "https://mindicador.cl/api";
const campoMonto = document.getElementById("monto-pesos");
const selectorMoneda = document.getElementById("tipo-moneda");
const botonBuscar = document.getElementById("boton-buscar");
const textoBoton = botonBuscar.querySelector(".texto-boton");
const divResultado = document.getElementById("resultado-conversion");
const divError = document.getElementById("mensaje-error");
const subtituloGrafico = document.getElementById("grafico-subtitulo");

let instanciaGrafico = null;

const NOMBRES_MONEDAS = {
  dolar: "USD",
  euro: "EUR"
};

function leerVariableCSS(nombre) {
  return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
}

function alternarCargando(cargando) {
  botonBuscar.disabled = cargando;
  textoBoton.textContent = cargando ? "Consultando…" : "Convertir";
}

//  Try/catch

async function obtenerDatosMoneda(moneda) {
  try {
    divError.textContent = "";
    const respuesta = await fetch(`${URL_BASE_API}/${moneda}`);

    if (!respuesta.ok) {
      throw new Error(`Error en la consulta: ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    divError.textContent = `Ocurrió un problema al consultar la API: ${error.message}`;
    return null;
  }
}

// Muestra el resultado convertido en el DOM
function mostrarResultado(montoCLP, valorActual, claveMoneda) {
  const valorConvertido = (montoCLP / valorActual).toLocaleString("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const simboloMoneda = NOMBRES_MONEDAS[claveMoneda] || claveMoneda.toUpperCase();
  divResultado.textContent = `Resultado: ${valorConvertido} ${simboloMoneda}`;
}

// Renderiza el gráfico de los últimos 10 días con Chart.js
function renderizarGrafico(historial, claveMoneda) {
  const ultimos10Dias = historial.slice(0, 10).reverse();

  const fechas = ultimos10Dias.map(registro => new Date(registro.fecha).toLocaleDateString("es-CL"));
  const valores = ultimos10Dias.map(registro => registro.valor);

  const lienzo = document.getElementById("grafico-historial").getContext("2d");

  if (instanciaGrafico) {
    instanciaGrafico.destroy();
  }

  const simboloMoneda = NOMBRES_MONEDAS[claveMoneda] || claveMoneda.toUpperCase();

  const colorAcento = leerVariableCSS("--accent") || "#2a78d6";
  const colorAcentoWash = leerVariableCSS("--accent-wash-strong") || "rgba(42, 120, 214, 0.18)";
  const colorTextoSecundario = leerVariableCSS("--text-secondary") || "#52514e";
  const colorGrilla = leerVariableCSS("--gridline") || "#e1e0d9";
  const colorSuperficie = leerVariableCSS("--surface-1") || "#fcfcfb";

  subtituloGrafico.textContent = `Valor del ${simboloMoneda} en CLP, día a día`;

  instanciaGrafico = new Chart(lienzo, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [{
        label: `${simboloMoneda} / CLP`,
        data: valores,
        borderColor: colorAcento,
        backgroundColor: colorAcentoWash,
        borderWidth: 2,
        pointBackgroundColor: colorAcento,
        pointBorderColor: colorSuperficie,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: colorSuperficie,
          titleColor: colorTextoSecundario,
          bodyColor: colorTextoSecundario,
          borderColor: colorGrilla,
          borderWidth: 1,
          padding: 10,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: colorTextoSecundario
          }
        },
        y: {
          grid: {
            color: colorGrilla
          },
          ticks: {
            color: colorTextoSecundario
          }
        }
      }
    }
  });
}

async function manejarBusqueda() {
  const monto = parseFloat(campoMonto.value);
  const monedaSeleccionada = selectorMoneda.value;

  divResultado.textContent = "";
  divError.textContent = "";

  if (isNaN(monto) || monto <= 0) {
    divError.textContent = "Por favor, ingresa un monto válido en pesos chilenos.";
    return;
  }

  if (!monedaSeleccionada) {
    divError.textContent = "Por favor, selecciona una moneda.";
    return;
  }

  alternarCargando(true);
  const datosMoneda = await obtenerDatosMoneda(monedaSeleccionada);
  alternarCargando(false);

  if (datosMoneda && datosMoneda.serie && datosMoneda.serie.length > 0) {
    const valorActual = datosMoneda.serie[0].valor;
    mostrarResultado(monto, valorActual, monedaSeleccionada);
    renderizarGrafico(datosMoneda.serie, monedaSeleccionada);
  }
}

// Evento al hacer clic en Convertir
botonBuscar.addEventListener("click", manejarBusqueda);

// Permite disparar la búsqueda presionando Enter dentro del campo de monto
campoMonto.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    manejarBusqueda();
  }
});
