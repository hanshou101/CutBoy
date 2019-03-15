# CUT-BOY 保护眼睛 & 提升质量 & 提高效率

> &copy; Young 2019-03-15 17:32
> Welcome to My [GitHub](https://github.com/newbieYoung "GitHub")

马上而立之年的UI工程师遇到了一个很棘手的问题，年纪大了，老眼昏花，切图切的不太得劲；

<video height="500" style="width:100%;" controls="controls" preload="auto" webkit-playsinline="true" playsinline="true" src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/cut-boy-0.mp4"></video>

比如视频中的这种操作，高度近视的大龄切图仔真是有点力不从心了...

而一些`机器学习`、	`人工智能`、`神经网络`自动根据设计稿`生成代码`的方案，一直都只听说...从来没见实用...

针对这种情况`CUT-BOY`诞生了！！！

项目地址 [CutBoy](https://github.com/newbieYoung/CutBoy)。

## 安装

```
npm install cut-boy
```

安装完成之后目录结构如下：

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/cut-boy-1.jpg">

## 使用

- 在`HTML`页面按照对应的目录引入相关文件；

```
<link rel="stylesheet" href="./node_modules/cut-boy/css/debug.css">
<script type="text/javascript" src="./node_modules/cut-boy/lib/opencv.wasm.js"></script>
<script type="text/javascript" src="./node_modules/html2canvas/dist/html2canvas.min.js"></script>
<script type="text/javascript" src="./node_modules/cut-boy/index.js"></script>
```

- 初始化

```
<script>
    window.onload = function(){
        new CutBoy({
            pageImageSrc:'./page.png'//原始设计稿图片路径
        });
    }
</script>
```

初始化时只需要指定`原始设计稿图片路径`即可；

所谓`原始设计稿图片`是指你把`PSD`或者`Sketch`转换成的图片：

<video height="500" style="width:100%;" controls="controls" preload="auto" webkit-playsinline="true" playsinline="true" src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/cut-boy-2.mp4"></video>

> 把设计稿转换成图片时最好不要进行`有损压缩`。

有了`CUT-BOY`的帮助之后就在也不需要手动量位置了！

只需要先把页面宽度调整成和设计稿宽度一样；

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/cut-boy-3.jpg">

然后点击某个元素即可获得其位置偏移量了，根据`console`中输入的位置偏移量设置`CSS`属性即可；

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/cut-boy-4.jpg">

`CUT-BOY`会默认开启`调试模式`，在调试模式中可以实时查看页面还原效果；

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/cut-boy-6.jpg">

示例图片中可以清楚的看到有些元素页面中的位置和设计稿中的位置出现了偏差。

另外还可以查看点击元素的匹配结果，如果你对`console`中的位置偏移量有怀疑，通过匹配结果可以知道是不是程序匹配异常了；

<img src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/cut-boy-7.jpg">

示例图片中可以看到点击的元素在设计稿中正确匹配了，那么`console`中输出的位置偏移也应该是正确的。

完整操作流程如下：

<video height="500" style="width:100%;" controls="controls" preload="auto" webkit-playsinline="true" playsinline="true" src="https://raw.githubusercontent.com/newbieYoung/NewbieWebArticles/master/images/cut-boy-5.mp4"></video>

## 总结

`CUT-BOY`刚刚开发完成，欢迎大家使用（踩坑）！

因为用到了`Webassembly`，所以最好使用`高版本Chrome`浏览器！

`CUT-BOY`的目标只有一个`在人工智能让俺失业之前，保护好自己眼睛的同时，切好图！好切图！`




















