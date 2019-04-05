'use strict';

let fs = require('fs');
let os = require('os');
let ip = require('ip');
let path = require('path');

let scriptStartTime = new Date().getTime();
let packageFile = path.join(__dirname, '..', '..', '..', 'package.json');
let packageJson;
fs.readFile(packageFile, 'utf8', function (err, data) {
  if (err) {
    console.error(err);
  }
  packageJson = JSON.parse(data);
});

export function serverInfo(req, res) {
  let serverInfo = {
    'nodeVer': process.version,
    'network': os.networkInterfaces(),
    'hostname': os.hostname(),
    'osType': os.type(),
    'osPlatform': os.platform(),
    'osArchitecture': os.arch(),
    'osRelease': os.release(),
    'cpuModel': os.cpus()[0].model,
    'cpuCores': os.cpus().length,
    'cpuLoad': os.loadavg(),
    'memTotal': os.totalmem(),
    'memFree': os.freemem(),
    'osUpTime': os.uptime(),
    'user': os.userInfo(),
    'dbStartTime': scriptStartTime,
    'version': packageJson.version,
    'ip': ip.address()
  };
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  res.status(200).json(serverInfo).end();
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
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
