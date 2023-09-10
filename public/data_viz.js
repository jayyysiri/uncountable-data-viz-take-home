/**
 *
 *
 *
 */

"use strict";

(function () {
  const BASE_URL = "https://uncountable-take-home-jay-siri.onrender.com/";

  /**
   * Helper function to return the Response data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
   * @returns {object} - The Response object if successful, otherwise an Error that
   * needs to be caught.
   */
  async function init() {
    let button = document.getElementById("goButton");
    button.addEventListener("click", async () => {
      getValuesAndPlot();
    });
  }

  /**
   * Helper function to return the Response data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
   * @returns {object} - The Response object if successful, otherwise an Error that
   * needs to be caught.
   */
  async function displayDataViz(
    input_var,
    output_var,
    in_min,
    in_max,
    out_min,
    out_max
  ) {
    try {
      let url =
        BASE_URL +
        input_var +
        "/" +
        output_var +
        "/" +
        in_min +
        "/" +
        in_max +
        "/" +
        out_min +
        "/" +
        out_max;
      let res = await fetch(url, { method: "GET" });
      const data = await res.json();
      createDataPlot(input_var, output_var, data);
    } catch (err) {}
  }

  /**
   * Helper function to return the Response data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
   * @returns {object} - The Response object if successful, otherwise an Error that
   * needs to be caught.
   */
  function createDataPlot(input_var, output_var, data) {
    let x_arr = new Array();
    let y_arr = new Array();
    for (let i = 0; i < data.length; i++) {
      x_arr.push(data[i][0]);
      y_arr.push(data[i][1]);
    }
    let scatter = document.getElementById("scatter");
    Plotly.newPlot(
      scatter,
      [
        {
          x: x_arr,
          y: y_arr,
          mode: "markers",
          type: "scatter",
        },
      ],
      {
        margin: { t: 80 },
        title: input_var + " vs. " + output_var,
        xaxis: { title: input_var },
        yaxis: { title: output_var },
      }
    );
  }

  /**
   * Helper function to return the Response data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
   * @returns {object} - The Response object if successful, otherwise an Error that
   * needs to be caught.
   */
  function getValuesAndPlot() {
    let input_var = document.getElementById("input").value;
    let output_var = document.getElementById("output").value;
    let in_min = Math.max(document.getElementById("in_min").value, 0);
    let in_max = document.getElementById("in_max").value || Infinity;
    let out_min = Math.min(document.getElementById("out_min").value, 0);
    let out_max = document.getElementById("out_max").value || Infinity;
    displayDataViz(input_var, output_var, in_min, in_max, out_min, out_max);
  }

  // Display default first plot and start up event listener
  getValuesAndPlot();
  init();
})();
