const getErrorsObj = (msg) => ({
  errors: [{ msg }],
});

const getSanitizedObj = (keysArr, objToSanitize = {}) => {
  const result = {};
  for (let key of keysArr) {
    if (objToSanitize[key] !== undefined) result[key] = objToSanitize[key];
  }

  return result;
};

module.exports = { getErrorsObj, getSanitizedObj };
