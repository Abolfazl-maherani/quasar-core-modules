export const dateValidator = (dateStr) => {
  return !isNaN(new Date(dateStr));
};
