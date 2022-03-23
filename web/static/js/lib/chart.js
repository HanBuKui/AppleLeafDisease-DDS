$(function () {
    thermometer('temp','℃','#ff7850', -20, 100, 0);
    thermometer('humi','%','#27A9E3', 0, 100, 0);
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
