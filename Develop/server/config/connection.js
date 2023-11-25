const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://danielpolk7:xLjW0oQOTzFPDTVp@cluster0.ieul5mw.mongodb.net/');

module.exports = mongoose.connection;
