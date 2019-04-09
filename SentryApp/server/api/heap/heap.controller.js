/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/heaps              ->  index
 * POST    /api/heaps              ->  create
 * GET     /api/heaps/:id          ->  show
 * PUT     /api/heaps/:id          ->  upsert
 * PATCH   /api/heaps/:id          ->  patch
 * DELETE  /api/heaps/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import Heap from './heap.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function(entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch(err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function(entity) {
        if(entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if(!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Heaps
export function index(req, res) {
    return Heap.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Heap from the DB
export function show(req, res) {
    return Heap.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

function uploadData(data) {
  return new Promise(function(resolve, reject) {
      console.log(data);
      console.log("hello")
  })
}

// Creates a new Heap in the DB
export function upload(req, res) {
    var uploadPromise = uploadData(req.data);
    return uploadPromise
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Creates a new Heap in the DB
export function create(req, res) {
    return Heap.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Heap in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Heap.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Heap in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Heap.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Heap from the DB
export function destroy(req, res) {
    return Heap.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
