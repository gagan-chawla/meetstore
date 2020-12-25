import ENV from './env.js'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const url = ENV.MEETSTORE_APPS_SCRIPT_URL;
    const params = {
        start_date: request.startDate,
        end_date: request.endDate,
        title: request.meetTitle,
        attendees: request.attendees
    };
    const urlParams = new URLSearchParams(Object.entries(params));
    fetch(`${url}?${urlParams.toString()}`, {
        method: "POST"
    }).then(
        () => {},
        e => {
            params["error"] = e;
            // store params and error in local storage along with error
        }
    )
    return true;
});

// on start, check local storage and make requests
