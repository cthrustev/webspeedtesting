const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Audit = new Schema({
  auditUser: String,
  auditData: {},
});

module.exports = mongoose.model('Audit', Audit);