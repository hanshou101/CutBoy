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
     * pageMat 设计稿图片数据
     * $element 待检测元素
     */
    function CutBoy(params){
        var self = this;

        self.pageImage = new Image();
        self.pageImage.src = params.pageImageSrc;
        self.pageImage.onload = function(){
            Module['onRuntimeInitialized'] = function() {//保证opecv wasm 编译完成
                self.pageMat = cv.imread(self.pageImage);
                self._events();
            };
        }
    }

    /**
     * 事件
     */
    CutBoy.prototype._events = function(){
        var self = this;

        document.addEventListener('mousemove',function(e){
            if(!self.$element){
                self._cover(e.target);
            }
        });

        document.addEventListener('click',function(e){
            if(self.$element){
                console.log('--- check element position ---');
                console.log(self.$element);
                console.log(self.$element.getBoundingClientRect());
                html2canvas(self.$element).then(function(canvas){
                    console.log(self._matching(canvas));
                });
            }
        });
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
            var $cover = document.querySelector('#cut-boy-cover');
            if(!$cover){
                $cover = document.createElement('div');
                $cover.id = 'cut-boy-cover';
                $cover.style.position = 'absolute';
                $cover.style.backgroundColor = '#000';
                $cover.style.opacity = '0.6';
                $cover.style.zIndex = '9999';
                document.body.appendChild($cover);

                $cover.addEventListener('mouseleave',function(){
                    self.$element = null;
                });
            }
            $cover.style.top = rect.top+'px';
            $cover.style.left = rect.left+'px';
            $cover.style.width = rect.width+'px';
            $cover.style.height = rect.height+'px';
        }
    }

    /**
     * 匹配
     */
    CutBoy.prototype._matching = function($temp){
        var templ = cv.imread($temp);

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
        cv.matchTemplate(this.pageMat, templ, dst, cv.TM_CCOEFF, mask);

        var result = cv.minMaxLoc(dst, mask);
        var position = result.maxLoc;

        dst.delete();
        mask.delete();

        return position;
    }

    return CutBoy;
}));