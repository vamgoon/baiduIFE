/**
 * Created by LoveS on 2016/5/23.
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

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

function checkInput(cityName, airNum) {
    var reCityName = /[^\u4e00-\u9fa5a-zA-z]/gi;
    var reAirNum = /[^\d+]/g;

    if (cityName.length === 0 || airNum.length === 0) {
        alert("输入不能为空，请重新输入");
    }
    else if (reCityName.test(cityName)) {
        alert("输入有误，请输入正确的中/英文城市名称");
    }
    else if (reAirNum.test(airNum)) {
        alert("输入有误，请输入正确的空气质量指数");
    }
    else {
        return true;
    }

}

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var cityName = document.querySelector("#aqi-city-input").value.trim();
    var airNum = document.querySelector("#aqi-value-input").value.trim();

    if (checkInput(cityName, airNum)) {
        aqiData[cityName] = +airNum;
    }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var oTable = document.querySelector("#aqi-table");
    oTable.innerHTML = "<tbody></tbody>";
    var oTbody = document.querySelector("tbody");
    oTbody.innerHTML = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";

    for (city in aqiData) {
        if (aqiData.hasOwnProperty(city)) {
            oTbody.innerHTML += "<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button>删除</button></td></tr>";
        }
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event) {
    // do sth.
    var evt = event || window.event;
    var target = evt.target || evt.srcElement;

    if (target.nodeName.toLowerCase() === "button") {
        document.querySelector("tbody").removeChild(target.parentNode.parentNode);
    }

}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    var addBtn = document.querySelector("#add-btn");
    var oTable = document.querySelector("#aqi-table");

    addListener(addBtn, "click", addBtnHandle);
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    addListener(oTable, "click", delBtnHandle);
}

init();
