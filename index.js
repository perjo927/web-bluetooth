import './main.css';

const results = document.querySelector('#log');

function logger(text) {
    let message = document.createElement('div');
    message.textContent = text;
    results.appendChild(message);
}

function isWebBluetoothEnabled() {
    if (navigator.bluetooth) {
        return true;
    } else {
        logger('Web Bluetooth API is not available.\n' +
            'Please make sure the "Experimental Web Platform features" flag is enabled.');
        return false;
    }
}

document.querySelector('#start').addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isWebBluetoothEnabled()) {
        start();
    }
});
document.querySelector('#stop').addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isWebBluetoothEnabled()) {
        stop();
    }
});

var characteristic;

async function start() {

    const serviceUuid = "immediate_alert";
    const characteristicUuid = "alert_level";

    try {
        let options = {};
        options.filters = [{ services: [serviceUuid] }];

        const device = await navigator.bluetooth.requestDevice(options);
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(serviceUuid);
        characteristic = await service.getCharacteristic(characteristicUuid);
        await characteristic.startNotifications();

        logger('Notifications enabled');
        characteristic.addEventListener('characteristicvaluechanged', handleNotifications);

    } catch (error) {
        logger(error);
    }
}

async function stop() {
    if (characteristic) {
        try {
            await characteristic.stopNotifications();
            logger('Notifications disabled');
            characteristic.removeEventListener('characteristicvaluechanged', handleNotifications);
        } catch (error) {
            logger(error);
        }
    }
}

function handleNotifications(event) {
    let value = event.target.value;
    let uint8 = value.getUint8();
    logger(uint8);
}