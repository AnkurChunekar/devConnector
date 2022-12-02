const getCommonErrMsg = (fieldName) => `Please provide a valid ${fieldName}`;

const validationErrMsgs = {
  email: getCommonErrMsg("email"),
  password: "Password length should be atleast 6 characters long",
  name: getCommonErrMsg("name"),
};

module.exports = { validationErrMsgs };
