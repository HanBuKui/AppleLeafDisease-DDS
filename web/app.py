# 导入
import paddle.fluid as fluid
import numpy as np
from PIL import Image
from flask import Flask, request, render_template, url_for
from werkzeug.utils import secure_filename
import os
import cv2
import time
import matplotlib.pyplot as plt

# 预设
USE_GPU = False
MODEL_SAVE_PATH = '../DeepLearning/infer_model/'  # 保存预测模型路径
IMAGE_SIZE = 224  # 输入图片尺寸
DISEASES_LIST = ['Anthrax（炭疽病）', 'Brown Spot（褐斑病）',
                 'Mosaic（花叶病）', 'Ulcer,（溃疡病）']

INTRODUTION_LIST = [
    '叶枯病：刚刚开始侵染，会在叶片上面呈一个针尖大的小斑点，在斑点旁边会有一些黄'
    '色的晕圈，并且是从叶片边缘或者叶片凸起的地方开始侵染的，然后逐渐扩大，'
    '形成一个圆形或椭圆形的病斑',

    '褐斑病：真菌性病害，下部叶片开始发病，逐渐向上部蔓延，初期为圆形或椭圆形，'
    '紫褐色，后期为黑色，直径为5-10mm，界线分明，严重时病斑可连成片，使叶片枯黄脱落。',

    '花叶病：发病初期，叶片上出现褪 绿角状病斑，最后变为褐色；病叶出现浅绿与常绿'
    '相间的花叶；严重时叶片变形、黄化',

    '溃疡病：是一种严重威胁猕猴桃生产的毁灭性细菌性病害， 被列为全国植物检疫对象。'
    '此病来势凶猛， 流行年份致使全园濒于毁灭，造成重大经济损失。'
]
app = Flask(__name__)

# 设置图片保存文件夹
UPLOAD_FOLDER = './static/images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 设置允许上传的文件格式
ALLOW_EXTENSIONS = ['png', 'jpg', 'jpeg']


# 判断文件后缀是否在列表中
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[-1] in ALLOW_EXTENSIONS


# 上传图片
@app.route("/", methods=['POST', "GET"])
def uploads():
    if request.method == 'POST':
        # 获取post过来的文件名称，从name=file参数中获取
        file = request.files['file']
        if file and allowed_file(file.filename):
            user_input = request.form.get("name")
            # 获取图片文件名
            file_name = secure_filename(file.filename)
            basepath = os.path.dirname(__file__)  # 当前文件所在路径
            upload_path = os.path.join(basepath, 'static/images', file_name)
            # 清空保存区
            for old_file in os.listdir(
                os.path.join(
                    basepath,
                    'static/images')):
                os.remove(os.path.join(basepath, 'static/images', old_file))
            # 保存图片
            file.save(upload_path)
            # 使用Opencv转换一下图片格式和名称
            img = cv2.imread(upload_path)
            cv2.imwrite(
                os.path.join(
                    basepath,
                    'static/images',
                    'upload.jpg'),
                img)
            # 预测
            img_path = os.path.join(UPLOAD_FOLDER, file_name)
            info, lab = disease_recognition(img_path)
            introduction = INTRODUTION_LIST[lab]
            return render_template(
                'result.html',
                info=info,
                introduction=introduction,
                userinput=user_input,
                val1=time.time())
        else:
            return "您未上传或上传了错误格式的图片"
    return render_template('index.html')


def load_image(file):
    # 预处理图片
    '''
    :param file: 图片路径
    :return: 预处理后的图片
    '''
    img = Image.open(file)
    # 统一图像大小
    img = img.resize((IMAGE_SIZE, IMAGE_SIZE), Image.ANTIALIAS)
    # 转换成numpy值
    img = np.array(img).astype(np.float32)
    # 转换成CHW
    img = img.transpose((2, 0, 1))
    # 转换成BGR
    img = img[(2, 1, 0), :, :] / 255.0
    img = np.expand_dims(img, axis=0)
    return img


def disease_recognition(img_path):
    # 识别病害
    '''
    :param img_path: 图片路径
    :return: 识别结果
    '''
    # 创建执行器
    place = fluid.CUDAPlace(0) if USE_GPU else fluid.CPUPlace()
    exe = fluid.Executor(place)
    exe.run(fluid.default_startup_program())
    # 从模型中获取预测程序、输入数据名称列表、分类器
    [infer_program, feeded_var_names,
     target_var] = fluid.io.load_inference_model(dirname=MODEL_SAVE_PATH,
                                                 executor=exe)
    # 获取图片数据，可以更改img_path的值，实现对不同的图片进行预测。
    img = load_image(img_path)
    # 执行预测
    result = exe.run(program=infer_program,
                     feed={feeded_var_names[0]: img},
                     fetch_list=target_var)
    print(result[0][0])
    prob_bar(result[0][0][:4])
    # 显示图片并输出结果最大的label
    lab = np.argsort(result)[0][0][-1]
    info = 'Prediction：%s\n' % (DISEASES_LIST[lab])
    return info, lab


def prob_bar(prob_list):
    plt.figure()
    plt.bar(x=['Anthrax', 'Brown Spot', 'Mosaic', 'Ulcer'],
            height=prob_list,
            color='steelblue',
            alpha=0.8)
    plt.grid()  # 生成网格
    plt.title('Probability')
    plt.xticks(rotation=15)
    # 在柱状图上显示具体数值, ha参数控制水平对齐方式, va控制垂直对齐方式
    for x, y in enumerate(prob_list):
        plt.text(x, y, '%.2f' % y, ha='center', va='bottom')
    plt.savefig('./static/images/bar.jpg')


@app.route("/index")
def index():
    return render_template("index.html")

@app.route("/index2")
def index2():
    return render_template("index2.html")

@app.route("/surveillance")
def surveillance():
    return render_template("surveillance2.html")
    # return render_template("surveillance.html")

@app.route("/news")
def news():
    return render_template("news.html")

@app.route("/aboutUs")
def aboutUs():
    return render_template("aboutUs.html")

@app.route("/talk")
def talk():
    return render_template("information.html")

@app.route("/orchard")
def orchard():
    return render_template("orchard.html")

@app.route("/detect")
def detect():
    return render_template("detection.html")

@app.route("/login")
def login():
    return render_template("login.html")

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)