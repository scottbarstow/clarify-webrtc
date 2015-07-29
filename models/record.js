'use strict';

var mongoose = require('mongoose');

var Record = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  clarify: {
    bundle_id: {
      type: String
    },
    indexedAt: {
      type: Date
    },
    duration: {
      type: Number
    }
  },
  call: {
    type: mongoose.Schema.ObjectId,
    ref: 'Call'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

Record.virtual('path').get(function(){
  return './public/uploads/' + this.id + '.ogg';
});
Record.virtual('url').get(function(){
  return config.BASE_URL + '/uploads/' + this.id + '.ogg';
});

Record.set('toJSON', { virtuals: true, getters: true });
module.exports = mongoose.model('Record', Record);
