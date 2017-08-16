const button = document.querySelector('#the-button');

button.addEventListener('click', function() {
    // navigator.bluetooth.requestDevice({
    //     filters: [{
    //         services: ['battery_service']
    //     }]
    // }).then(device => {
    //     console.log('Got device:', device.name);
    //     alert(device.name);        
    //     console.log('id:', device.id);
    //     return device.gatt.connect(); // Chromium 49 and below use `connectGATT()` but from Chromium 50 it will use gatt.connect();
    // })
    // .then(server => {
    //     console.log('Getting Battery Service…');
    //     alert('Getting Battery Service…');
    //     return server.getPrimaryService('battery_service');
    // })
    // .then(service => {
    //     console.log('Getting Battery Characteristic…');
    //     return service.getCharacteristic('battery_level');
    // })
    // .then(characteristic => {
    //     console.log('Reading battery level…');
    //     return characteristic.readValue();
    // })
    // .then(value => {
    //     value = value.buffer ? value : new DataView(value);
    //     console.log('Battery percentage:', value.getUint8(0));
    // })
    // .catch(exception => {
    //     console.log(exception);
    //     alert(exception);
    // });
    let options = {};
    options.acceptAllDevices = true;
    navigator.bluetooth.requestDevice(options)
        .then(device => {
            console.log(device);
            console.log('> Connected:        ' + device.gatt.connected);
        })
        .catch(error => {
            console.log('Argh! ' + error);
        });
});