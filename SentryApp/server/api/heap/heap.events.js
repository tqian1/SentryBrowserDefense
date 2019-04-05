/**
 * Heap model events
 */

import {EventEmitter} from 'events';
var HeapEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HeapEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Heap) {
  for(var e in events) {
    let event = events[e];
    Heap.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    HeapEvents.emit(event + ':' + doc._id, doc);
    HeapEvents.emit(event, doc);
  };
}

export {registerEvents};
export default HeapEvents;
