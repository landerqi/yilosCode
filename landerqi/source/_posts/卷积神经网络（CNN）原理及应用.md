title: 卷积神经网络（CNN）原理及应用
date: 2019-07-04 13:16:06
tags: AI
---

## 一、CNN原理

卷积神经网络（CNN）主要是用于**图像识别领域**，它指的是一类网络，而不是某一种，其包含很多不同种结构的网络。不同的网络结构通常表现会不一样。从CNN的一些典型结构中，可以看到这些网络创造者非常有创造力，很多结构都非常巧妙，有机会再介绍现今主流的一些典型结构。 现在我们先来简单介绍一下卷积神经网络的原理。

**Very Deep Convolutional Networks for Large-Scale Image Recognition(2014), arXiv: 1409.1556:**

<img src="https://rhinosystem.bs2dl.yy.com/fes1562146667035866" width="600" alt="VGG">

<!-- more -->

所有CNN最终都是把一张图片转化为**特征向量**，特征向量就相当于这张图片的DNA。就像**上图VGG网络**一样，通过多层的卷积，池化，全连接，降低图片维度，最后转化成了一个一维向量。这个向量就包含了图片的特征，当然这个特征不是肉眼上的图片特征，而是针对于神经网络的特征。

**之所以用VGG举例，因为他的网络结构非常简洁，清晰，相当好理解，简单介绍一下：**
1. 他的输入是一张224x224 的三通道图片，经过两层卷积之后，图片维度不变，通道数增加到了64。
1. 之后那个红色的层是最大池化（max pooling）把图片维度变成了112x112。后续就是不断重复这个过程。
2. 当变成1维向量之后，经过全连接（fully connected）加ReLU激活，softmax处理之后，变成了一个包含1000个数字的特征向量。

**以上就是CNN所做的事情。**

## 二、 CNN如何训练


### 1. 卷积神经网络的前向传播过程
在前向传播过程中，输入的图形数据经过多层卷积层的卷积和池化处理，提出特征向量，将特征向量传入全连接层中，得出分类识别的结果。当输出的结果与我们的期望值相符时，输出结果。

#### 1.1 前向传播中的卷积操作
- 用一个小的权重矩阵去覆盖输入数据，对应位置加权相乘，其和作为结果的一个像素点；
- 这个权重在输入数据上滑动，形成一张新的矩阵：<br>
<img src="https://rhinosystem.bs2dl.yy.com/fes1562213771124475" width="200" alt="卷积">
- 这个权重矩阵称为卷积核（convolution kernel）；
- 其覆盖位置称为感受野（receptive field）；
- 参数共享；
- 滑动的像素数量叫做步长（stride）:<br>
<img src="https://rhinosystem.bs2dl.yy.com/fes1562214001010487" width="150" alt="卷积">
- 以卷积核的边还是中心点作为开始/结束的依据，决定了卷积的补齐（padding）方式。上面的图片是valid方式（这种方式新的矩阵维度可能会降低），而same方式则会在图像边缘用0补齐（这种方式图像维度不会降低）：<br>
<img src="https://rhinosystem.bs2dl.yy.com/fes1562214361852171" width="217" alt="卷积">
- 如果输入通道不只一个，那么卷积核是三阶的。所有通道的结果累加：<br>
<img src="https://rhinosystem.bs2dl.yy.com/fes1562214470197519" width="232" alt="卷积">

如图：<br>
<img src="https://rhinosystem.bs2dl.yy.com/fes156221464750468" width="644" alt="卷积">

#### 1.2 前向传播中的池化操作
池化又称为降采样（down_sampling），类型：
1. 最大池化（max pooling）：在感受野内取最大值输出；
2. 平均池化（average pooling）：在感受野内取平均值进行输出；
3. 其他如L2池化等。

理解：
- 一个选择框，将输入数据某个范围（矩阵）的所有数值进行相应计算，得到一个新的值，作为结果的一个像素点；
- 池化也有步长和补齐的概念，但是很少使用，通常选择框以不重叠的方式，在padding=0的输入数据上滑动，生成一张新的特征图：<br>
<img src="https://rhinosystem.bs2dl.yy.com/fes1562215203483923" width="290" alt="卷积">
<img src="https://rhinosystem.bs2dl.yy.com/fes1562215198177517" width="574" alt="卷积">

#### 1.3 前向传播中的全连接
特征图进过卷积层和下采样层的特征提取之后，将提取出来的特征传到全连接层中，通过全连接层，进行分类，获得分类模型，得到最后的结果。

### 2. 卷积神经网络的反向传播过程
当卷积神经网络输出的结果与我们的期望值不相符时，则进行反向传播过程。求出结果与期望值的误差，再将误差一层一层的返回，计算出每一层的误差，然后进行权值更新。

### 3. 卷积神经网络的权值更新
卷积层的误差更新过程为：将误差矩阵当做卷积核，卷积输入的特征图，并得到了权值的偏差矩阵，然后与原先的卷积核的权值相加，并得到了更新后的卷积核。

**卷积神经网络的训练过程流程图：**

<img src="https://rhinosystem.bs2dl.yy.com/fes1562206854699605" width="500" alt="卷积神经网络的训练过程流程图">

**就像这张流程图一样，不断循环这个过程。最后得到一个稳定的权值和阈值。**

目前主流框架是**pytorch(facebook)和tensorflow(google)**。<br>
**举个例子(一个手写数字识别网络，其代码量也就100多行)：**
```python
import sys

import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data
from tinyenv.flags import flags

FLAGS = None


def train():
    mnist = input_data.read_data_sets(
        FLAGS.data_dir, one_hot=True, fake_data=FLAGS.fake_data,
    )
    sess = tf.InteractiveSession()

    with tf.name_scope('input'):
        x = tf.placeholder(tf.float32, [None, 784], name='x-input')
        y_ = tf.placeholder(tf.float32, [None, 10], name='y-input')

    with tf.name_scope('input_reshape'):
        image_shaped_input = tf.reshape(x, [-1, 28, 28, 1])
        tf.summary.image('input', image_shaped_input, 10)

    def weight_variable(shape):
        """Create a weight variable with appropriate initialization."""
        initial = tf.truncated_normal(shape, stddev=0.1)
        return tf.Variable(initial)

    def bias_variable(shape):
        """Create a bias variable with appropriate initialization."""
        initial = tf.constant(0.1, shape=shape)
        return tf.Variable(initial)

    def variable_summaries(var):
        with tf.name_scope('summaries'):
            mean = tf.reduce_mean(var)
            tf.summary.scalar('mean', mean)
            with tf.name_scope('stddev'):
                stddev = tf.sqrt(tf.reduce_mean(tf.square(var - mean)))
            tf.summary.scalar('stddev', stddev)
            tf.summary.scalar('max', tf.reduce_max(var))
            tf.summary.scalar('min', tf.reduce_min(var))
            tf.summary.histogram('histogram', var)

    def nn_layer(input_tensor, input_dim, output_dim, layer_name,
                 act=tf.nn.relu):
        with tf.name_scope(layer_name):
            with tf.name_scope('weights'):
                weights = weight_variable([input_dim, output_dim])
                variable_summaries(weights)
            with tf.name_scope('biases'):
                biases = bias_variable([output_dim])
                variable_summaries(biases)
            with tf.name_scope('Wx_plus_b'):
                preactivate = tf.matmul(input_tensor, weights) + biases
                tf.summary.histogram('pre_activations', preactivate)
            activations = act(preactivate, name='activation')
            tf.summary.histogram('activations', activations)
            return activations

    hidden1 = nn_layer(x, 784, 500, 'layer1')

    with tf.name_scope('dropout'):
        keep_prob = tf.placeholder(tf.float32)
        tf.summary.scalar('dropout_keep_probability', keep_prob)
        dropped = tf.nn.dropout(hidden1, keep_prob)

    y = nn_layer(dropped, 500, 10, 'layer2', act=tf.identity)

    with tf.name_scope('cross_entropy'):
        diff = tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y)
        with tf.name_scope('total'):
            cross_entropy = tf.reduce_mean(diff)
    tf.summary.scalar('cross_entropy', cross_entropy)

    with tf.name_scope('train'):
        train_step = tf.train.AdamOptimizer(FLAGS.learning_rate).minimize(
            cross_entropy)

    with tf.name_scope('accuracy'):
        with tf.name_scope('correct_prediction'):
            correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
        with tf.name_scope('accuracy'):
            accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
    tf.summary.scalar('accuracy', accuracy)

    merged = tf.summary.merge_all()
    train_writer = tf.summary.FileWriter(FLAGS.log_dir + '/train', sess.graph)
    test_writer = tf.summary.FileWriter(FLAGS.log_dir + '/test')
    tf.global_variables_initializer().run()

    def feed_dict(train):
        if train or FLAGS.fake_data:
            xs, ys = mnist.train.next_batch(100, fake_data=FLAGS.fake_data)
            k = FLAGS.dropout
        else:
            xs, ys = mnist.test.images, mnist.test.labels
            k = 1.0
        return {x: xs, y_: ys, keep_prob: k}

    for i in range(FLAGS.iterations):
        if i % 10 == 0:  # Record summaries and test-set accuracy
            summary, acc = sess.run(
                [merged, accuracy], feed_dict=feed_dict(False))
            test_writer.add_summary(summary, i)
            print('Accuracy at step %s: %s' % (i, acc))
        else:
            if i % 100 == 99:
                run_options = tf.RunOptions(
                    trace_level=tf.RunOptions.FULL_TRACE)
                run_metadata = tf.RunMetadata()
                summary, _ = sess.run([merged, train_step],
                                      feed_dict=feed_dict(True),
                                      options=run_options,
                                      run_metadata=run_metadata)
                train_writer.add_run_metadata(run_metadata, 'step%03d' % i)
                train_writer.add_summary(summary, i)
            else:
                summary, _ = sess.run(
                    [merged, train_step], feed_dict=feed_dict(True))
                train_writer.add_summary(summary, i)
    train_writer.close()
    test_writer.close()


def main(_):
    if tf.gfile.Exists(FLAGS.log_dir):
        tf.gfile.DeleteRecursively(FLAGS.log_dir)
    tf.gfile.MakeDirs(FLAGS.log_dir)
    train()


if __name__ == '__main__':
    FLAGS = flags()
    tf.app.run(main=main, argv=[sys.argv[0]])

```

训练之后，其识别准确度已达到96.7%:<br>
<img src="https://rhinosystem.bs2dl.yy.com/fes1562216103780594" width="700" alt="运行结果">

## 三、 应用

### 1. 图片分类
假设每张图片最后获得了6维特征向量v: [-0.24754368, -0.19974484, 0.45622883, 0.01130153, 0.08802839, -0.0419769]。
**我们要把图片分为3类， 那么分类矩阵就应该是6 x 3维的矩阵。**
**因为根据矩阵乘法：m,n维的矩阵乘以n,l维的矩阵，会得到一个m,l维的矩阵。**
**所以1 x 6维的矩阵乘以6 x 3维的矩阵最后会得到一个1 x 3的向量。**
如上述6维向量乘以分类矩阵之后得到：[-0.7777777, -0.9999999, 1.02222222]，那么很明显这张图片会被分到第三类。

### 2. 相似图搜索
广泛应用的人脸识别其实就是相似图搜索，比对两张照片是不是同一个人，当两张照片是同一个人时，他的**欧氏距离**会非常接近，反之。

<img src="https://rhinosystem.bs2dl.yy.com/fes1562210643334534" width="616" alt="相似图搜索">

余弦距离：<br>
<img src="https://rhinosystem.bs2dl.yy.com/fes1562209420132736" width="346" alt="余弦距离">

### 3.对抗样本
对抗样本和神经网络训练过程不同的是，他是固定权重，更新输入数据。比如输入一张猫的图片，人为的修改一点图片数据，肉眼上看还是一只猫，但是你告诉神经网络这是狗。最后大量数据训练这后，神经网络会把这些图片错误的分类到狗这一类。

## 四、 新技术
### 1. 批归一化(Batch Normalization)
相当于把数据缩放到了合适的位置，所以应该放在卷积之后，激活函数之前。能加快网络收敛速度。一堆公式，脑壳痛：

<img src="https://rhinosystem.bs2dl.yy.com/fes1562210403365769" width="580" alt="批归一化">


### 2. Dropout(还没有合适的中文翻译)
应用广泛。在标准 Dropout 的每轮迭代中，网络中的每个神经元以 p 的概率被丢弃。Dropout能够有效的改善过拟合的情况，提升泛化能力。前几天google申请的Dropout专利生效了。
Dropout实现要点：
- 一般是实施在分类器之前（论文是放在最后一层分类器之后）；
- Dropout以概率p置零神经元，这种情况下，保留的神经元的输出要除以`1-p` (论文是在inference时把所有权重乘以p)；
- 通常p初始值0.5。