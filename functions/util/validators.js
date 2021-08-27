const isEmpty = (string) => {
  return string.trim() === "";
};

const isEmail = (email) => {
  const regEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regEx);
};

exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.firstName)) errors.firstName = "Must not be empty.";
  if (isEmpty(data.lastName)) errors.lastName = "Must not be empty.";

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty.";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address.";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty.";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match.";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLogInData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty.";
  if (isEmpty(data.password)) errors.password = "Must not be empty.";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateCategoryData = (boardData) => {
  let errors = {};

  if (isEmpty(boardData)) errors.board = "Must not be empty.";
  else if (
    boardData !== "pre-university" &&
    boardData !== "university" &&
    boardData !== "post-university" &&
    boardData !== "other"
  )
    errors.board = "Must be one of categories.";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
