chrome.storage.local.get(['__MEETSTORE'], function(result) {
    let mStore = result.__MEETSTORE || [];
    for (entry of mStore) {
        delete entry.error;
        chrome.runtime.sendMessage(entry);
    }
    chrome.storage.local.set({__MEETSTORE: []}, () => {});
});
