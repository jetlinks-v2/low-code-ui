const manageAndEmit = ["Start", "Add", "Remove", "Update", "End"];
const emit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
const manage = ["Move"];
// 
const eventHandlerNames = [manage, manageAndEmit, emit]
    .flatMap(events => events) // flatMap会返回一个新的数组，不会改变原数组的元素
    .map(evt => `on${evt}`);

const events = {
    manage,
    manageAndEmit,
    emit
};

function isReadOnly(eventName) {
    return eventHandlerNames.indexOf(eventName) !== -1;
}

export { events, isReadOnly };
