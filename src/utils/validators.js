const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const isValidDate = (date) => {
  return !isNaN(new Date(date).getTime());
};

const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = { isValidEmail, isValidDate, isValidObjectId };