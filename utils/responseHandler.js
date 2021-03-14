const generateResponse = (response, res) => {
  if (response.statusCode >= 400) {
    return res.status(response.statusCode).json(response);
  }

  res.status(response.statusCode).json(response);
};

module.exports = {
  generateResponse,
};
