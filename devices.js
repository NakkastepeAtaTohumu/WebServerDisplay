var test_device_data = {
    "devices": [
        {
            "name": "test_0",
            "type": "test",
            "mac": "00:00:00:00:00:00",
            "data": {}
        },
        {
            "name": "test_0",
            "type": "test",
            "mac": "00:00:00:00:00:01",
            "data": {}
        },
        {
            "name": "test_0",
            "type": "test",
            "mac": "00:00:00:00:00:02",
            "data": {}
        },
    ]
}

function DeviceDisplays() {
    this.displayFunctions = [];

    this.displayFunctions.push({
        "targetType": "sensorModule",
        "function": function (s) {
            s.fill(this.ok ? "#207fff" : "#FF0000");
            s.textSize(config.device_display_textsizes[2]);
            s.text("SENSOR: " + this.name, 0, config.device_display_textsizes[2]);

            if (!this.ok) {
                s.textSize(config.device_display_textsizes[3]);
                s.text("ERROR", 0, config.device_display_textsizes[2] + config.device_display_textsizes[3] + 10);
                return;
            }

            s.fill(255);
            s.textSize(config.device_display_textsizes[1]);
            s.text("CO2: " + this.data.CO2 + "\nTemperature: " + Math.floor(this.data.temp * 10) / 10.0 + "°" + "\nHumidity:" + Math.floor(this.data.humidity * 10) / 10.0 + "%", 0, config.device_display_textsizes[2] + config.device_display_textsizes[1] + 10);
        }
    })

    this.displayFunctions.push({
        "targetType": "valveModule",
        "function": function (s) {
            s.fill(this.ok ? "#BFFF2F" : "#FF0000");
            s.textSize(config.device_display_textsizes[2]);
            s.text("VALVE: " + this.name, 0, config.device_display_textsizes[2]);

            if (!this.ok) {
                s.textSize(config.device_display_textsizes[3]);
                s.text("ERROR", 0, config.device_display_textsizes[2] + config.device_display_textsizes[3] + 10);
                return;
            }

            s.fill(255);
            s.textSize(config.device_display_textsizes[2]);

            let str = "";
            str += this.data.state & 1 ? " ON" : " OFF";
            str += this.data.state & 2 ? " ON" : " OFF";
            str += this.data.state & 4 ? " ON" : " OFF";
            str += this.data.state & 8 ? " ON" : " OFF";

            s.text("S:" + str, 0, config.device_display_textsizes[2] + config.device_display_textsizes[2] + 10);
        }
    })

    this.defaultDisplayFunction = function (s) {
        s.fill("#ff0000");
        s.textSize(config.device_display_textsizes[2]);
        s.text("UNKNOWN DEVICE", 0, config.device_display_textsizes[2]);

        s.fill(255);
        s.textSize(config.device_display_textsizes[0]);
        s.text("Name: " + this.name + ", type: " + this.type + "\nMAC:" + this.mac, 0, config.device_display_textsizes[2] + config.device_display_textsizes[0] + 10);
    }

    this.get = function (device) {
        for (let fID in this.displayFunctions) {
            let f = this.displayFunctions[fID];
            if (f.targetType == device.type)
                return f.function;
        }

        return this.defaultDisplayFunction;
    }
}

var deviceDisplays = new DeviceDisplays();

class Device {
    constructor(name, type, mac, index, ok, data) {
        this.name = name;
        this.type = type;
        this.mac = mac;
        this.index = index;
        this.data = data;
        this.ok = ok;

        this.display = deviceDisplays.get(this);
    }
}

class Devices {
    constructor() {
        this.devices = [];
    }

    load(data) {
        this.devices = []
        for (let d_id in data.devices) {
            let device = data.devices[d_id];

            let d_obj = new Device(device.name, device.type, device.mac, this.devices.length, device.ok, device.data);
            this.devices.push(d_obj);
        }
    }
}

var devices = new Devices();

//devices.load(test_device_data)