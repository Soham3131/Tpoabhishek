exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.getExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};
