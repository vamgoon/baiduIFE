/**
 * Created by LoveS on 2016/5/29.
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

var creatDiv = (function () {

    function CreatDiv(options) {
        this.options = options || {};
        this.renderDiv();
        this.dragMove();
        this.dispear();
    }

    CreatDiv.prototype = {
        constructor: CreatDiv,
        initOptions: {
            outerClass: "outer",
            titleText: "默认标题",
            content: "默认内容"
        },
        renderDiv: function () {
            var that = this;
            var oBody = document.querySelector("body");
            var oOuterDiv = document.createElement("div");
            var outerClass = that.options.outerClass || that.initOptions.outerClass;

            oOuterDiv.setAttribute("class", outerClass);
            oOuterDiv.innerHTML = ""
                + "<div class='inner'>"
                + "<div class='titleText'></div>"
                + "<div class='content'></div>"
                + "<div class='footerBtn'>"
                + "<input type='button' value='取消'>"
                + "<input type='button' value='确定'>"
                + "</div></div>";
            oBody.insertBefore(oOuterDiv, oBody.firstChild);
        },
        renderData: function () {
            var that = this;
            var titleText = that.options.titleText || that.initOptions.titleText;
            var content = that.options.content || that.initOptions.content;
            var oTitleText = document.querySelector(".titleText");
            var oContent = document.querySelector(".content");

            oTitleText.innerHTML = titleText;
            oContent.innerHTML = content;
        },
        dragMove: function () {
            var oBox = document.querySelector(".inner"), disX = 0, disY = 0;

            oBox.onmousedown = function (event) {
                var e = event || window.event;
                disX = e.clientX - this.offsetLeft;
                disY = e.clientY - this.offsetTop;
                document.onmousemove = function (event) {
                    var e = event || window.event;
                    oBox.style.left = (e.clientX - disX) + 'px';
                    oBox.style.top = (e.clientY - disY) + 'px';
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        },
        dispear: function () {
            var oOutDiv = document.querySelector(".outer");

            addListener(oOutDiv, "click", function () {
                oOutDiv.style.display = "none";
            })
        }
    };

    function init(outerClass, title, content) {
        data = {
            outerClass: outerClass,
            titleText: title,
            content: content
        };
        var instance = new CreatDiv(data);
        instance.renderData();
        return instance;
    }

    return {
        init: init
    }
})();



