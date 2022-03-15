"use strict";

var itemsView;

window.onload = function() {
    //replaceDefaultConsoleLog('debug-console');
    appendValue('sample-response',EXAMPLE_RESPONSE);
	prettyJson('sample-response');
}

function receiveFromApi(elementIdWithResponse) {
    itemsView = new ItemsView(_byId(elementIdWithResponse).value);
    itemsView.printItems();
}

function selectItem(itemId) {
    itemsView.selectItem(itemId);
    itemsView.printItems();
}