const button = document.querySelector('#the-button');

button.addEventListener('click', async function() {
    let options = {};
    options.acceptAllDevices = true;

    try {
        console.log('Requesting Bluetooth Device...');
        console.log('with ' + JSON.stringify(options));
        const device = await navigator.bluetooth.requestDevice(options);

        console.log('> Name:             ' + device.name);
        console.log('> Id:               ' + device.id);
        console.log('> Connected:        ' + device.gatt.connected);
    } catch (error) {
        console.log('Argh! ' + error);
    }
});