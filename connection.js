var evtSource = new EventSource("http://main.local/events", { withCredentials: false });

evtSource.addEventListener("update", (event) => {
    console.log(event.data)
    let evtObj = JSON.parse(event.data);
    hygrometers.updateData(evtObj);
    devices.load(evtObj);

    ReloadDeviceDisplay();
});

evtSource.addEventListener("config", (event) => {
    console.log("Config got data: " + event.data)

    let evtObj = JSON.parse(event.data);
    hygrometers = new Hygrometers(evtObj);
    devices.load(evtObj);

    ReloadGreenhouseDisplay();
    ReloadGroupDisplay();
    ReloadDeviceDisplay();
});

evtSource.onopen = () => {
    console.log("Events connected!");
}

evtSource.onerror = () => {
    console.log("Events disconnected!");
}