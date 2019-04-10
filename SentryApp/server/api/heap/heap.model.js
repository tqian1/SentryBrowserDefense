import mongoose from 'mongoose';
import {registerEvents} from './heap.events';

var HeapSchema = new mongoose.Schema({
  filename: String,
  date: String,
  nodeCount: Array,
  edgeCount: Array
});

registerEvents(HeapSchema);
export default mongoose.model('Heap', HeapSchema);
