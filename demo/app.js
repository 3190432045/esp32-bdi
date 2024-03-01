var bluetoothDevice;

function onButtonClick() {
  bluetoothDevice = null;
  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
     acceptAllDevices: true})
  .then(device => {
    time('Choosing device...');
    log('> Name:             ' + device.name);
    log('> Id:               ' + device.id);
    log('> Connected:        ' + device.gatt.connected);
    bluetoothDevice = device;
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
    connect();
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function connect() {
  exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
    function toTry() {
      time('Connecting to Bluetooth Device... ');
      return bluetoothDevice.gatt.connect();
    },
    function success() {
      time('> Bluetooth Device connected');
    },
    function fail() {
      time('Failed to reconnect.');
    });
}

function onDisconnected() {
  time('> Bluetooth Device disconnected');
  connect();
}

/* Utils */

// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
function exponentialBackoff(max, delay, toTry, success, fail) {
  toTry().then(result => success(result))
  .catch(_ => {
    if (max === 0) {
      return fail();
    }
    time('Retrying in ' + delay + 's... (' + max + ' tries left)');
    setTimeout(function() {
      exponentialBackoff(--max, delay * 2, toTry, success, fail);
    }, delay * 1000);
  });
}

function time(text) {
  log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
}

// DisplayDeviceInfo
//
//
function DisplayDeviceInfo(device) {
    log('> Name:             ' + device.name);
    log('> Id:               ' + device.id);
    log('> Connected:        ' + device.gatt.connected);
}

// DiscoverServices
//
//
function DiscoverServices() {
  // Validate services UUID entered by user first.
  let optionalServices = document.querySelector('#optionalServices').value
    .split(/, ?/).map(s => s.startsWith('0x') ? parseInt(s) : s)
    .filter(s => s && BluetoothUUID.getService);

  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: optionalServices})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    // Note that we could also get all services that match a specific UUID by
    // passing it to getPrimaryServices().
    log('Getting Services...');
    return server.getPrimaryServices();
  })
  .then(services => {
    log('Getting Characteristics...');
    let queue = Promise.resolve();
    services.forEach(service => {
      queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
        log('> Service: ' + service.uuid);
        characteristics.forEach(characteristic => {
          log('>> Characteristic: ' + characteristic.uuid + ' ' +
              getSupportedProperties(characteristic));
        });
      }));
    });
    return queue;
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

/* Utils */

function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
}
