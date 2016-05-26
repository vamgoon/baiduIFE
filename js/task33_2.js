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
    else {
        return valueIn.split(/([A-Z]+)\s+(\d+)/g);
    }
}

function handler() {
    var $commandInput = $("#commandInput");
    var $commandInputValue = $commandInput.val();
    var x = checkInput($commandInputValue);

    if (x) {
        activeDiv.checkCommand(x[0] || x[1],x[2]);
    }

}

function init() {
    activeDiv.init(2, 3);
    
    var $commandBtn = $("#commandBtn")[0];

    addListener($commandBtn, "click", handler);
}

init();