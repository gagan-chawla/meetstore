console.info("Meetstore ON");

(function () {
    var startDate = null, 
        endDate = null;

    let elements = document.querySelectorAll("div > span"),
        buttonTexts = ["Join now", "Ask to join"],
        joinCallElement = null;

    for (let element of elements) {
        if (buttonTexts.indexOf(element.textContent) !== -1) {
            joinCallElement = element;
            break;
        }
    }

    joinCallElement && joinCallElement.addEventListener("mousedown", e => {
        startDate = new Date();
        let interval = setInterval(() => {
            leaveCallElement = document.querySelectorAll("div[data-tooltip='Leave call']")[0];
            if (!!leaveCallElement) {
                clearInterval(interval);
                leaveCallElement.addEventListener("mousedown", e => {
                    endDate = new Date();
                    storeResult();
                });
            }
        }, 1000);
    });

    window.addEventListener("beforeunload", e => {
        console.log("Unload");
        if (startDate && !endDate) {
            endDate = new Date();
            storeResult();
        }
    });

    function storeResult() {
        console.log('Store');
        chrome.runtime.sendMessage({ "startDate": startDate.toLocaleString(), "endDate": endDate.toLocaleString() });
    }
})();

chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
    console.info(request);
});

