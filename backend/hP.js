const bcrypt = require('bcryptjs');

const plaintextPassword = 'Password123'; // Replace this with your actual password

// Hash the password
bcrypt.hash(plaintextPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed Password:', hash); // Print the hashed password
});
