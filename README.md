#  BDI
`Bluetooth Device Interface`  
Simple C library to encapsulate the BLE(Bluetooth Low Energy)communication API of [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/) (Espressif IoT Development Framework).

# Usage
To compile programs with `bdi`, you need to include `bdi.h`.  

`bdi.c` contains the implementation of the interface functions exposed by the header files as well as the relevant auxiliary code for Bluetooth communication.  
`bdi.h` contains the declaration of the interface functions.  
`mockdata_t.h` contains the declaration of the structure of the data packets to be sent.  

- `void bdi_port_init(bdi_port_t state_init);`  
Used to initialize the Bluetooth device, accepting a parameter defined by `bdi_port_t`.  
- `void bdi_port_init_default(void);`  
Used to initialize the Bluetooth device using default values, without accepting any parameters.  
- `void bdi_begin_advertising(void);`  
Initiates slave device advertising.

This debugging tool is based on a [Web Bluetooth demo](https://googlechrome.github.io/samples/web-bluetooth/notifications.html).

# Limitations
Can only send fixed length data packet defined in `mockdata_t.h`.

# License
None.  
Credits go to [ble_spp_server](https://github.com/espressif/esp-idf/tree/master/examples/bluetooth/bluedroid/ble/ble_spp_server) and [Web Bluetooth API](https://googlechrome.github.io/samples/web-bluetooth/).
