let test_data = {
    "hygrometers": [
        {
            "pos": { "x": 1, "y": 1 }
        },
        {
            "pos": { "x": 1, "y": 2 }
        },
        {
            "pos": { "x": 1, "y": 3 }
        },
        {
            "pos": { "x": 1, "y": 4 }
        },
        {
            "pos": { "x": 2, "y": 1 }
        },
        {
            "pos": { "x": 2, "y": 2 }
        },
        {
            "pos": { "x": 2, "y": 3 }
        },
        {
            "pos": { "x": 2, "y": 4 }
        },
        {
            "pos": { "x": 3, "y": 1 }
        },
        {
            "pos": { "x": 3, "y": 2 }
        },
        {
            "pos": { "x": 3, "y": 3 }
        },
        {
            "pos": { "x": 3, "y": 4 }
        },
        {
            "pos": { "x": 4, "y": 1 }
        },
        {
            "pos": { "x": 4, "y": 2 }
        },
        {
            "pos": { "x": 4, "y": 3 }
        },
        {
            "pos": { "x": 4, "y": 4 }
        },
    ],

    "groups": [
        {
            "ids":
                [
                    0, 1, 2, 3
                ],
            "color": "#00ffffff"
        },
        {
            "ids":
                [
                    4, 5, 6, 7
                ],
            "color": "#00ffffff"
        },
        {
            "ids":
                [
                    8, 9, 10, 11
                ],
            "color": "#00ffffff"
        },
        {
            "ids":
                [
                    12, 13, 14, 15
                ],
            "color": "#00ffffff"
        },
    ],

    "hygrometerGridSize": { "x": 2, "y": 4 }
}


class Hygrometers {
    constructor(data) {
        this.groups = [];
        this.meters = [];
        this.size = { x: 0, y: 0 }

        for (let hygrometer_id in data.hygrometers) {
            let meter_data = data.hygrometers[hygrometer_id];

            let hygrometer = new Hygrometer(meter_data.pos, hygrometer_id);

            this.meters[hygrometer_id] = hygrometer;
        }

        for (let g in data.groups) {
            let group = new HygrometerGroup(g);
            this.groups.push(group);

            let hygrometer_ids = data.groups[g].ids;

            for (let hygrometer_id in hygrometer_ids)
                group.addHygrometer(this.meters[hygrometer_ids[hygrometer_id]])

            group.color = data.groups[g].color
        }

        this.size = data.hygrometerGridSize;

    }

    getMeter(id) {
        for (let meter_id in this.meters) {
            let meter = this.meters[meter_id];

            if (meter.id == id)
                return meter;
        }
    }

    updateData(data) {
        for (let data_id in data.hygrometer_values) {
            let hygrometer_data = data.hygrometer_values[data_id];

            let meter = this.getMeter(hygrometer_data.id);
            meter.data = hygrometer_data.value
        }
    }
}

class HygrometerGroup {
    constructor(groupID) {
        this.groupID = groupID;

        this.hygrometers = [];
        this.color = "#00000000";

        this.irrigating = false;
    }

    addHygrometer(hygrometer) {
        this.hygrometers.push(hygrometer);

        hygrometer.group = this;
    }
}

class Hygrometer {
    constructor(pos, id) {
        this.pos = pos;
        this.id = id;
        this.data = -1;

        this.wasOK = false;
    }

    isOK() {
        if (this.data == -1)
            return false;

        return true;
    }
}
var hygrometers = null;
