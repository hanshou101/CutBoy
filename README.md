# CUT-BOY

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

## 更多

[CUT-BOY 保护眼睛 & 提升质量 & 提高效率](http://newbieyoung.github.io/NewbieWebArticles/cut-boy.html)




















