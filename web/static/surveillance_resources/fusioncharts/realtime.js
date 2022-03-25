let interval = 120;              //更新间隔 120 秒
let timeServer = null;          //
let realtimeJSON = null;        //
let contextPath = null;         //
let stationCode = null;         //

$(document).ready(function() {
    //从JSP页面获取参数
    contextPath = $("#divContextPath").html();   //上下文路径
    stationCode = $("#divStationCode").html();   //示范站代码
    $.ajaxSetup({cache: false});
    //页面加载时执行一次，只更新表格数据，Flashchart由FC_Rendered回调函数更新
    let url = contextPath + "/weather/realtime/" + stationCode;
    $.getJSON(url, function(json) {
        //设置全局变量
        realtimeJSON = json;
        //更新数据表
        updateTable(json);
        //initialization Flash chart
        initCharts();
    });
    //设置定时器
    timeServer = window.setInterval("getRealtimeData()", 1000 * interval);
});
//由定时器调用更新表格数据和flashchart
function getRealtimeData() {
    let url = contextPath + "/weather/realtime/" + stationCode;
    $.getJSON(url, function(json) {
        //设置全局变量
        realtimeJSON = json;
        updateTable(json);
        updateChart("taAvg");
        updateChart("rhAvg");
        updateChart("wd");
        updateChart("rainTot");
    });
}

function initCharts() {

    const temperature2 = {
        "chart": {
            "lowerLimit": "-30",
            "upperLimit": "40",
            "numberSuffix": "°C",
            "bgColor": "#ffffff",
            "showBorder": "0",
            "thmFillColor": "#FF5904"
        },
        "value": "-10"
    };

    // Chart of Thermometer  空气温度
    new FusionCharts({
        id: 'taAvg',
        type: 'thermometer',
        renderAt: 'div_hw',
        width: '110',
        height: '228',
        //dataFormat: 'jsonurl',
        //dataSource: contextPath + "/resources/fusioncharts/data/temperature2.json"
        dataFormat: 'json',
        dataSource: temperature2
    }).render();

    const wd1 = {
        "chart": {
            "upperlimit": "360",
            "lowerlimit": "0",
            "gaugeouterradius": "0",
            "gaugeinnerradius": "0",
            "gaugestartangle": "90",
            "gaugeendangle": "-270",

            "pivotfillcolor": "CCCCCC",
            "pivotfilltype": "linear",
            "pivotfillangle": "0",
            "pivotfillmix": "{light-40},{dark-60}",
            "pivotradius": "10",
            "showpivotborder": "1",
            "pivotbordercolor": "999999",

            "showtickvalues":"0",
            "bgalpha": "0",
            "borderalpha": "0",
            "showgaugeborder":"1",
            "showborder":"0"
        },
        "colorrange": {
            "color": [
                {
                    "minvalue": "0",
                    "maxvalue": "360",
                    "code": "000000",
                    "alpha": "50"
                }
            ]
        },
        "dials": {
            "dial": [
                {
                    "value": "0",
                    "color":"E70E00",
                    "bordercolor": "cccccc",
                    "basewidth":"15",
                    "topwidth":"1",
                    "radius":"60"
                }
            ]
        },
        "annotations": {
            "groups": [
                {
                    "x": "0",
                    "y": "0",
                    "showbelow": "1",
                    "items": [
                        {
                            "type": "image",
                            "x": "0",
                            "y": "0",
                            "xscale":"90",
                            "yscale":"90",
                            "url": "/resources/fusioncharts/images/fx_bg.jpg"
                        }
                    ]
                }
            ]
        }
    };

    // 风向
    new FusionCharts({
        id: "wd",
        type: 'angulargauge',
        renderAt: 'div_fx',
        width: '205',
        height: '205',
        //dataFormat: 'jsonurl',
        //dataSource: contextPath + "/resources/fusioncharts/data/wd1.json"
        dataFormat: 'json',
        dataSource: wd1
    }).render();

    const sd1 = {"chart": {
            "manageresize": "1",
            "origw": "300",
            "origh": "300",
            "bgcolor": "FFFFFF",
            "upperlimit": "100",
            "lowerlimit": "0",
            "basefontcolor": "646F8F",
            "majortmnumber": "6",
            "majortmcolor": "000000",
            "majortmheight": "8",
            "minortmnumber": "5",
            "minortmcolor": "000000",
            "minortmheight": "4",
            "tooltipbordercolor": "333333",
            "tooltipbgcolor": "FFFFFF",
            "gaugeouterradius": "100",
            "gaugestartangle": "225",
            "gaugeendangle": "-45",
            "placevaluesinside": "1",
            "gaugeinnerradius": "80%",
            "annrenderdelay": "0",
            "gaugefillmix": "",
            "pivotradius": "10",
            "showpivotborder": "0",
            "pivotfillmix": "{CCCCCC},{333333}",
            "pivotfillratio": "50,50",
            "showshadow": "0",
            "gaugeoriginx": "150",
            "gaugeoriginy": "150",
            "showborder": "0",
            "adjustTM": "1"
        },
        "colorrange": {
            "color": [
                {
                    "minvalue": "0",
                    "maxvalue": "45",
                    "code": "C1E1C1",
                    "alpha": "50"
                },
                {
                    "minvalue": "45",
                    "maxvalue": "75",
                    "code": "00FF00",
                    "alpha": "50"
                },
                {
                    "minvalue": "75",
                    "maxvalue": "100",
                    "code": "FF0904",
                    "alpha": "50"
                }
            ]
        },
        "dials": {
            "dial": [
                {
                    "value": "65",
                    "bordercolor": "FFFFFF",
                    "bgcolor": "000000,CCCCCC,000000",
                    "borderalpha": "0",
                    "basewidth": "10"
                }
            ]
        },
        "annotations": {
            "groups": [
                {
                    "x": "150",
                    "y": "150",
                    "showbelow": "1",
                    "items": [
                        {
                            "type": "circle",
                            "x": "0",
                            "y": "0",
                            "radius": "122",
                            "fillcolor": "CCCCCC,111111",
                            "fillpattern": "linear",
                            "fillalpha": "100,100",
                            "fillratio": "50,50",
                            "fillangle": "-45"
                        },
                        {
                            "type": "circle",
                            "x": "0",
                            "y": "0",
                            "radius": "115",
                            "fillcolor": "FFFFFF, D4D4D4",
                            "fillratio": "20,80",
                            "bordercolor": "666666"
                        }
                    ]
                },
                {
                    "x": "150",
                    "y": "110",
                    "showbelow": "0",
                    "scaletext": "1",
                    "items": [
                        {
                            "type": "text",
                            "y": "120",
                            "label": "Humidity",
                            "fontcolor": "000000",
                            "fontsize": "14",
                            "bold": "0"
                        }
                    ]
                }
            ]
        }
    };
    // 湿度
    new FusionCharts({
        id:"rhAvg",
        "type": "angulargauge",
        renderAt: 'div_hs',
        width: '228',
        height: '228',
        //"dataFormat": "jsonurl",
        //"dataSource": contextPath + "/resources/fusioncharts/data/sd1.json"
        "dataFormat": "json",
        "dataSource": sd1
    }).render();
    // 雨量
    const rain = {
        "chart": {
            "showValue": "0",
            "showhovereffect": "1",
            "bgAlpha": "0",
            "borderAlpha": "0",
            "cylFillColor": "#008ee4"
        },
        "value": "200"
    };
    new FusionCharts({
        id:"rainTot",
        type: 'cylinder',
        renderAt: 'div_yl',
        width: '100',
        height: '228',
        //dataFormat: 'jsonurl',
        //dataSource: contextPath + "/resources/fusioncharts/data/rain.json"
        dataFormat: 'json',
        dataSource: rain
    }).render();
}

//FC_Rendered method is called whenever a FusionCharts chart on the page
//has finished initial rendering. To this function, the chart passes its
//own DOM Id.
//对FlashChart的任何操作，必须等FlashChart"渲染"完后才能进行
function FC_Rendered(DOMId) {
    updateChart(DOMId);
}

function updateTable(json) {
    //2010-12-12 增加变量没有值的处理，为了兼容眉县的数据采集
    //设置数据表格中的值
    $("#datetime_div").html(json['tmstamp'] + " 的瞬时数据 (间隔10分钟自动更新)");
    $("#real_taAvg").html(json['taAvg']);           //空气温度
    let taSoilAvg = json['taSoilAvg'] ? json['taSoilAvg'] : "N/A";
    $("#real_taSoilAvg").html(taSoilAvg);  //土壤温度
    $("#real_rhAvg").html(json['rhAvg']);           //空气湿度
    let vwcAvg = json['vwcAvg'] ? FormatNumber(json['vwcAvg'], 3) : "N/A";
    $("#real_vwcAvg").html(vwcAvg);                //土壤湿度
    $("#real_pvaporAvg").html(FormatNumber(json['pvaporAvg'], 3));  //水汽压
    let wd = json['wd'] ? json['wd'] : "N/A";
    $("#real_wd").html(wd);                                         //风向
    let wsAvg = json['wsAvg'] ? json['wsAvg'] : "N/A";
    $("#real_wsAvg").html(wsAvg);                                    //风速
    $("#real_rainTot").html(FormatNumber(json['rainTot'], 3));      //降雨量
    $("#real_slrwAvg").html(FormatNumber(json['slrwAvg'], 3));      //总辐射
    $("#real_ptemp").html(json['ptemp']);                          //数采面板温度
    $("#real_battVoltMin").html(json['battVoltMin']);             //电池电压最小值
}

function updateChart(DOMId) {
    let chartRef = getChartFromId(DOMId);
    let strData = "&value=" + realtimeJSON[DOMId];
    chartRef.feedData(strData);
}
