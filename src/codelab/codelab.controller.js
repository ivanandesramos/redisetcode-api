const axios = require('axios');

/* 
  Compiler by GlotAPI
  Documentation: https://github.com/glotcode/glot/tree/master/api_docs/run
*/

// Exported function that handles the compilation process
exports.compiler = async (req, res) => {
  const { code, input } = req.body; // Extract language and code from the request body
  const fileName = 'main.cpp'; // Set the appropriate file name based on the language
  const url = 'https://glot.io/api/run/cpp/latest';

  const headers = {
    Authorization: `Token ${process.env.API_KEY}`, // Set the authorization token for API access
    'Content-type': 'application/json', // Set the content type for the API request
  };

  const data = {
    stdin: input,
    files: [
      {
        name: fileName,
        content: code, // Set the code content to be compiled
      },
    ],
  };

  try {
    // Send a POST request to the Glot API for compilation
    const response = await axios.post(url, data, { headers });

    // Respond with the API response data and status
    res.status(response.status).json(response.data);
  } catch (error) {
    // If an error occurs, handle and respond with appropriate status and error message
    res
      .status(error.response.status || 500)
      .json(error.response.data || { error: 'Something went wrong!' });
  }
};
