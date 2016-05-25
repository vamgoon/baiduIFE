/**
 * Created by LoveS on 2016/5/25.
 */

/**
 * addListener方法，跨浏览器的时间监听
 * @param element
 * @param event
 * @param listener
 */
function addListener(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }
}

function checkInput(valueIn) {

    if (valueIn.length === 0) {
        alert("输入不能为空，请重新输入");
    }
    else if (/[^a-zA-Z\s+\d]/gi.test(valueIn)) {
        alert("输入有误，请输入正确指令");
    }
    else {
        return true;
    }
}

function handler() {
    var $commandInput = $("#commandInput");
    var $commandInputValue = $commandInput.val();

    if (checkInput($commandInputValue)) {
        activeDiv.checkCommand($commandInputValue);
    }

}

function init() {
    activeDiv.init(5, 5);
    
    var $commandBtn = $("#commandBtn")[0];

    addListener($commandBtn, "click", handler);
}

init();