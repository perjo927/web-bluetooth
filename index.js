import './main.css';

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

async function onStartButtonClick() {

    let serviceUuid = "immediate_alert";
    let characteristicUuid = "alert_level";

    try {
        console.log('Requesting Bluetooth Device...');
        let options = {};
        options.filters = [{ services: [serviceUuid] }];
        // options.acceptAllDevices = true; // if no filter
        const device = await navigator.bluetooth.requestDevice(options);
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(serviceUuid);
        myCharacteristic = await service.getCharacteristic(characteristicUuid);
        await myCharacteristic.startNotifications();

        logger('> Notifications started');
        myCharacteristic.addEventListener(
            'characteristicvaluechanged',
            handleNotifications
        );

    } catch (error) {
        console.log(error);
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
            console.log(error);
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