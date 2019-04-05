'use strict';

import mongoose from 'mongoose';

var ServerSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Server', ServerSchema);
