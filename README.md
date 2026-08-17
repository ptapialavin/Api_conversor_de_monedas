# Api_conversor_de_monedas

#Link del Deploy: https://ptapialavin.github.io/Api_conversor_de_monedas/ 

# Conversor de Monedas CLP

Conversor de pesos chilenos (CLP) a dólar (USD) o euro (EUR), hecho en HTML, CSS y JavaScript puro. Consulta el valor del día en la API [mindicador.cl](https://mindicador.cl) y grafica el historial de los últimos 10 días con [Chart.js](https://www.chartjs.org/).

Proyecto de la prueba "Conversor de monedas" de Desafío Latam (fetch, try/catch y Chart.js).

## Cómo usarlo

1. Ingresa un monto en CLP.
2. Selecciona Dólar o Euro.
3. Presiona **Convertir**.
4. Verás el resultado y un gráfico con el historial de los últimos 10 días.

## Tecnologías

HTML5 · CSS3 (variables CSS) · JavaScript (`fetch`, `async/await`) · Chart.js · API mindicador.cl

## Estructura

\```
Api-conversor_de_monedas/
├── index.html
├── style.css
├── script.js
└── README.md
\```

## Ejecutar

Abre `index.html` en el navegador, o levanta un servidor local:

\```bash
python3 -m http.server 8080
\```

Requiere internet, ya que consulta `https://mindicador.cl/api` en tiempo real.

## Cómo se calcula

\```
monto_convertido = monto_en_CLP / valor_de_la_moneda_ese_día
\```

## Requerimientos de la prueba

| # | Requerimiento | Dónde se cumple |
|---|---|---|
| 1 | Consulta a mindicador.cl | `fetch` en `obtenerDatosMoneda()` |
| 2 | Cálculo y muestra en el DOM | `mostrarResultado()` |
| 3 | Select con 2+ monedas funcionando | `<select id="tipo-moneda">` (USD, EUR) |
| 4 | `try/catch` con error en el DOM | `obtenerDatosMoneda()` → `#mensaje-error` |
| 5 | Gráfico del historial | `renderizarGrafico()` con Chart.js |

## Autor

Patricio Tapia L— Proyecto desarrollado para el módulo de Javascript para web del curso Desarrollo Full Stack de Desafío Latam.