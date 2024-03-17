const path = require('path');
const Multer = require('multer');
// Set up multer disk storage
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

  
  module.exports = upload;