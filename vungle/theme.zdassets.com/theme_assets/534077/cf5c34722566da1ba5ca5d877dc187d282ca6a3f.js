!function o(n,l,h){function a(e,t){if(!l[e]){if(!n[e]){var i="function"==typeof require&&require;if(!t&&i)return i(e,!0);if(r)return r(e,!0);throw new Error("Cannot find module '"+e+"'")}var s=l[e]={exports:{}};n[e][0].call(s.exports,function(t){var i=n[e][1][t];return a(i||t)},s,s.exports,o,n,l,h)}return l[e].exports}for(var r="function"==typeof require&&require,t=0;t<h.length;t++)a(h[t]);return a}({1:[function(t,i,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function s(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(t,i,e){return i&&s(t.prototype,i),e&&s(t,e),t}}(),a=t("./constants");var n={articleBody:"[data-article]",headers:"h1, h2, .wysiwyg-font-size-x-large, .wysiwyg-font-size-large",title:"Table of contents",offsetTop:40,takeElHeight:null,animationDuration:500,showEmptyBlock:!1,isFixed:!0,changeUrl:!0,mobileBreakpoint:767,showMobile:!0},s=function(){function s(t,i,e){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,s),this.i=t,this.options=a.$.extend({},n,e),this.$document=(0,a.$)(document),this.$window=(0,a.$)(window),this.$element=i,this.$article=(0,a.$)(this.options.articleBody),this.$takeEl=this.options.takeElHeight?(0,a.$)(this.options.takeElHeight):null,this.links=[],this.isMobile=!1,this.destroyed=!1,this.$article.length&&this.init()}return o(s,[{key:"init",value:function(){this.$headers=this.$article.find(this.options.headers),(this.$headers.length||this.options.showEmptyBlock)&&(this.headers(),this.links.length&&(this.createTableOfContents(),this.handlers()))}},{key:"headers",value:function(){var n=this;this.$headers=this.$headers.filter(function(t,i){var e=(0,a.$)(i),s=n.titleToAnchor(e.text())+"-"+n.i+"-"+t,o=e.text().trim();return!!o.match(/[\S]+/)&&(e.attr("id",s),n.links.push({title:o,id:s,className:n.getClassName(e)}),!0)})}},{key:"createTableOfContents",value:function(){this.$article.css("position","relative"),this.$element.html('\n      <div class="lt-toc">\n        <div class="lt-toc--container">\n          '+(this.options.title?'<h4 class="lt-toc--title">'+this.options.title+"</h4>":"")+'\n          <div class="lt-toc--current">'+this.links[0].title+'</div>\n          <ul class="lt-toc--list">\n          '+this.links.map(function(t){return'\n            <li class="lt-toc--item '+(t.className?"lt-toc--item-"+t.className:"")+'">\n              <a href="#'+t.id+'" class="lt-toc--link"><span>'+t.title+"</span></a>\n            </li>\n          "}).join("")+"\n        </ul>\n        </div>\n      </div>\n    "),this.options.mobileBreakpoint&&this.options.showMobile&&(this.$mobileStart=(0,a.$)('<div class="lt-toc-mobile lt-toc-mobile_start"></div>'),this.$article.prepend(this.$mobileStart[0]),this.options.isFixed&&(this.$mobileEnd=(0,a.$)('<div class="lt-toc-mobile lt-toc-mobile_end"></div>'),this.$article.append(this.$mobileEnd[0]))),this.$toc=this.$element.find(".lt-toc"),this.$container=this.$element.find(".lt-toc--container"),this.$current=this.$element.find(".lt-toc--current"),this.$list=this.$element.find(".lt-toc--list"),this.$links=this.$element.find(".lt-toc--link")}},{key:"handlers",value:function(){window.location.hash&&this.scrollToActiveHeader(window.location.hash),this.handleWindowScroll(),this.handleWindowResize(),this.$links.on("click.lt.toc",this.handleClickToLink.bind(this)),this.$current.on("click.lt.toc",this.handleOpenMobileMenu.bind(this)),this.$window.on("resize.lt.toc",this.handleWindowResize.bind(this)),this.$window.on("scroll.lt.toc resize.lt.toc",this.handleWindowScroll.bind(this))}},{key:"titleToAnchor",value:function(t){return t.trim().toLowerCase().replace(/[.,/\\\-_=+()[\]*&%#@!?;:"'`~#№%$]/g," ").replace(/[\s]+/g,"-")}},{key:"getClassName",value:function(t){var i=this,e=t.attr("class"),s=e?e.split(/\s+/):[];s.push(t[0].localName);var o="";return s.forEach(function(t){if(-1!==i.options.headers.indexOf(t))return o=t,!1}),o}},{key:"scrollToActiveHeader",value:function(t){var i=this.$takeEl?this.$takeEl.innerHeight():0,e=this.$headers.filter(t);if(e.length){var s=e.offset().top-i-this.options.offsetTop-(this.isMobile?this.$mobileStart.innerHeight()+10:0);(0,a.$)("body,html").animate({scrollTop:s},this.options.animationDuration)}}},{key:"fixedBox",value:function(){if(!this.isMobile||this.options.showMobile){var t=this.isMobile&&this.$mobileEnd?this.$mobileEnd.innerWidth():this.$toc.innerWidth(),i=this.isMobile&&this.$mobileEnd?this.$mobileEnd.innerHeight():this.$container.innerHeight(),e=this.$takeEl?this.$takeEl.innerHeight():0,s=this.$document.scrollTop(),o=(this.isMobile?this.$mobileStart.offset().top:this.$toc.offset().top)-this.options.offsetTop-e,n=this.$article.offset().top+this.$article.innerHeight(),l=s+this.options.offsetTop+i+e;o<=s&&l<n?(this.$toc.removeClass(a.IS_BOTTOM).addClass(a.IS_FIXED),this.$container.css({position:"fixed",top:this.options.offsetTop+e,width:t})):s<o?(this.$toc.removeClass(a.IS_FIXED+" "+a.IS_BOTTOM),this.$container.removeAttr("style")):n<=l&&(this.$toc.removeClass(a.IS_FIXED).addClass(a.IS_BOTTOM),this.$container.css({position:"absolute",top:n-i-this.$toc.offset().top,width:t}))}}},{key:"changeActiveMenuItem",value:function(){if(!this.isMobile||this.options.showMobile){for(var t=this.$takeEl?this.$takeEl.innerHeight():0,i=!1,e=!1,s=null,o=0;o<this.$headers.length;o++)if(!e){var n=(0,a.$)(this.$headers[o]);n.offset().top<=this.$document.scrollTop()+parseInt(this.options.offsetTop||0)+1+t+(this.isMobile?this.$mobileStart.innerHeight()+10:0)?s=n:e=!0}if(s||(i=!0,s=this.$headers.eq(0)),s){var l=s.attr("id"),h=this.$links.filter('[href="#'+l+'"]');h.hasClass(a.IS_ACTIVE)||(this.$links.removeClass(a.IS_ACTIVE),h.addClass(a.IS_ACTIVE),this.$current.text(h.text()),!i&&this.options.changeUrl&&history.pushState(null,null,"#"+l))}}}},{key:"switchToDesktopVersion",value:function(){this.$toc.hasClass(a.IS_DESKTOP)||(this.isMobile=!1,this.options.showMobile&&(this.$mobileStart.removeClass(a.IS_ACTIVE),this.options.isFixed&&this.$mobileEnd.removeClass(a.IS_ACTIVE)),this.$toc.removeAttr("style").removeClass(a.IS_MOBILE).addClass(a.IS_DESKTOP),this.options.showMobile||(this.$toc.css({display:"block"}),this.handleWindowScroll()))}},{key:"switchToMobileVersion",value:function(){if(this.$toc.hasClass(a.IS_MOBILE)||(this.isMobile=!0,this.$toc.removeClass(a.IS_DESKTOP).addClass(a.IS_MOBILE),this.options.showMobile&&(this.$mobileStart.addClass(a.IS_ACTIVE),this.options.isFixed&&this.$mobileEnd.addClass(a.IS_ACTIVE))),this.options.showMobile){var t=this.$mobileStart.offset().top,i=this.$mobileStart.offset().left,e=this.$mobileStart.innerWidth();this.$toc.css({position:"absolute",top:t,left:i,width:e})}else this.$toc.css({display:"none"})}},{key:"handleClickToLink",value:function(t){t.preventDefault();var i=(0,a.$)(t.currentTarget).attr("href");this.$container.hasClass(a.IS_ACTIVE)&&(this.$container.removeClass(a.IS_ACTIVE),this.$list.slideUp(300)),this.scrollToActiveHeader(i)}},{key:"handleOpenMobileMenu",value:function(t){t.preventDefault(),this.$container.toggleClass(a.IS_ACTIVE),this.$list.slideToggle(300)}},{key:"handleWindowScroll",value:function(){this.options.isFixed&&this.fixedBox(),this.changeActiveMenuItem()}},{key:"handleWindowResize",value:function(){this.options.mobileBreakpoint&&(window.innerWidth>this.options.mobileBreakpoint?this.switchToDesktopVersion():this.switchToMobileVersion())}},{key:"create",value:function(t){this.destroyed||this.destroy();var i=this.$element.attr("id")||this.i;window.LS.extensions.toc[i]=new s(this.i,this.$element,t||this.$element.data("toc")||{})}},{key:"update",value:function(){this.handleWindowResize(),this.handleWindowScroll()}},{key:"destroy",value:function(){this.$links.off("click.lt.toc"),this.$current.off("click.lt.toc"),this.$window.off("scroll.lt.toc resize.lt.toc"),this.$element.html(""),this.destroyed=!0}}]),s}();e.default=s},{"./constants":2}],2:[function(t,i,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.$=window.jQuery||window.$,e.IS_FIXED="lt-toc_is-fixed",e.IS_BOTTOM="lt-toc_is-bottom",e.IS_DESKTOP="lt-toc_is-desktop",e.IS_MOBILE="lt-toc_is-mobile",e.IS_ACTIVE="is-active"},{}],3:[function(t,i,e){"use strict";var s,n=t("./constants"),o=t("./Toc"),l=(s=o)&&s.__esModule?s:{default:s};function h(t,i){Object.defineProperty(t,i,{value:{},enumerable:!0})}(0,n.$)(function(){(0,n.$)("[data-toc]").each(function(t,i){var e=(0,n.$)(i),s=e.data("toc")||{},o=e.attr("id")||t;window.LS||h(window,"LS"),window.LS.extensions||h(window.LS,"extensions"),window.LS.extensions.toc||h(window.LS.extensions,"toc"),window.LS.extensions.toc[o]=new l.default(t,e,s)})})},{"./Toc":1,"./constants":2}]},{},[3]);