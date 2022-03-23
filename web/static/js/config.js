//id key等参数配置文件：修改后请点击版本日志后的清除localStorage按钮

var config = {
    'id': '723342539200',
    'key': 'BwJWAwBRAgMICwQCRVkAAA0LHw',
    'server': 'api.zhiyun360.com',
    'Sensor_A': '00:12:4B:00:23:20:49:87',
    "curMode": "manual-mode",                                   //手动模式，另一个是自动模式(auto-mode)
    'data-rang_max': 100,                                       //阈值最大值
    "data-cur_min": 0,                                          //左滑块值
    "data-cur_max": 100,                                        //右滑块值
}
var sensor = {
    temp: {                                                     //土壤温度
        tag: "A1",
        query: "{A1=?}",
    },
    humi: {                                                     //土壤湿度
        tag: "A0",
        query: "{A0=?}",
    },
    switch: {                                                   //水泵开关
        tag: "D1",
        query: "{D1=?}",
        open: "{OD1=128,D1=?}",
        close: "{CD1=128,D1=?}"
    },
    all: "{A0=?,A1=?,D1=?}",                                    //查询所有传感器状态
}

