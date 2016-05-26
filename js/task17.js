/**
 * Created by LoveS on 2016/5/23.
 */

/**
 * addListener方法，跨浏览器的事件监听
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

/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};


// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
};

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
 * 当时间改变后，对日、周、月的数据进行处理
 * @param time
 */
function handleData(time) {
    var data = {};
    var week = {}, count = 0, singleWeek = {},
        month = {}, mcount = 0, singleMonth = {};

    for (var key in aqiSourceData) {
        if (aqiSourceData.hasOwnProperty(key)) {
            var tempCity = aqiSourceData[key];
            var keyArr = Object.getOwnPropertyNames(tempCity);
            var tempMonth = keyArr[0].slice(5, 7);
            var weekInit = 4, weekCount = 0;
            for (var i = 0; i < keyArr.length; i++, weekInit++) {
                count += tempCity[keyArr[i]];
                mcount += tempCity[keyArr[i]];
                weekCount++;
                if ((weekInit+1) % 7 == 0 || i == keyArr.length - 1 || keyArr[i+1].slice(5, 7) !== tempMonth) {
                    var tempKey = keyArr[i].slice(0, 7) + "月第" + (Math.floor(weekInit / 7) + 1) + "周";
                    singleWeek[tempKey] = Math.floor(count / weekCount);

                    if (i != keyArr.length - 1 && keyArr[i+1].slice(5, 7) !== tempMonth) {
                        weekInit = weekCount % 7;
                    }
                    count = 0;
                    weekCount = 0;

                    if (i == keyArr.length - 1 || keyArr[i+1].slice(5, 7) !== tempMonth) {
                        tempMonth = (i == keyArr.length - 1) ? keyArr[i].slice(5, 7) : keyArr[i+1].slice(5, 7);
                        var tempMKey = keyArr[i].slice(0, 7);
                        var tempDays = keyArr[i].slice(-2);
                        singleMonth[tempMKey] = Math.floor(mcount / tempDays);
                        mcount = 0;
                    }
                }
            }
            week[key] = singleWeek;
            month[key] = singleMonth;
            singleWeek = {};
            singleMonth = {};
        }
    }

    switch (time) {
        case "day":
                data = aqiSourceData;
            break;
        case "week":
            data = week;
            break;
        case "month":
            data = month;
            break;
    }

    return data;
}

/**
 * 渲染图表
 */
function renderChart() {

    var oDiv = document.querySelector(".aqi-chart-wrap");
    var cityName = pageState.nowSelectCity;
    oDiv.innerHTML = "";

    for (date in chartData[cityName]) {
            if (chartData[cityName].hasOwnProperty(date)) {
                oDiv.innerHTML += ""
                    + "<div class='aqi-char-div' style='height:"+chartData[cityName][date]
                    +"px;width:"
                    +(oDiv.offsetWidth/92)
                    +"px;margin-top:"
                    +(oDiv.offsetHeight-chartData[cityName][date])
                    +"px;background-color:"
                    +getColor()
                    +"'></div>"
            }
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(event) {
    // 确定是否选项发生了变化
    var evt = event || window.event;
    var target = evt.target || evt.srcElement;

    if (pageState.nowGraTime !== target.value) {
        pageState.nowGraTime = target.value;

        // 设置对应数据
        chartData = handleData(pageState.nowGraTime);

        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var selectCity = document.querySelector("#city-select");

    if (pageState.nowSelectCity !== selectCity.value) {
        // 设置对应数据
        pageState.nowSelectCity = selectCity.value;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var inputFieldset = document.querySelector("#form-gra-time");

    addListener(inputFieldset,"click",graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelector = document.querySelector("#city-select");
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    addListener(citySelector,"change",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    chartData = aqiSourceData;
    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();
