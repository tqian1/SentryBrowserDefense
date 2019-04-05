import mongoose from 'mongoose';
import {registerEvents} from './heap.events';

var HeapSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(HeapSchema);
export default mongoose.model('Heap', HeapSchema);
