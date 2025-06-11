// const jwt = require("jsonwebtoken");

// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// module.exports = generateToken;

const jwt = require("jsonwebtoken");

// Modified: generateToken now accepts userId and userRole
const generateToken = (userId, userRole) => {
  return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { // ADDED role to payload
    expiresIn: "7d",
  });
};

module.exports = generateToken;