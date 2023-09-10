// Author: Jay Siri
// Date: Sep 20, 2023
// This is the main API code for my Uncountable Take Home Assignment.
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
app.use(cors({
    origin: '*'
}));

// Get all the data (one input, one output var, input min/max, output min/max)
app.get(
  "/:input_variable/:output_variable/:in_min/:in_max/:out_min/:out_max",
  async (req, res, next) => {
    try {
      let file_content_raw = await fs.readFile(
        "uncountable_front_end_dataset.json",
        "utf8"
      );
      let input_variable_data = getVariableData(
        file_content_raw,
        formatVariableName(req.params.input_variable)
      );
      let output_variable_data = getVariableData(
        file_content_raw,
        formatVariableName(req.params.output_variable)
      );
      let final_input_output_datapoints = filter_datapoints(
        input_variable_data,
        output_variable_data,
        req.params.in_min,
        req.params.in_max,
        req.params.out_min,
        req.params.out_max
      );
      res.json(final_input_output_datapoints);
    } catch (err) {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
);

function getVariableData(data, variable) {
  let variable_values = new Array();
  JSON.parse(data, (key, value) => {
    if (formatVariableName(key) === variable) {
      variable_values.push(value);
    }
  });
  return variable_values;
}

function filter_datapoints(
  input_data,
  output_data,
  in_min,
  in_max,
  out_min,
  out_max
) {
  let filtered_datapoints = new Array();
  for (let i = 0; i < input_data.length; i++) {
    if (
      input_data[i] >= in_min &&
      input_data[i] <= in_max &&
      output_data[i] >= out_min &&
      output_data[i] <= out_max
    ) {
      filtered_datapoints.push([input_data[i], output_data[i]]);
    }
  }
  return filtered_datapoints;
}

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
function checkStatus(response) {
  if (!response.ok) {
    throw Error("Error in request: " + response.statusText);
  }
  return response;
}

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
