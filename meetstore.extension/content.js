;(function() {
    let meetTitle = "";
    let startDate = null;
    let endDate = null;
    const participants = new Set();
    // Add click event listener to Join call element
    let joinCallElem = getJoinCallElement();
    joinCallElem && joinCallElem.addEventListener("mousedown", () => {
        setStartDate();
        addLeaveCallListener();
        updateMeetTitle();
        observeParticipants();
    });
    // Add beforeunload event listener for tab/browser close */
    window.addEventListener("beforeunload", () => {
        if (startDate && !endDate) {
            setEndDate();
            sendResult();
        }
    });

    /** Returns DOM element that joins call on click event */ 
    function getJoinCallElement() {
        let joinCallElem = null;
        for (let elem of document.querySelectorAll("div > span")) {
            if (["Join now", "Ask to join"].indexOf(elem.textContent) !== -1) {
                joinCallElem = elem;
                break;
            }
        }
        return joinCallElem;
    }
    /** Sets start date-time for the meet */
    function setStartDate() {
        startDate = new Date();
    }
    /** Sets end date-time for the meet */
    function setEndDate() {
        endDate = new Date();
    }
    /** Waits until Leave call element exists and Add click event listener to it */
    function addLeaveCallListener() {
        let interval = setInterval(() => {
            let leaveCallElem = document.querySelector("div[data-tooltip='Leave call']");
            if (!!leaveCallElem) {
                clearInterval(interval);
                leaveCallElem.addEventListener("mousedown", () => {
                    setEndDate();
                    sendResult();
                });
            }
        }, 1000);
    }
    /** Formats and updates meet title */
    function updateMeetTitle() {
        let scheduledMeetElem = document.querySelector("[data-meeting-title]");
        let nicknamedMeetElem = document.querySelector("[aria-label^='Details for']")
        let instaMeetElem = document.querySelector("[aria-label='Meeting details']");
        let fallbackMeetElem = document.getElementsByClassName("Jyj1Td CkXZgc")[0];
        if (scheduledMeetElem || nicknamedMeetElem || fallbackMeetElem) {
            meetTitle = (scheduledMeetElem || nicknamedMeetElem || fallbackMeetElem).innerText.split('\n')[0].trim();
        } else if (instaMeetElem) {
            meetTitle = "insta Meet";
        } else {
            setTimeout(updateMeetTitle, 5000);
            return;
        }
        if (!instaMeetElem && meetTitle === "Meeting details") {
            setTimeout(updateMeetTitle, 5000);
        }
    }
    /** Observes new pariticipant addition */
    function observeParticipants() {
        let participantElems = document.querySelectorAll("[data-participant-id], [data-requested-participant-id]");
        for (let p of participantElems) {
            let name = (p.outerText || p.innerText).split('\n')[0].trim();
            participants.add(name);
        }
        setTimeout(observeParticipants, 5000);
        // const mObserver = new MutationObserver((mutations) => {});
        // mObserver.observe(participantsPanel, {
        //     subtree: true,
        //     childList: true,
        //     attributes: true,
        // });
    }
    /** Sends mmet info to the background script */
    function sendResult() {
        chrome.runtime.sendMessage({
            "startDate": startDate.toLocaleString(), 
            "endDate": endDate.toLocaleString(),
            "meetTitle": meetTitle,
            "attendees": [...participants].join(", ")
        });
    }
})();

/** Listener for background sent messages */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.info(request);
});
