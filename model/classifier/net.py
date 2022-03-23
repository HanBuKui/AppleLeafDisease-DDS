# -*- coding: utf-8 -*-
'''
内容：架构模型时需要用到的组件。
包括BN层、常规卷积层、xavier初始化方法
以及改进后的inception结构（KiwiFruit-inception）和深度可分离卷积结构
时间：2020年4月7日
'''
import paddle.fluid as fluid
from paddle.fluid.param_attr import ParamAttr
import paddle

# BN层
def conv_bn_layer (input, filter_size, num_filters, stride,
                   padding, channels=None, num_groups=1, act='relu',
                   use_cudnn=False):
    conv = fluid.layers.conv2d(input=input,
                               num_filters=num_filters,
                               filter_size=filter_size,
                               stride=stride,
                               padding=padding,
                               groups=num_groups,
                               act=None,
                               use_cudnn=use_cudnn,
                               bias_attr=False)

    return fluid.layers.batch_norm(input=conv, act=act)


# 常规卷积层
def conv_layer (
        input,
        num_filters,
        filter_size,
        stride=1,
        groups=1,
        act=None,
        name=None):
    channels = input.shape [1]
    stdv = (3.0 / (filter_size ** 2 * channels)) ** 0.5
    param_attr = ParamAttr(
        initializer=fluid.initializer.Uniform(-stdv, stdv),
        name=name + "_weights")
    conv = fluid.layers.conv2d(
        input=input,
        num_filters=num_filters,
        filter_size=filter_size,
        stride=stride,
        padding=(filter_size - 1) // 2,
        groups=groups,
        act=act,
        param_attr=param_attr,
        bias_attr=False,
        name=name)
    return conv


def xavier (self, channels, filter_size, name):
    stdv = (3.0 / (filter_size ** 2 * channels)) ** 0.5
    param_attr = ParamAttr(
        initializer=fluid.initializer.Uniform(-stdv, stdv),
        name=name + "_weights")

    return param_attr


# 改进后的inception结构（KiwiFruit-inception）
def inception (
        input,
        channels,
        filter1,
        filter3R,
        filter3,
        filter5R,
        filter5,
        filter7R,
        filter7,
        proj,
        name=None):
    conv1 = conv_layer(
        input=input,
        num_filters=filter1,
        filter_size=1,
        stride=1,
        act=None,
        name="inception_" + name + "_1x1")

    # 由一个1*1卷积层和一个3*3卷积层组成KiwiFruit-inception的支路
    conv3r = conv_layer(
        input=input,
        num_filters=filter3R,
        filter_size=1,
        stride=1,
        act=None,
        name="inception_" + name + "_3x3_reduce")
    conv3 = conv_layer(
        input=conv3r,
        num_filters=filter3,
        filter_size=3,
        stride=1,
        act=None,
        name="inception_" + name + "_3x3")

    # 由一个1*1卷积层和2个3*3卷积层组成KiwiFruit-inception的支路，由2个3*3卷积层代替5*5卷积层
    conv5r = conv_layer(
        input=input,
        num_filters=filter5R,
        filter_size=1,
        stride=1,
        act=None,
        name="inception_" + name + "_5x5_reduce")
    conv5 = conv_layer(
        input=conv5r,
        num_filters=filter5R,
        filter_size=3,
        stride=1,
        act=None,
        name="inception_" + name + "_5x5")
    conv5 = conv_layer(
        input=conv5,
        num_filters=filter5,
        filter_size=3,
        stride=1,
        act=None,
        name="inception_" + name + "_5x5_2")

    # 由一个1*1卷积层和3个3*3卷积层组成KiwiFruit-inception的支路，由3个3*3卷积层代替7*7卷积层
    conv7r = conv_layer(
        input=input,
        num_filters=filter7R,
        filter_size=1,
        stride=1,
        act=None,
        name="inception_" + name + "_7x7_reduce")
    conv7 = conv_layer(
        input=conv7r,
        num_filters=filter7R,
        filter_size=3,
        stride=1,
        act=None,
        name="inception_" + name + "_7x7")
    conv7 = conv_layer(
        input=conv7,
        num_filters=filter7R,
        filter_size=3,
        stride=1,
        act=None,
        name="inception_" + name + "_7x7_2")
    conv7 = conv_layer(
        input=conv7,
        num_filters=filter7,
        filter_size=3,
        stride=1,
        act=None,
        name="inception_" + name + "_7x7_3")

    pool = fluid.layers.pool2d(
        input=input,
        pool_size=3,
        pool_stride=1,
        pool_padding=1,
        pool_type='max')
    convprj = fluid.layers.conv2d(
        input=pool,
        filter_size=1,
        num_filters=proj,
        stride=1,
        padding=0,
        name="inception_" + name + "_3x3_proj",
        param_attr=ParamAttr(
            name="inception_" + name + "_3x3_proj_weights"),
        bias_attr=False)
    cat = fluid.layers.concat(input=[conv1, conv3, conv5, conv7, convprj],
                              axis=1)
    cat = fluid.layers.relu(cat)
    return cat


# 深度可分离卷积
def depthwise_separable (input, num_filters1, num_filters2, num_groups, stride,
                         scale):
    depthwise_conv = conv_bn_layer(input=input,
                                   filter_size=3,
                                   num_filters=int(num_filters1 * scale),
                                   stride=stride,
                                   padding=1,
                                   num_groups=int(num_groups * scale),
                                   use_cudnn=False)

    pointwise_conv = conv_bn_layer(input=depthwise_conv,
                                   filter_size=1,
                                   num_filters=int(num_filters2 * scale),
                                   stride=1,
                                   padding=0)
    return pointwise_conv

# KiwiFruit-ConvNet卷积神经网络的结构
def net (input, class_dim, scale=1.0):
    # 224x224
    input = conv_bn_layer(input=input,
                          filter_size=3,
                          channels=3,
                          num_filters=int(32 * scale),
                          stride=2,
                          padding=1)

    # 112x112
    input = depthwise_separable(input=input,
                                num_filters1=32,
                                num_filters2=64,
                                num_groups=32,
                                stride=1,
                                scale=scale)

    input = depthwise_separable(input=input,
                                num_filters1=64,
                                num_filters2=128,
                                num_groups=64,
                                stride=2,
                                scale=scale)

    # 56x56
    input = depthwise_separable(input=input,
                                num_filters1=128,
                                num_filters2=128,
                                num_groups=128,
                                stride=1,
                                scale=scale)

    input = depthwise_separable(input=input,
                                num_filters1=128,
                                num_filters2=256,
                                num_groups=128,
                                stride=2,
                                scale=scale)

    # 28x28
    input = depthwise_separable(input=input,
                                num_filters1=256,
                                num_filters2=256,
                                num_groups=256,
                                stride=1,
                                scale=scale)

    input = depthwise_separable(input=input,
                                num_filters1=256,
                                num_filters2=512,
                                num_groups=256,
                                stride=2,
                                scale=scale)

    # 14x14
    input = inception(input, 480, 192, 96, 208, 16, 24, 16, 24, 64, "input")
    input1 = inception(input, 512, 160, 112, 224, 24, 32, 24, 32, 64, "input1")
    input1 = paddle.fluid.layers.concat(input=[input, input1], axis=1)
    input2 = inception(input1, 512, 128, 128, 256, 24, 32, 24, 32, 64, "input2")
    input2 = paddle.fluid.layers.concat(input=[input, input1, input2], axis=1)
    input3 = inception(input2, 512, 128, 128, 256, 24, 32, 24, 32, 64, "input3")
    input3 = paddle.fluid.layers.concat(input=[input, input1, input2, input3],
                                        axis=1)

    input = depthwise_separable(input=input3,
                                num_filters1=512,
                                num_filters2=1024,
                                num_groups=512,
                                stride=2,
                                scale=scale)

    # 7x7
    input = depthwise_separable(input=input,
                                num_filters1=1024,
                                num_filters2=1024,
                                num_groups=1024,
                                stride=1,
                                scale=scale)

    feature = fluid.layers.pool2d(input=input,
                                  pool_size=0,
                                  pool_stride=1,
                                  pool_type='avg',
                                  global_pooling=True)

    net = fluid.layers.fc(input=feature,
                          size=class_dim,
                          act='softmax')
    return net