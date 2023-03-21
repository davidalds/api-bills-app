const compareDates = (param_date) => {
  const actual_date = new Date();
  const date = new Date(param_date);
  if (actual_date < date) {
    const days = (date.getTime() - actual_date.getTime()) / (1000 * 3600 * 24);
    const res_days = Math.ceil(days);
    if (res_days >= 1 && res_days <= 7) {
      return true;
    }
  }
  return false;
};

module.exports = compareDates;
