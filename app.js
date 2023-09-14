/**
 * @author: Jay Siri
 * @date Sep 20, 2023
 * @description This is the server-side API code for filtering and retrieving data about experiments.
 */

// Define all required constants and Express app
const exp = require("constants");
const express = require("express");
const cors = require("cors");
const SERVER_ERROR =
  "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEBUG = true;
const app = express();
const fs = require("fs/promises");
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

/**
 * Returns an 2D array of filtered data specified by parameters.
 */
app.get(
  "/:input_variable/:output_variable/:in_min/:in_max/:out_min/:out_max",
  async (req, res, next) => {
    try {
      // Read all the raw data
      let file_content_raw = await fs.readFile(
        "uncountable_front_end_dataset.json",
        "utf8"
      );
      // Get exp names
      let exp_names = Object.keys(JSON.parse(file_content_raw));
      // Get the input variable data
      let input_variable_data = getVariableData(
        file_content_raw,
        formatVariableName(req.params.input_variable)
      );
      // Get the output variable data
      let output_variable_data = getVariableData(
        file_content_raw,
        formatVariableName(req.params.output_variable)
      );
      // Filter all the data
      let final_input_output_datapoints = filter_datapoints(
        input_variable_data,
        output_variable_data,
        req.params.in_min,
        req.params.in_max,
        req.params.out_min,
        req.params.out_max,
        exp_names
      );
      // Send all data to the endpoint
      res.json(final_input_output_datapoints);
    } catch (err) {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
);

/**
 * Helper function to parse through JSON data and get get all the data values associated with a variable (key).
 * @param {object} data - (all available) data to filter through
 * * @param {object} variable - variable name to filter for
 * @returns {object} - filtered data for that variable.
 */
function getVariableData(data, variable) {
  let variable_values = new Array();
  JSON.parse(data, (key, value) => {
    if (formatVariableName(key) === variable) {
      variable_values.push(value);
    }
  });
  return variable_values;
}

/**
 * Function to filter through all data for input, output variables, filter in ranges, and zip the data together.
 * @param {object} input_data - data for the input variable
 * @param {object} output_data - data for the output variable
 * @param {object} in_min - minimum value of the input
 * @param {object} in_max - maximum value of the input
 * @param {object} out_min - minimum value of the output
 * @param {object} out_max - maximum value of the output
 * @returns {object} - 2D filtered data within the ranges of both input/output min/max.
 */
function filter_datapoints(
  input_data,
  output_data,
  in_min,
  in_max,
  out_min,
  out_max,
  exp_names
) {
  let filtered_datapoints = new Array();
  for (let i = 0; i < input_data.length; i++) {
    if (
      input_data[i] >= in_min &&
      input_data[i] <= in_max &&
      output_data[i] >= out_min &&
      output_data[i] <= out_max
    ) {
      filtered_datapoints.push([input_data[i], output_data[i], exp_names[i]]);
    }
  }
  return filtered_datapoints;
}

/**
 * Helper function ensuring variable name can be parsed.
 * @param {object} txt - name of a variable
 * @returns {object} - formatted variable name
 */
function formatVariableName(txt) {
  return txt.toLocaleLowerCase().split(" ").join("_");
}

/**
 * Helper function to return the Response data if successful, otherwise
 * returns an Error that needs to be caught.
 * @param {object} response - response with status to check for success/error.
 * @returns {object} - The Response object if successful, otherwise an Error that
 * needs to be caught.
 */
function errorHandler(err, req, res, next) {
  if (DEBUG) {
    console.error(err);
  }
  res.type("text");
  res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
