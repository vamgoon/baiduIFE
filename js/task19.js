/**
 * Created by LoveS on 2016/5/24.
 */

var o = {
    arr: [],
    leftOut: function () {
        if (this.arr.length !== 0) {
            var shiftValue = this.arr.shift();
            alert(shiftValue);
        }
        else {
            alert("请先输入");
        }
    },
    leftIn: function (data) {
        if (checkInput(data)){
            this.arr.unshift(data);
        }
    },
    rightIn: function (data) {
        if (checkInput(data)){
            this.arr.push(data);
        }
    },
    rightOut: function () {
        if (this.arr.length !== 0) {
            var popValue = this.arr.pop();
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

function getFiftyNums() {
    var data = [];

    for (var i = 0; i < 50; i++) {
        data.push(Math.round(90*Math.random()+10));
    }

    return data;
}

/**
 * arrSort，冒泡排序算法
 * @param arr
 */
function arrSort(arr) {
    var i, j, temp, swap = [];
    for (i=0;i<arr.length-1;i++) {
        for (j = i + 1; j < arr.length; j++) {
            if (arr[i]>arr[j]) {
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                swap.push(JSON.parse(JSON.stringify(arr)));
            }
        }
    }

    return swap;
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
        return "<div style='background-color:"+getColor()+";height:"+4*x+"px;margin-top:"+(500-4*x)+"px;'></div>";
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
        if (target.value === "fiftyNums") {
            o.arr = getFiftyNums();
            render(o.arr);
        }
        else if (target.value === "sortData") {
            var swap = arrSort(o.arr);
            var timer = setInterval(paint, 100);
            function paint() {
                var snapshot = swap.shift();
                if (snapshot.length !== 0) {
                    render(snapshot);
                }
                else {
                    clearInterval(timer);
                }
            }
        }
        else {
            o[target.value](inputTrim);
            inputValue.value = "";
            render(o.arr);
        }
    }
    else if (target.nodeName === "SPAN") {
        var index = [].indexOf.call(target.parentNode.parentNode.children, target.parentNode);

        o.arr.splice(index,1);
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