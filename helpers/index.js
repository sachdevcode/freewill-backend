const ValidateFields = (data, requiredFields, res) => {
    return requiredFields.filter((item) => {
      if (data[item] === undefined) {
        return item;
      }
    });
  };
  
  const ApiResponse = (data = {}, message = "", response = true) => {
    return {
      // data: {
      data: data,
      message: message,
      response: response,
      // },
    };
  };
  
  module.exports = { ValidateFields, ApiResponse };