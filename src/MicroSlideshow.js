;(function(){
    this.MicroSlideshow = new Class({
        Implements: [Options, Events],
        element: null,
        current: 0,
        timer: null,
        options: {
            autoplay: true,
            duration: 1500,
            delay: 5000
        },
        initialize: function(element, options){
            var t = this,
                o = t.options;
            t.setOptions(options);
            t.element = document.id(element);
            t.slides = t.element.getChildren();
            t.slides.each(function(slide, i){
                if(i){
                    slide.dispose();
                }
                slide.set('tween', {
                    duration: o.duration,
                    link: 'chain'
                });
            });
            if(o.autoplay){
                t.fireEvent('beforeInitialPlay');
                t.play();
                t.fireEvent('afterInitialPlay');
            }
            t.fireEvent('afterInitialize');
        },
        play: function(){
            var t = this,
                o = t.options;
            t.pause();
            t.fireEvent('beforePlay');
            t.timer = (function(){
                t.next();
            }).periodical(o.delay);
            t.fireEvent('afterPlay');
            return t;
        },
        pause: function(){
            var t = this;
            t.fireEvent('beforePause');
            clearInterval(t.timer);  
            t.fireEvent('afterPause');
            return t;
        },
        next: function(){
            var t = this,
                next = t.current+1;
            if(next == t.slides.length){
                next = 0;
            }
            t.fireEvent('beforeNext');
            t.show(next);
            t.fireEvent('afterNext');
            return t;
        },
        prev: function(){
            var t = this,
                prev = t.current-1;
            if(prev < 0){
                prev = t.slides.length-1;
            }
            t.fireEvent('beforePrev');
            t.show(prev);
            t.fireEvent('afterPrev');
            return t;
        },
        show: function(slideNumber){
            var t = this;
            if(t.current == slideNumber || !t.slides[slideNumber]){
                return;
            }
            t.slides[t.current]
            .get('tween')
            .cancel();
            t.fireEvent('beforeShow');
            t.slides[slideNumber]
            .setStyle('opacity', 0)
            .inject(t.element)
            .tween('opacity', 1)
            .get('tween')
            .chain(function(){
                t.slides[t.current].dispose();
                t.current = slideNumber;
                t.fireEvent('afterShow');
            });
            return t;
        },
        slide: function(slideNumber){
            var t = this;
            if(!slideNumber || slideNumber == 'current'){
                slideNumber = t.current;
            }
            else if(slideNumber == 'next'){
                slideNumber = t.current+1;
                if(slideNumber == t.slides.length){
                    slideNumber = 0;
                }
            }
            else if(slideNumber == 'previous'){
                slideNumber = t.current-1;
                if(slideNumber < 0){
                    slideNumber = t.slides.length-1;
                }
            }
            else if(slideNumber == 'first'){
                slideNumber = 0;
            }
            else if(slideNumber == 'last'){
                slideNumber = t.slides.length-1;
            }
            if(!t.slides[slideNumber]){
                return false;
            }
            return t.slides[slideNumber];
        }
    });
})();
