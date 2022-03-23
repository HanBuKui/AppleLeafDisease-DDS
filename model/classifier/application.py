# -*- coding: utf-8 -*-
'''
内容：加载训练好的模型，对某一特定输入的猕猴桃叶部病理图片进行测试
时间：2020年4月7日
'''
import paddle.fluid as fluid
import numpy as np
from PIL import Image

# 预处理图片
def load_image(file):
    img = Image.open(file)
    # 统一图像大小
    img = img.resize((224, 224), Image.ANTIALIAS)
    # 转换成numpy值
    img = np.array(img).astype(np.float32)
    # 转换成CHW
    img = img.transpose((2, 0, 1))
    # 转换成BGR
    img = img[(2, 1, 0), :, :] / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def disease_prediction(img_path):
    # 创建执行器
    place = fluid.CPUPlace()
    exe = fluid.Executor(place)
    exe.run(fluid.default_startup_program())
    # 保存预测模型路径
    save_path = 'infer_model/'
    # 从模型中获取预测程序、输入数据名称列表、分类器
    [infer_program, feeded_var_names,
     target_var] = fluid.io.load_inference_model(dirname=save_path,
                                                 executor=exe)
    # 获取图片数据，可以更改img_path的值，实现对不同的图片进行预测。
    img = load_image(img_path)
    # 执行预测
    result = exe.run(program=infer_program,
                     feed={feeded_var_names[0]: img},
                     fetch_list=target_var)
    # 显示图片并输出结果最大的label
    lab = np.argsort(result)[0][0][-1]
    disease_names = ['Anthrax（炭疽病）','Brown_Spot（褐斑病）',
                     'Mosaic（花叶病）','Ulcer（叶片溃疡）']
    info = '图片：%s\n' \
           '预测结果：%s\n' \
           '概率：%.3f%%' \
           % ('/'.join(img_path.split('/')[-2:]), disease_names[lab], result[0][0][lab]*100)
    return info