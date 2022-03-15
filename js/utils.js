"use strict";

function _byId(elementId) {
	return document.getElementById(elementId);
}

function prettyJson(elementId, backupElementId) {
    try {
        const ugly = _byId(elementId).value;
        if(backupElementId) {
            _byId(backupElementId).value = ugly;
        }
        const obj = JSON.parse(ugly);
        const pretty = JSON.stringify(obj, undefined, 4);
        _byId(elementId).value = pretty;
    } catch (e) {
        console.log(e);
    }
}

function undoPrettyJson(backupElementId, elementId) {
    if(_byId(backupElementId).value) {
        _byId(elementId).value = _byId(backupElementId).value;
    }
}

function clearElementValue(elementId) {
    _byId(elementId).innerHTML = "";
}

function replaceDefaultConsoleLog(targetElementId) {
    let old = console.log;
    let logger = _byId(targetElementId);
    console.log = function (message) {
        old(message);
        logger.innerHTML += message + '\n\n';
    }
}

function appendValue(targetElementId, value) {
    _byId(targetElementId).innerHTML = value;
}