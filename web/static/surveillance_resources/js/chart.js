$(function () {
    //
    // dial2('BJ_illum','Lx',0);
    // dial2('SH_illum','Lx',0);
    // dial2('SZ_illum','Lx',0);
    // dial2('WH_illum','Lx',0);
    thermometer('div_hw','℃','#ff7850', -20, 80, 0);

    thermometer('div_hs','%RH','#27A9E3', 0, 100, 0);
    thermometer('div_yl','mm','#27A9E3', 0, 300, 0);
});



// 温度计绘制
function thermometer(id,unit,color, min, max, value) {
    var csatGauge = new FusionCharts({
        'type': 'thermometer',
        'renderAt': id,
        'width': '100%',
        'height': '100%',
        'dataFormat': 'json',
        'dataSource': {
            'chart': {
                'upperLimit': max,
                'lowerLimit': min,
                'numberSuffix': unit,
                'decimals': '1',
                'showhovereffect': '1',
                'gaugeFillColor': color,
                'gaugeBorderColor': '#008ee4',
                'showborder': '0',
                'tickmarkgap': '5',
                'theme': 'fint'
            },
            'value': value
        }
    });
    csatGauge.render();
};

//表盘
function dial2(id,unit,value) {
    var csatGauge = new FusionCharts({
        "type": "angulargauge",
        "renderAt": id,
        "width": "100%",
        "height": "240",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "manageresize": "1",
                "origw": "260",
                "origh": "260",
                "bgcolor": "FFFFFF",
                "upperlimit": "5000",
                "lowerlimit": "0",
                "basefontcolor": "000000",
                "majortmnumber": "11",
                "majortmcolor": "000000",
                "majortmheight": "8",
                "minortmnumber": "5",
                "minortmcolor": "000000",
                "minortmheight": "3",
                "tooltipbordercolor": "000000",
                "tooltipbgcolor": "333333",
                "tooltipcolor": "ffffff",
                "tooltipborderradius": "3",
                "gaugeouterradius": "100",
                "gaugestartangle": "225",
                "gaugeendangle": "-45",
                "placevaluesinside": "1",
                "gaugeinnerradius": "80%",
                "annrenderdelay": "0",
                "gaugefillmix": "",
                "pivotradius": "10",
                "showpivotborder": "0",
                "pivotfillmix": "{CCCCCC},{666666}",
                "pivotfillratio": "50,50",
                "showshadow": "0",
                "gaugeoriginx": "128",
                "gaugeoriginy": "120",
                "showborder": "0",
                "showValue": "1",
                "valueBelowPivot": "1"
            },
            "colorrange": {
                "color": [
                    {
                        "minvalue": "0",
                        "maxvalue": "3000",
                        "code": "#80e3c8",
                        "alpha": "80"
                    },
                    {
                        "minvalue": "3000",
                        "maxvalue": "4200",
                        "code": "#86c4df",
                        "alpha": "80"
                    },
                    {
                        "minvalue": "4200",
                        "maxvalue": "5000",
                        "code": "#ffb9a4",
                        "alpha": "80"
                    }
                ]
            },
            "dials": {
                "dial": [
                    {
                        "value": value,
                        "bordercolor": "FFFFFF",
                        "bgcolor": "666666,CCCCCC,666666",
                        "borderalpha": "0",
                        "basewidth": "10"
                    }
                ]
            },
            "annotations": {
                "groups": [
                    {
                        "x": "128",
                        "y": "120",
                        "showbelow": "10",
                        "items": [
                            {
                                "type": "circle",
                                "x": "0",
                                "y": "0",
                                "radius": "111",
                                "color": "dddddd"
                            },
                            {
                                "type": "circle",
                                "x": "0",
                                "y": "0",
                                "radius": "110",
                                "color": "ffffff"
                            }
                        ]
                    },
                    {
                        "x": "160",
                        "y": "160",
                        "showbelow": "0",
                        "scaletext": "1",
                        "items": [
                            {
                                "type": "text",
                                "y": "35",
                                "x": "-30",
                                "label": "单位"+unit,
                                "fontcolor": "000000",
                                "fontsize": "16",
                                "bold": "1"
                            }
                        ]
                    }
                ]
            },
            "value": "28"
        }
    });
    csatGauge.render();
}
