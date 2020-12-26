import ENV from './env.js'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.activate) {
        chrome.pageAction.show(sender.tab.id);
    } else {
        const url = ENV.MEETSTORE_APPS_SCRIPT_URL;
        const params = {
            start_date: request.startDate,
            end_date: request.endDate,
            title: request.meetTitle,
            attendees: request.attendees
        };
        const urlParams = new URLSearchParams(Object.entries(params));
        fetch(`${url}?${urlParams.toString()}`, {
            method: 'POST'
        }).then(
            () => {},
            e => {
                params['error'] = e;
                chrome.storage.local.get(['__MEETSTORE'], function(result) {
                    let mStore = result.__MEETSTORE || [];
                    mStore.push(params);
                    chrome.storage.local.set({__MEETSTORE: mStore}, () => {});
                });
            }
        )
    }
    return true;
});
