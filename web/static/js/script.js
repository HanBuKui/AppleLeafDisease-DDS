var cur_scan_id;
var rtc_connect = 0;

/* ************************************** 智云服务创建解析 **************************** */
$(function () {

    /* ******************************************** 智云服务 ******************************* */
    function getConnect() {
        //id key server mac在config.js中配置，详见config.js  --->  config对象
        config["id"] = config["id"] ? config["id"] : $("#ID").val();
        config["key"] = config["key"] ? config["key"] : $("#KEY").val();
        config["server"] = config["server"] ? config["server"] : $("#server").val();
        config["Sensor_A"] = config["Sensor_A"] ? config["Sensor_A"] : $("#Sensor_A").val();

        /* ******************************************** 创建数据连接服务对象 ****************** */
        rtc = new WSNRTConnect(config["id"], config["key"]);
        rtc.setServerAddr(config["server"] + ":28080");
        rtc.connect();

        /* ******************************************** 连接成功回调函数 ********************* */
        rtc.onConnect = function () {
            $("#idkeyInput").text("断开").addClass("btn-danger");
            $("#id,#key,#server").attr('disabled', true);
            rtc_connect = 1;
            message_show("数据服务连接成功！");
        };

        /* ******************************************** 数据服务掉线回调函数 ****************** */
        rtc.onConnectLost = function () {
            $("#idkeyInput").text("连接").removeClass("btn-danger");
            $(".online_Sensor_A").text("离线").css("color", "#e75d59");
            $("#id,#key,#server").removeAttr('disabled');
            rtc_connect = 0;
            message_show("数据服务连接失败，检查网络或IDKEY");
        };

        /* ******************************************** 消息处理回调函数 ********************** */
        rtc.onmessageArrive = function (mac, dat) {
            if (dat[0] == '{' && dat[dat.length - 1] == '}') {
                dat = dat.substr(1, dat.length - 2);
                var its = dat.split(',');
                for (var x in its) {
                    var t = its[x].split('=');
                    if (t.length != 2) continue;

                    //t[0]存放ZXBee协议"键值对"的"键"，t[1]存放ZXBee协议"键值对"的"值"
                    //Sensor_A传感器数据上报信息处理
                    if (config['Sensor_A'] == mac) {
                        $(".online_Sensor_A").text("在线").css("color", "#96ba5c");
                        //温度，配置详情见config.js  --->  sensor.temp对象
                        if (t[0] == sensor.temp.tag) {//sensor.temp.tag即A0
                            thermometer('temp', "℃", "#ff2400", -20, 100, t[1]);
                        }
                        //湿度，配置详情见config.js  --->  sensor.humi对象
                        if (t[0] == sensor.humi.tag) {//sensor.humi.tag即A1
                            thermometer('humi', '%', '#27A9E3', 0, 100, t[1]);
                        }
                        //自动模式 && 水泵
                        if (config["curMode"] == "auto-mode" && t[0] == sensor.humi.tag) {//sensor.humi.tag即D1
                            // 超过较大值，关闭水泵
                            if (t[1] > config["data-cur_max"]) {
                                message_show("高于阈值上限，将自动关闭水泵");
                                $("#pumpBtn").text("已关闭");
                                $("#pumpStatus").attr("src", "img/WaterPump-off.png");
                                //sensor.switch.close即 "{CD1=128,D1=?}"  --->  (bit7)
                                rtc.sendMessage(config["Sensor_A"], sensor.switch.close);
                            }
                            // 小于较小值，打开水泵
                            else if (t[1] < config["data-cur_min"]) {
                                message_show("低于湿度阈值下限，将自动打开水泵");
                                $("#pumpBtn").text("已开启");
                                $("#pumpStatus").attr("src", "img/WaterPump-on.png");
                                //sensor.switch.open即 "{OD1=128,D1=?}"  --->  (bit7)
                                rtc.sendMessage(config["Sensor_A"], sensor.switch.open);
                            }
                        }
                    }
                }
            }
        }
    }

    /* **************************************** idkey和Mac 确认按钮 ************************* */
    // 输入id key 确认按钮
    $("#idkeyInput").click(function () {
        config["id"] = $("#id").val();
        config["key"] = $("#key").val();
        config["server"] = $("#server").val();
        // 本地存储id、key和server
        storeStorage();
        if (!rtc_connect)
            getConnect();
        else
            rtc.disconnect();
    });
    //输入mac确认按钮
    $("#macInput").click(function () {
        if ($(this).text() == "确认") {
            $(this).text("取消").addClass("btn-danger");
            $("#Sensor_A").attr('disabled', true);
            config['Sensor_A'] = $('#Sensor_A').val();
            storeStorage();
            rtc.sendMessage(config['Sensor_A'], sensor.all);
        } else {
            $(this).text("确认").removeClass("btn-danger");
            $("#Sensor_A").removeAttr('disabled');
        }
    });

    /* ******************************************** 开关、切换控制 **************************** */
    // 水泵控制-打开、关闭
    $("#pumpBtn").click(function () {
        //idkey在线 && mac在线
        if (page.checkOnline() && page.checkMac("Sensor_A")) {
            var curState = $(this).text(), cmd;
            if (curState == "已关闭") {
                $("#pumpBtn").text("已开启");
                $("#pumpStatus").attr("src", "img/WaterPump-on.png");
                //发送命令开，详见config.js  --->  config.switch对象
                //sensor.switch.open即 "{OD1=128,D1=?}"  --->  (bit7)
                cmd = sensor.switch.open;
            } else {
                $("#pumpBtn").text("已关闭");
                $("#pumpStatus").attr("src", "img/WaterPump-off.png");
                //发送命令关，详见config.js  --->  config.switch对象
                //sensor.switch.close即 "{CD1=128,D1=?}"  --->  (bit7)
                cmd = sensor.switch.close;
            }
            rtc.sendMessage(config["Sensor_A"], cmd);
        }
    });
    // 获取本地存储信息
    get_localStorage();
    // 模式切换
    $("#mode-switch input").on("click", function () {
        config["curMode"] = $(this).val();
        console.log("切换到：" + config["curMode"]);
        var isManualMode = config["curMode"] == "manual-mode";
        console.log(isManualMode);
        if (isManualMode) {
            $("#mode-txt-2").removeClass("hidden").siblings("span").addClass("hidden");
            $("#mode-text").addClass("mode-right");
            message_show("手动模式已开启");
            //关闭所有传感器
            $('#nstSliderS').addClass('nst-disabled');
            $('#pumpBtn').attr("disabled", false);
            console.log("禁用所有传感器");
        }
        // 自动模式下禁用开关按钮
        else {
            $('#pumpBtn').attr("disabled", true);
            $('#nstSliderS').removeClass('nst-disabled');
            $("#mode-txt-1").removeClass("hidden").siblings("span").addClass("hidden");
            $("#mode-text").removeClass("mode-right");
            message_show("自动模式已开启");
        }
        storeStorage();
    })
    // 场景页面-控制器弹窗设置滑块
    $('#nstSliderS').nstSlider({
        "left_grip_selector": "#leftGripS",
        "right_grip_selector": "#rightGripS",
        "value_bar_selector": "#barS",
        "value_changed_callback": function (cause, leftValue, rightValue) {
            var $container = $(this).parent();
            $container.find('#leftLabelS').text(leftValue);
            $container.find('#rightLabelS').text(rightValue);
            $('#nstSliderS').nstSlider('highlight_range', leftValue, rightValue);
        },
        "user_mouseup_callback": function (vin, vmax) {
            console.log("阈值更新：" + vin, vmax);
            config["data-cur_min"] = vin;
            config["data-cur_max"] = vmax;
            console.log(config['data-cur_min']);
            console.log(config['data-cur_max']);
            storeStorage();
            rtc.sendMessage(config['Sensor_A'], sensor.all);
        },
        "highlight": {
            "grip_class": "gripHighlighted",
            "panel_selector": "#highlightPanel1"
        },
    });

    /* ******************************************** 历史数据 ******************************* */
    // 土壤温度历史数据
    $("#airTempHistoryDisplay").click(function () {
        // 初始化api，实例化历史数据
        var myHisData = new WSNHistory(config["id"], config["key"]);
        // 服务器接口查询
        myHisData.setServerAddr(config.server + ":8080");
        // 设置时间
        var time = $("#airTempSet").val();
        console.log(time);
        // 设置数据通道
        var channel = $("#Sensor_A").val() + "_A1";
        console.log(channel);
        myHisData[time](channel, function (dat) {
            if (dat.datapoints.length > 0) {
                var data = DataAnalysis(dat);
                showChart('#her_air_temp', 'spline', '', false, eval(data));
            } else {
                message_show("该时间段没有数据");
            }
        });
    });
    // 土壤湿度历史数据
    $("#airHumiHistoryDisplay").click(function () {
        //初始化api，实例化历史数据
        var myHisData = new WSNHistory(config["id"], config["key"]);
        // 服务器接口查询
        myHisData.setServerAddr(config.server + ":8080");
        // 设置时间
        var time = $("#airHumiSet").val();
        console.log(time);
        // 设置数据通道
        var channel = $("#Sensor_A").val() + "_A0";
        console.log(channel);
        myHisData[time](channel, function (dat) {
            if (dat.datapoints.length > 0) {
                var data = DataAnalysis(dat);
                showChart('#her_air_humi', 'spline', '', false, eval(data));
            } else {
                message_show("该时间段没有数据");
            }
        });
    });

    /* **************************************** 页面路由初始化 ************************* */
    // 定义路由
    var routes = {
        '/home/main': home,
        '/history/air': home,
        '/history/air1': home,
        '/set/IDKEY': home,
        '/set/MAC': home,
        '/set/about': home,
    };
    var router = Router(routes);
    router.configure({ on: checkDom });
    router.init();
    loadFirstPage();
    $(".sensor").on("change", function () {
        config["sensorAlarm"] = [];
        $("#sensors").find("input:checked").each(function () {
            var sensor = $(this).val();
            if ($.inArray(sensor, config["sensorAlarm"]) < 0) {
                config["sensorAlarm"].push(sensor);
            }
        });
        console.log(config["sensorAlarm"]);
        storeStorage();
    })
});

/* ************************************** 分享扫描功能 ******************************** */
// 定义二维码生成div
var qrcode = new QRCode(document.getElementById("qrDiv"), {
    width: 200,
    height: 200
});
// 分享按钮
$(".share").on("click", function () {
    var txt = "", title, input, obj;
    if (this.id == "idShare") {
        obj = {
            "id": $("#id").val(),
            "key": $("#key").val(),
            "server": $("#server").val(),
        }
        title = "IDKey";
        txt = JSON.stringify(obj);
    } else if (this.id == "macShare") {
        obj = {
            "Sensor_A": $("#Sensor_A").val(),
        }
        title = "MAC设置";
        txt = JSON.stringify(obj);
    }
    qrcode.makeCode(txt);
    $("#shareModalTitle").text(title)
})
// 扫描按钮
$(".scan").on("click", function () {
    if (window.droid) {
        if (this.id == "id_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "mac_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        }
    } else {
        message_show("扫描只在安卓系统下可用！");
    }
})
// 升级按钮
$("#setUp").click(function () {
    message_show("当前已是最新版本");
});
//  查看升级日志
$("#showUpdateTxt").on("click", function () {
    if ($(this).text() == "查看升级日志")
        $(this).text("收起升级日志");
    else
        $(this).text("查看升级日志");
});
//清除缓存
$("#clear").click(function () {
    localStorage.removeItem("course_SoilRegulation");
    alert("localStorage已清除!");
    window.location.reload();
});
//生成下载APP二维码
var downloadUrl = version.download;
new QRCode('qrDownload', {
    text: downloadUrl,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
});

/* ************************************** 通用功能函数 ****************************** */
//版本列表渲染
$(".currentVersion").text(version.currentVersion);
var versionData = version.versionList;
var versionBox = document.querySelector('.version-list');
versionBox.innerHTML = versionData.map((item) => {
    return `<dl>
                    <dt>${item.code}</dt>
                    <dd>${item.desc}</dd>
                </dl>`;
}).join('');
var checkDom = function () {
    // 获取当前url字符串中#符号后面字符串
    var pageId = window.location.hash.slice(2);
    var parentPage = pageId.split("/")[0];
    console.log("pageid=" + pageId + "------parentPage=" + parentPage);
    // 隐藏所有右侧content，并显示当前content
    $(".content").hide().filter("#" + parentPage).show();
    // 隐藏所有主内容区box-shell ，并显示当前box-shell
    $(".main").hide().filter("#" + pageId.replace(/\//g, '\\/')).show();
    // 隐藏所有主内容区 ul，并显示当前ul
    $(".aside-nav").hide().filter("#" + parentPage + "UL").show();
    // 每次切换标签页时，把当前二级页面的href保存到一级导航的href中
    $("#" + parentPage + "Li").find("a").attr("href", "#/" + pageId);
    // 导航li高亮
    activeTopLi(parentPage);
    activeTopLi(pageId.split("/")[1]);
}
function activeTopLi(page) {
    $("#" + page + "Li").addClass("active").siblings("li").removeClass("active");
}
var home = function () { }
var page = {
    checkOnline: function () {
        if (!rtc_connect) {
            message_show("暂未连接，请连接后重试！");
        }
        return rtc_connect;
    },
    checkMac: function (mac) {
        if (!config[mac]) {
            message_show("暂未获取到节点地址，请稍后重试！");
        }
        return config[mac];
    }
}
// 获取本地localStorage缓存数据
function get_localStorage() {
    if (localStorage.getItem("course_SoilRegulation")) {
        config = JSON.parse(localStorage.getItem("course_SoilRegulation"));
        //console.log("config="+config);
        for (var i in config) {
            if (config[i] != "") {
                // 读取当前模式
                if ($("#" + i)[0]) {
                    console.log("i=" + i + "----val=" + config[i] + "-------tagName=" + $("#" + i)[0].tagName);
                    if ($("#" + i)[0].tagName == "INPUT")
                        $("#" + i).val(config[i]);
                    else
                        $("#" + i).text(config[i]);
                }
            }
            if (config["data-cur_min"] !== "") {
                console.log("读取阈值缓存：" + config["data-cur_min"]);
                $("#nstSliderS").data("cur_min", config["data-cur_min"])
            }
            if (config["data-cur_max"] !== "") {
                console.log("读取阈值缓存：" + config["data-cur_max"]);
                $("#nstSliderS").data("cur_max", config["data-cur_max"])
            }
            if (config["data-rang_max"] !== "") {
                $("#nstSliderS").attr("data-range_max", config["data-rang_max"]);
            }
            if (config["curMode"] == "manual-mode") { clickhand(); }
            else if (config["curMode"] == "auto-mode") { clickauto(); }
        }
    }
    else {
        get_config();
    }
}
function loadFirstPage() {
    var href = window.location.href;
    var newHref = href.substring(href.length, href.length - 4);
    if (newHref == "html") {
        window.location.href = window.location.href + "#/home/main";
    }
}
function storeStorage() {
    localStorage.setItem("course_SoilRegulation", JSON.stringify(config));
}
function get_config() {
    $("#id").val(config.id);
    $("#key").val(config.key);
    $("#server").val(config.server);
    $("#Sensor_A").val(config["Sensor_A"]);
    if (config["data-cur_min"] !== "") {
        console.log("读取阈值缓存：" + config["data-cur_min"]);
        $("#nstSliderS").data("cur_min", config["data-cur_min"])
    }
    if (config["data-cur_max"] !== "") {
        console.log("读取阈值缓存：" + config["data-cur_max"]);
        $("#nstSliderS").data("cur_max", config["data-cur_max"])
    }
    if (config["data-rang_max"] !== "") {
        $("#nstSliderS").attr("data-range_max", config["data-rang_max"]);
    }
    if (config["curMode"] == "manual-mode") { clickhand(); }
    else if (config["curMode"] == "auto-mode") { clickauto(); }
}
function clickhand() {
    $("#mode-txt-2").removeClass("hidden").siblings("span").addClass("hidden");
    $("#mode-text").addClass("mode-right");
    message_show("手动模式已开启");
    //关闭所有传感器
    $('#nstSliderS').addClass('nst-disabled');
    $('#pumpBtn').attr("disabled", false);

    let arr = $("#mode-switch input");
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].checked = false;
            arr.eq(i).prop('checked', false);
        }
        arr[1].checked = true;
    }
}
function clickauto() {
    $('#pumpBtn').attr("disabled", true);
    $('#nstSliderS').removeClass('nst-disabled');
    $("#mode-txt-1").removeClass("hidden").siblings("span").addClass("hidden");
    $("#mode-text").removeClass("mode-right");
    message_show("自动模式已开启");

    let arr = $("#mode-switch input");
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].checked = false;
            arr.eq(i).prop('checked', false);
        }
        arr[0].checked = true;
    }

}
function getback() {
    $("#backModal").modal("show");
}
function confirm_back() {
    window.droid.confirmBack();
}
// 扫描处理函数
function scanQR(scanData) {
    //将原来的二维码编码格式转换为json。注：原来的编码格式如：ID:12345,KEY:12345,SERVER:12345
    var dataJson = {};
    if (scanData[0] != '{') {
        var data = scanData.split(',');
        for (var i = 0; i < data.length; i++) {
            var newdata = data[i].split(":");
            dataJson[newdata[0].toLocaleLowerCase()] = newdata[1];
        }
    } else {
        dataJson = JSON.parse(scanData);
    }
    console.log("dataJson=" + JSON.stringify(dataJson));
    if (cur_scan_id == "id_scan") {
        $("#ID").val(dataJson['id']);
        $("#KEY").val(dataJson['key']);
        if (dataJson['server'] && dataJson['server'] != '') {
            $("#server").val(dataJson['server']);
        }
    }
    else if (cur_scan_id == "mac_scan") {
        var arr = scanData.split(",");
        for (var i = 0; i < arr.length; i++) {
            $(".MAC").find("input:eq(" + i + ")").val(arr[i]);
        }
    }
}
// 消息弹出框
var message_timer = null;
function message_show(t) {
    if (message_timer) {
        clearTimeout(message_timer);
    }
    message_timer = setTimeout(function () {
        $("#toast").hide();
    }, 3000);
    $("#toast_txt").text(t);
    //console.log(t);
    $("#toast").show();
}