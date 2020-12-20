chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let url = "<MEETSTORE_APPS_SCRIPT_URL>";
    fetch(`${url}?start_date=${request.startDate}&end_date=${request.endDate}`, {
        method: 'POST'
    }).then(
        r => {
            console.log("Success", r);
        },
        e => {
            console.log("Error", e);
        }
    )
    return true;
});

