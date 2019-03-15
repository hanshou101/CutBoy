(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require());
    } else {
        // Browser globals
        window.CutBoy = factory();
    }
}(function () {
    /**
     * pageImage 设计稿图片
     * $element 待检测元素
     * $cover 覆盖元素
     * $result 匹配结果示意画布
     * debug 调试模式
     * $debug 调试元素
     * $dialog 弹出框
     */
    function CutBoy(params){
        var self = this;

        self.debug = params.debug?params.debug:true;//默认开启debug模式
        self.pageImage = new Image();
        self.pageImage.src = params.pageImageSrc;
        self.pageImage.onload = function(){
            Module['onRuntimeInitialized'] = function() {//保证opecv wasm 编译完成
                self._events();
            };
        }

        if(self.debug){
            self._debug();
        }
    }

    /**
     * 调试模式
     */
    CutBoy.prototype._debug = function(){
        var self = this;

        if(!self.$debug){
            //调试工具栏
            self.$debug = document.createElement('div');
            self.$debug.id = 'cut-boy-debug';
            document.body.appendChild(self.$debug);
            self.$debug.innerHTML = '<button func="result">匹配结果</button><button func="compare">差异比较</button>';

            //弹出框
            self.$dialog = document.createElement('div');
            self.$dialog.id = 'cut-boy-dialog';
            self.$dialog.style.display = 'none';
            document.body.appendChild(self.$dialog);
            self.$dialog.innerHTML = '<div></div>';

            self.$debug.addEventListener('click',function(e){
                var $target = e.target;

                var $current = document.querySelector('#cut-boy-debug .cbd-current');
                if($current){
                    $current.classList.remove('cbd-current');
                }

                $target.classList.add('cbd-current');

                var func = $target.getAttribute('func');
                switch(func){
                    case 'compare':
                        self._showCompareResult();
                        break;
                    case 'result':
                        self._showMatchingResult();
                        break;
                    default:
                        break;
                }
            });

            self.$dialog.addEventListener('click',function(){
                self.$dialog.style.display = 'none';
            });
        }
    }

    /**
     * 显示匹配结果
     */
    CutBoy.prototype._showMatchingResult = function(){
        var self = this;

        self.$dialog.innerHTML = '<div></div>';//初始化

        var $container = document.querySelector('#cut-boy-dialog>div');
        var img1 = new Image();
        if(self.$result){
            img1.src = self.$result.toDataURL();
        }
        $container.appendChild(img1);
        var img2 = new Image();
        $container.appendChild(img2);

        self.$dialog.style.display = 'block';
    }

    /**
     * 显示差异比较
     */
    CutBoy.prototype._showCompareResult = function(){
        var self = this;
        self.$dialog.innerHTML = '<div></div>';//初始化

        self.$dialog.style.display = 'none';
        self.$debug.style.display = 'none';

        html2canvas(document.body).then(function(canvas){
            canvas = self._resetCanvas(canvas);

            self.$dialog.style.display = 'block';
            self.$debug.style.display = 'block';

            var $container = document.querySelector('#cut-boy-dialog>div');
            var img1 = new Image();
            img1.src = canvas.toDataURL();
            $container.appendChild(img1);
            $container.appendChild(self.pageImage);

            self.$dialog.style.display = 'block';
        });
    }

    /**
     * 事件
     */
    CutBoy.prototype._events = function(){
        var self = this;

        document.addEventListener('mousedown',function(e){
            var $target = e.target;
            if(!self.$element&&(!self.$debug||!self.$debug.contains($target))&&(!self.$dialog||!self.$dialog.contains($target))){
                self._cover($target);
            }
        });

        document.addEventListener('mouseup',function(e){
            if(self.$element){
                console.log('--- check element position ---');
                var rect = self.$element.getBoundingClientRect();
                console.log(self.$element);
                console.log(rect);
                html2canvas(self.$element).then(function(canvas){
                    //除以设备像素比
                    canvas = self._resetCanvas(canvas);
                    var position = self._matching(canvas);
                    console.log(position);

                    var moveLeft = rect.left + window.scrollX - position.x;
                    var moveUp = rect.top + window.scrollY - position.y;

                    console.log('Move '+moveLeft+' pixel to the left');
                    console.log('Move up '+moveUp+' pixel');
                    self._hide();
                });
            }
        });
    }

    /**
     * 截屏的canvas画布去掉设备像素比的影响
     * @private
     */
    CutBoy.prototype._resetCanvas = function (canvas) {
        var temp = document.createElement('canvas');
        temp.width = canvas.width/window.devicePixelRatio;
        temp.height = canvas.height/window.devicePixelRatio;
        var ctx = temp.getContext('2d');
        ctx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,temp.width,temp.height);

        return temp;
    }

    /**
     * 覆盖显示某个元素
     */
    CutBoy.prototype._cover = function($target){
        var self = this;
        var rect = $target.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();
        if(rect.width<bodyRect.width||rect.height<bodyRect.height){//只能覆盖显示子元素
            self.$element = $target;
            self.$cover = document.querySelector('#cut-boy-cover');
            if(!self.$cover){
                self.$cover = document.createElement('div');
                self.$cover.id = 'cut-boy-cover';
                self.$cover.style.position = 'absolute';
                self.$cover.style.backgroundColor = '#000';
                self.$cover.style.opacity = '0.6';
                self.$cover.style.zIndex = '9999';
                document.body.appendChild(self.$cover);

                self.$cover.addEventListener('mouseleave',function(){
                    self._hide();
                });
            }
            self.$cover.style.display = 'block';
            self.$cover.style.top = (rect.top+window.scrollY)+'px';
            self.$cover.style.left = (rect.left+window.scrollX)+'px';
            self.$cover.style.width = rect.width+'px';
            self.$cover.style.height = rect.height+'px';
        }
    }

    /**
     * 隐藏
     */
    CutBoy.prototype._hide = function(){
        this.$element = null;
        this.$cover.style.display = 'none';
    }

    /**
     * 匹配
     */
    CutBoy.prototype._matching = function($temp){
        var self = this;
        var templ = cv.imread($temp);
        var src = cv.imread(self.pageImage);

        var dst = new cv.Mat();
        var mask = new cv.Mat();

        /**
         * opencv中模版匹配支持的比较方法有六种：
         *
         * cv.TM_SQDIFF 平方差匹配 匹配值越大，匹配越差；
         * cv.TM_SQDIFF_NORMED 标准平方差匹配；
         *
         * cv.TM_CCORR 相关性匹配 该方法使用源图像与模版图像的卷积结果进行匹配，匹配值越小结果越差；
         * cv.TM_CCORR_NORMED 归一化相关性匹配；
         *
         * cv.TM_CCOEFF 相关性系数匹配方法，该方法使用源图像与其均值的差、模版与其均值的差二者之间的相关性进行匹配，正值表示匹配的结果较好，负值表示匹配的结果较差；匹配值越大，匹配效果越好；
         * cv.TM_CCOEFF_NORMED 归一化相关性系数匹配方法。
         */
        cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask);

        var result = cv.minMaxLoc(dst, mask);
        var position = result.maxLoc;

        if(self.debug){
            //显示匹配结果
            self.$result = document.createElement('canvas');
            self.$result.width = self.pageImage.width;
            self.$result.height = self.pageImage.height;
            var color = new cv.Scalar(255, 0, 0, 255);
            var point = new cv.Point(position.x + templ.cols, position.y + templ.rows);
            cv.rectangle(src, position, point, color, 1, cv.LINE_8, 0);
            cv.imshow(self.$result, src);

            //self.downlaodCanvas(self.$result,'matching');
        }

        //释放内存
        src.delete();
        dst.delete();
        mask.delete();
        templ.delete();

        return position;
    }

    /**
     * canvas转换为blob
     */
    CutBoy.prototype.canvasToBlob = function(canvas,type){
        var dataurl = canvas.toDataURL(type);
        return this.dataURLtoBlob(dataurl);
    }

    /**
     * dataurl转换为blob
     */
    CutBoy.prototype.dataURLtoBlob = function(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1];
        var u8arr = this.dataURLtoUint8(dataurl);
        return new Blob([u8arr], {type:mime});
    }

    /**
     * dataurl转换为uint8
     */
    CutBoy.prototype.dataURLtoUint8 = function (dataurl) {
        var arr = dataurl.split(','),
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return u8arr;
    }

    /**
     * 下载canvas画布
     */
    CutBoy.prototype.downlaodCanvas = function($canvas,name){
        //下载
        var aLink = document.createElement('a');
        aLink.download = name+'.png';
        var blob = this.canvasToBlob($canvas,'image/png');
        aLink.href = URL.createObjectURL(blob);
        var evt = new MouseEvent('click');//生出鼠标事件
        aLink.dispatchEvent(evt);//触发鼠标事件
    }


    return CutBoy;
}));