/**
 * @author: Jay Siri
 * @date Sep 20, 2023
 * @description This is the client-side data visualization code for handling user input, making API calls, and plotting data.
 */

"use strict";

(function () {
  const BASE_URL = "https://uncountable-take-home-jay-siri.onrender.com/";

  /**
   * Init function to set up the event listener for the Go button.
   */
  async function init() {
    let button = document.getElementById("goButton");
    button.addEventListener("click", async () => {
      getValuesAndPlot();
    });
  }

  /**
   * Makes an API call to retrieve the necessary (filtered) data and sends data to be displayed.
   * @param {object} input_var - name of the input variable
   * @param {object} output_var - name of the output variable
   * @param {object} in_min - minimum value of the input
   * @param {object} in_max - maximum value of the input
   * @param {object} out_min - minimum value of the output
   * @param {object} out_max - maximum value of the output
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
    } catch (err) {
      console.log("Unexpected error!");
    }
  }

  /**
   * Plots the data using plotly.js scatter plots
   * @param {object} input_var - name of the input variable
   * @param {object} output_var - name of the output variable
   * @param {object} data - data of shape [[input_1, output_1], ..., [input_n, output_n]] to plot.
   */
  function createDataPlot(input_var, output_var, data) {
    // Unzip the data to x and y arrays.
    let x_arr = new Array();
    let y_arr = new Array();
    for (let i = 0; i < data.length; i++) {
      x_arr.push(data[i][0]);
      y_arr.push(data[i][1]);
    }
    // Plot using plotly.js
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
   * Gets the current values of parameters in the options panel and calls to create a plot.
   */
  function getValuesAndPlot() {
    let input_var = document.getElementById("input").value;
    let output_var = document.getElementById("output").value;
    let in_min = Math.max(document.getElementById("in_min").value, 0);
    let in_max = document.getElementById("in_max").value || Infinity;
    let out_min = Math.max(document.getElementById("out_min").value, 0);
    let out_max = document.getElementById("out_max").value || Infinity;
    displayDataViz(input_var, output_var, in_min, in_max, out_min, out_max);
  }

  // Display default first plot and start up event listener
  getValuesAndPlot();
  init();
})();
