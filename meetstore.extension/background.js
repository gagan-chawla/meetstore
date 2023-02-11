import ENV from './env.js'

function makeRequest(params) {
    const url = ENV.MEETSTORE_APPS_SCRIPT_URL;
    const urlParams = new URLSearchParams(Object.entries(params));
    return fetch(`${url}?${urlParams.toString()}`, {
        method: 'POST'
    }).then(
        r => {},
        e => {
            params['error'] = e;
            chrome.storage.local.get(['__MEETSTORE'], function(result) {
                let mStore = result.__MEETSTORE || [];
                mStore.push(params);
                chrome.storage.local.set({__MEETSTORE: mStore}, () => {});
            });
        }
    );
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.activate) {
        // chrome.pageAction.show(sender.tab.id);
        chrome.storage.local.get(['__MEETSTORE'], async function(result) {
            let mStore = result.__MEETSTORE || [];
            chrome.storage.local.set({__MEETSTORE: []}, () => {});
            for (let entry of mStore) {
                delete entry.error;
                await makeRequest(entry);
            }
        });
    } else {
        const params = {
            start_date: request.startDate,
            end_date: request.endDate,
            title: request.meetTitle,
            attendees: request.attendees
        };
        makeRequest(params);
    }
    return true;
});
