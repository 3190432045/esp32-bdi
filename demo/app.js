var bluetoothDevice;

function onButtonClick() {
  serviceUuid = parseInt('0xABF0');
  characteristicUuid = parseInt('0xABF2');
  bluetoothDevice = null;
  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: [serviceUuid]}]})
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
  exponentialBackoff(32767 /* max retries */, 2 /* seconds delay */,
    function toTry() {
      time('Connecting to Bluetooth Device... ');
      return bluetoothDevice.gatt.connect();
    },
    function success(result) {
      time('> Bluetooth Device connected');
      log('result = ' + result);
      DisplayDeviceInfo(bluetoothDevice);
      GetCharacteristicNotification(result);
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

// GetCharacteristicNotification
//
//
function GetCharacteristicNotification(server) {
    serviceUuid = parseInt('0xABF0');
    characteristicUuid = parseInt('0xABF2');
    log('Getting Service...');
    server.getPrimaryService(serviceUuid)
  .then(service => {
    log('Getting Characteristic...');
    return service.getCharacteristic(characteristicUuid);
  })
  .then(characteristic => {
    myCharacteristic = characteristic;
    return myCharacteristic.startNotifications().then(_ => {
      log('> Notifications started');
      myCharacteristic.addEventListener('characteristicvaluechanged',
          handleNotifications);
    });
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
/*
function onStopButtonClick() {
  if (myCharacteristic) {
    myCharacteristic.stopNotifications()
    .then(_ => {
      log('> Notifications stopped');
      myCharacteristic.removeEventListener('characteristicvaluechanged',
          handleNotifications);
    })
    .catch(error => {
      log('Argh! ' + error);
    });
  }
}
*/
function handleNotifications(event) {
  let value = event.target.value;
  let a = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  log('> ' + a.join(' '));
}
