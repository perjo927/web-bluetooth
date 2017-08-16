const results = document.querySelector('#results');

function logger(text) {
    let message = document.createElement('div');
    message.textContent = text;
    results.appendChild(message);
}

function isWebBluetoothEnabled() {
    if (navigator.bluetooth) {
        return true;
    } else {
        console.log('Web Bluetooth API is not available.\n' +
            'Please make sure the "Experimental Web Platform features" flag is enabled.');
        return false;
    }
}

document.querySelector('#startNotifications').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    if (isWebBluetoothEnabled()) {
        onStartButtonClick();
    }
});
document.querySelector('#stopNotifications').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    if (isWebBluetoothEnabled()) {
        onStopButtonClick();
    }
});
var myCharacteristic;


/* accepts devices with a specific service open */

async function onStartButtonClick() {

    let serviceUuid = document.querySelector('#service').value;
    if (serviceUuid.startsWith('0x')) {
        serviceUuid = parseInt(serviceUuid);
    }

    let characteristicUuid = document.querySelector('#characteristic').value;
    if (characteristicUuid.startsWith('0x')) {
        characteristicUuid = parseInt(characteristicUuid);
    }

    try {
        console.log('Requesting Bluetooth Device...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [serviceUuid] }]
        });

        console.log('Connecting to GATT Server...');
        const server = await device.gatt.connect();

        console.log('Getting Service...');
        const service = await server.getPrimaryService(serviceUuid);

        console.log('Getting Characteristic...');
        myCharacteristic = await service.getCharacteristic(characteristicUuid);

        await myCharacteristic.startNotifications();

        logger('> Notifications started');
        myCharacteristic.addEventListener(
            'characteristicvaluechanged',
            handleNotifications
        );

    } catch (error) {
        console.log('Argh! ' + error);
        logger(error);
    }
}

async function onStopButtonClick() {
    if (myCharacteristic) {
        try {
            await myCharacteristic.stopNotifications();
            console.log('> Notifications stopped');
            myCharacteristic.removeEventListener('characteristicvaluechanged',
                handleNotifications);
        } catch (error) {
            console.log('Argh! ' + error);
            logger(error);
        }
    }
}
function handleNotifications(event) {
    let value = event.target.value;
    logger(value);

    let a = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < value.byteLength; i++) {
        a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    }
    const text = '> ' + a.join(' ');
    console.log(text);
    logger(text);

}

/* accepts devices with any service open */

const button = document.querySelector('#the-button');

button.addEventListener('click', async function () {
    let options = {};
    options.acceptAllDevices = true;
    console.log("Pairing in progress");


    try {
        console.log('Requesting Bluetooth Device...');
        console.log('with ' + JSON.stringify(options));
        const device = await navigator.bluetooth.requestDevice(options);

        console.log('> Name:             ' + device.name);
        console.log('> Id:               ' + device.id);
        console.log('> Connected:        ' + device.gatt.connected);
    } catch (error) {
        console.log('Argh! ' + error);
        logger(error);
    }

});