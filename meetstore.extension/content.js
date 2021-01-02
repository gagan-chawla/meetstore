chrome.runtime.sendMessage({"activate": true});

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
                updateMeetTitle();
                leaveCallElem.addEventListener("mousedown", () => {
                    setEndDate();
                    sendResult();
                });
            }
        }, 1000);
    }
    /** Formats and updates meet title */
    function updateMeetTitle(retry=0) {
        let scheduledMeetElem = document.querySelector("[data-meeting-title]");
        let scheduledMeetTitle = !!scheduledMeetElem ? scheduledMeetElem.innerText.split('\n')[0].trim() : null;
        if (retry === 3) {
            let fallbackMeetElem = document.getElementsByClassName("Jyj1Td CkXZgc")[0];
            meetTitle = (fallbackMeetElem && fallbackMeetElem.innerText.split('\n')[0].trim()) || "Unknown";
        } else if (!scheduledMeetTitle || scheduledMeetTitle.startsWith("Meeting details")) {
            setTimeout(updateMeetTitle, 5000, retry+1);
        } else {
            meetTitle = scheduledMeetTitle;
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
        // const mObserver = new MutationObserver((mutations) => {mObserver.disconnect();});
        // mObserver.observe(participantsPanel, {
        //     subtree: true,
        //     childList: true,
        //     attributes: true,
        // });
    }
    /** Sends meet info to the background script */
    function sendResult() {
        chrome.runtime.sendMessage({
            "startDate": startDate.toLocaleString(), 
            "endDate": endDate.toLocaleString(),
            "meetTitle": meetTitle,
            "attendees": [...participants].join(", ")
        });
    }
})();
