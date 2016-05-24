/**
 * Created by LoveS on 2016/5/24.
 */

var o = {
    str: [],
    leftOut: function () {
        if (this.str.length !== 0) {
            var shiftValue = this.str.shift();
            alert(shiftValue);
        }
        else {
            alert("请先输入");
        }
    },
    leftIn: function (data) {
        if (checkInput(data)){
            this.str.unshift(data);
        }
    },
    rightIn: function (data) {
        if (checkInput(data)){
            this.str.push(data);
        }
    },
    rightOut: function () {
        if (this.str.length !== 0) {
            var popValue = this.str.pop();
            alert(popValue);
        }
        else {
            alert("请先输入");
        }
    }
};

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


/**
 * 随机获取七种颜色
 * @returns {string}
 */
function getColor() {
    var colorList = ["#FF3333","#FF8533","#FFFF00","#007700","#68EB48","#4B4BF9","#840584"];
    var randomNum = Math.round(6*Math.random());

    return colorList[randomNum];
}

/**
 * render方法，进行数据加载操作
 * @param data(data为数组)
 */
function render(data) {

    var oDiv = document.querySelector("#container");

    oDiv.innerHTML = "";
    oDiv.innerHTML += data.map(function (x) {
        return "<div style='background-color:"+getColor()+"'><span>"+x+"</span></div>";
    }).join("");
}

/**
 * checkInput方法，检查输入是否正确
 * @param valueIn
 */
function checkInput(valueIn) {

    if (valueIn.length === 0) {
        alert("输入不能为空，请重新输入");
    }
    else if (/[\s+]/g.test(valueIn)) {
        alert("输入有误，数字间不能有空格，请重新输入");
    }
    else if (/[^\d+]/g.test(valueIn)) {
        alert("输入有误，请输入纯数字");
    }
    else {
        return true;
    }
}

/**
 * handle方法，对按钮点击进行响应
 * @param event
 */
function handle(event) {
    var evt = event || window.event;
    var target = evt.target || evt.srcElement;
    var inputValue = document.querySelector("#textInput");
    var inputTrim = inputValue.value.trim();

    if (target.nodeName === "BUTTON") {
        o[target.value](inputTrim);
        render(o.str);
    }
    else if (target.nodeName === "SPAN") {
        var index = [].indexOf.call(target.parentNode.parentNode.children, target.parentNode);

        o.str.splice(index,1);
        alert(target.innerText);
        target.parentNode.parentNode.removeChild(target.parentNode);
    }
}

/**
 * 事件监听
 */
function initBtn() {
    var oBody = document.querySelector("body");

    addListener(oBody,"click",handle);
}

function init() {
    initBtn();
}

init();