$(document).ready(function() {
  if (window.zE && !document.getElementById('vungle-custom-ZendeskWidget')) {

    // initialize: change widget position & hide origin button
    window.zE('webWidget', 'updateSettings', {
      webWidget: {
        offset: {
          vertical: '30px'
        }
      }
    });
    window.zE('webWidget', 'hide');

    // create customized button
    var widgetNode = document.createElement('div');
    widgetNode.innerHTML = '<div id="vungle-custom-ZendeskWidget" class=""><i class="far fa-question-circle"></i></div>';
    document.getElementsByTagName('body')[0].appendChild(widgetNode);

    // if button clicked
    widgetNode.onclick = function() {
      this.childNodes[0].classList.add('hide');
      window.zE('webWidget', 'show');
      window.zE('webWidget', 'open');
    }

    // if window closed
    window.zE('webWidget:on', 'close', function() {
      widgetNode.childNodes[0].classList.remove('hide');
      window.zE('webWidget', 'hide');
    });

  }
});

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

hljs.initHighlightingOnLoad();

var HC_SETTINGS = {
  css: {
    activeClass: "is-active",
    hiddenClass: "is-hidden",
    overflowClass: "is-overflow",
    topbarHiddenClass: "topbar--hidden",
    topbarFixedClass: "topbar--fixed"
  }
};

//Helpers utils
var Utils = {
  getPageId: function(url) {
    var links = url.split("/");
    var result = links[links.length - 1];
    return parseInt(result, 10) || null;
  },
  getSectionId: function() {
    if ($("[data-section-page]").length) {
      return this.getPageId(window.location.href);
    } else {
      var sectionLink = $(".breadcrumbs li:nth-child(3) a");
      return sectionLink.length
        ? this.getPageId(sectionLink.attr("href"))
        : null;
    }
  },
  getArticleId: function() {
    if ($("[data-article-page]").length) {
      return this.getPageId(window.location.href);
    }
  }
};

$(function() {
  var $html = $("html");
  var $window = $(window);
  var $wrapper = $('[role="main"]');
  var $sidebar = $("[data-sidebar]");
  var $sidebarWrapper = $sidebar.find(".sidebar__wrapper");
  var $sidebarContent = $("[data-sidebar-content]");
  var $scrollToTop = $("[data-scroll-to-top]");
  var $mobileSandwich = $("[data-toggle-menu]");
  var $searchOpen = $("[data-search-open]");
  var $searchForm = $("[data-search]");
  var $articlesNav = $("#article-nav");
  var wScrollTop;
  var $topbar = $("[data-topbar]");
  var topbarHeight = parseInt($topbar.height());

  var bindEffects = function() {
    var scrolled = $window.scrollTop();
    if (scrolled > topbarHeight && scrolled < topbarHeight * 2) {
      $topbar.addClass(HC_SETTINGS.css.topbarHiddenClass);
    } else {
      $topbar
        .removeClass(HC_SETTINGS.css.topbarHiddenClass)
        .removeClass(HC_SETTINGS.css.topbarFixedClass);
    }

    if (scrolled > topbarHeight * 2) {
      $topbar
        .removeClass(HC_SETTINGS.css.topbarHiddenClass)
        .addClass(HC_SETTINGS.css.topbarFixedClass);
    }
  };

  $window.on("scroll.theme", bindEffects);

  $mobileSandwich.click(function(e) {
    e.preventDefault();
    $sidebar.toggleClass(HC_SETTINGS.css.activeClass);
    $html.toggleClass(HC_SETTINGS.css.overflowClass);
  });

  $(document).on('click', '.sidebar__overlay', function(){
    $('.sidebar').toggleClass(HC_SETTINGS.css.activeClass);
    $html.toggleClass(HC_SETTINGS.css.overflowClass);
  });

  $window.on("resize", function() {
    if ($window.width() > 1024) {
      $mobileSandwich
        .add($sidebar)
        .add($searchForm);

      $html.removeClass(HC_SETTINGS.css.overflowClass);
    }
  });

  $searchForm.append(
    '<a href="" class="search-close" data-search-close role="button"><span></span></a>'
  );

  $("[data-search-close]").click(function(e) {
    e.preventDefault();
    $searchForm.removeClass(HC_SETTINGS.css.activeClass);
  });

  $searchOpen.click(function(e) {
    e.preventDefault();
    $searchForm.addClass(HC_SETTINGS.css.activeClass);
  });

  // Social share popups
  $(".share a").click(function(e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // Toggle the share dropdown in communities
  $(".share-label").on("click", function(e) {
    e.stopPropagation();
    var isSelected = this.getAttribute("aria-selected") == "true";
    this.setAttribute("aria-selected", !isSelected);
    $(".share-label")
      .not(this)
      .attr("aria-selected", "false");
  });

  $(document).on("click", function() {
    $(".share-label").attr("aria-selected", "false");
  });

  $(".dropdown-toggle").on("click", function(e) {
    e.preventDefault();
  });

  // Submit search on select change
  $("#request-status-select, #request-organization-select").on(
    "change",
    function() {
      search();
    }
  );

  // Submit search on input enter
  $("#quick-search").on("keypress", function(e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  function popupsInit() {
    $(".image-with-lightbox").magnificPopup({
      type: "image",
      closeOnContentClick: true,
      closeBtnInside: false,
      fixedContentPos: true,
      mainClass: "mfp-with-zoom", // class to remove default margin from left and right side
      image: {
        verticalFit: true
      },
      zoom: {
        enabled: true,
        duration: 300 // don't foget to change the duration also in CSS
      }
    });

    $(".image-with-video-icon").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    });
  }
  popupsInit();

  $(document).on("click", ".accordion__item-title", function() {
    var $title = $(this);
    $title.toggleClass("accordion__item-title--active");
    $title
      .parents(".accordion__item")
      .find(".accordion__item-content")
      .slideToggle();
  });

  $(document).on("click", ".tabs-link", ".accordion__item-title", function(e) {
    e.preventDefault();

    var $link = $(this);
    var tabIndex = $link.index();
    var $tab = $link
      .parents(".tabs")
      .find(".tab")
      .eq(tabIndex);
    $link
      .addClass(HC_SETTINGS.css.activeClass)
      .siblings()
      .removeClass(HC_SETTINGS.css.activeClass);
    $tab
      .removeClass(HC_SETTINGS.css.hiddenClass)
      .siblings(".tab")
      .addClass(HC_SETTINGS.css.hiddenClass);
  });

  //Tabs auto width
  function tabsWidth() {
    $(".tabs-menu").each(function() {
      var $this = $(this),
        item = $this.find(".tabs-link"),
        quantity = item.length;
      item.css("width", 100 / quantity + "%");
    });
  }
  tabsWidth();

  // Fix animated icons
  $(".fa-spin").empty();

  // Show/hide scroll to top button
  $window.on("scroll", function() {
    wScrollTop = $window.scrollTop();

    wScrollTop > 400
      ? $scrollToTop.addClass(HC_SETTINGS.css.activeClass)
      : $scrollToTop.removeClass(HC_SETTINGS.css.activeClass);
  });

  $scrollToTop.click(function() {
    $("html, body").animate(
      {
        scrollTop: 0
      },
      1000
    );
    return false;
  });

  //Add text into vote buttons
  $(".article-vote-controls__item").each(function() {
    $(this).text($(this).attr("title"));
  });

  //Prev Nav plugin options for articles
  var prevNavOptions = {
    el: "#article-nav", // # => id, . => class - where we paste buttons
    /* optional params */
    showTitles: true, // false by default
    className: "article-nav__inner", // prevnext class by default - main class for buttons
    classNameBtn: "" // class for Btns, stroke type -> 'btn btn--primary' class by default
  };

  //Sidenav plugin options for sidebar
  var sideNavOptions = {
    content: ["articles", "categories", "sections"],
    el: ".sidebar__content-block", // # => id, . => class
    /* optional params */
    className: "sidenav--accordion", // class name for sidenav data, list items by default
    insertPosition: "afterBegin" // insert position sidenav data: <tag>prev elem</tag>'beforeBegin'<tag>'afterBegin'curr.el.'beforeEnd'</tag>'afterEnd'<tag>next elem</tag> =>  beforeEnd by default
  };

  var $sidebarHeader = $(".sidebar__header");
  var $mainHeader = $(".main__header");

  $(".sidebar > .sidebar__container").css(
    "margin-top",
    $sidebarHeader.height()
  );
  $(".main > .main__container").css("margin-top", $mainHeader.outerHeight());
  $window.on("scroll", function() {
    var scrollTop = $window.scrollTop();

    if (scrollTop > 50) {
      $mainHeader.addClass("is-scrolled");
    } else {
      $mainHeader.removeClass("is-scrolled");
    }
  });

  //Init prevnav and sidenav plugins after API data received
  new ApiData({
    cacheLifetime: 0,
    onDataFetched: function(response) {
      if (response) {
        //Sidenav init
        if ($sidebarContent.length) {
          SIDENAV.render(response, sideNavOptions);
        }

        //Highlight current category and section
        var currentUrl = window.location.href;
        var UrlLinks = currentUrl.split('/');
        var categoryIdResult = UrlLinks[UrlLinks.length - 1];
        var categoryId = parseInt(categoryIdResult, 10) || null;

        $(".sidenav-category").each(function(){
          if($(this).attr("id") == ("sidenav-category-" + categoryId)){
            $(this).addClass("is-active");
          }
        });

        $(".sidenav-section").each(function(){
          if($(this).attr("id") == ("sidenav-section-" + categoryId)){
            $(this).addClass("is-active");
          }
        });

        var $articleWrap = $("[data-article-wrap]"),
          $articleLoading = $("[data-article-loading]");

        //Article nav init
        if ($articlesNav.length && !$articleLoading.length) {
          PREVNEXT.render(response, prevNavOptions);

          //Add article titles inside link
          $articlesNav.find(".article-nav__element").each(function() {
            var $this = $(this),
              link = $this.find(".prev-next-btn"),
              textNode = $this.find(".article-nav__title");

            link.html(textNode.text());
            textNode.remove();
          });
        }

        //Auto load content init
        if ($articleWrap.length && $articleLoading.length) {
          var $sidenavArticles = $sidebarContent.find(".sidenav-article"),
            footer = $("#footer"),
            currentArticleId = Utils.getArticleId(),
            articles = response.articles,
            articleLoadTrigger = true,
            articleLoader = $("#article-loader"),
            wrapperTop = $wrapper.offset().top,
            scrollTrigger,
            scrollBottom,
            newMarkup,
            wScroll,
            articlesIdsSequense = [],
            currentArticlePos = 0;

          $sidenavArticles.each(function() {
            articlesIdsSequense.push(
              +$(this)
                .attr("id")
                .replace(/\D+/g, "")
            );
          });

          var currentArticle = articles.filter(function(article) {
            return article.id == currentArticleId;
          })[0];

          if (currentArticle) {
            currentArticlePos = articlesIdsSequense.indexOf(currentArticle.id);
          }

          $window.on("scroll", function() {
            wScroll = $window.scrollTop();
            scrollBottom = wScroll + $window.height();
            scrollTrigger = footer.offset().top;

            if (
              scrollBottom > scrollTrigger &&
              articleLoadTrigger &&
              currentArticlePos < articles.length - 1
            ) {
              articleLoadTrigger = false;
              currentArticlePos += 1;

              currentArticle = articles.filter(function(article) {
                return article.id === articlesIdsSequense[currentArticlePos];
              })[0];

              newMarkup =
                '<article class="article" itemscope itemtype="http://schema.org/Article" data-article="' +
                currentArticle.id +
                '">' +
                '<div class="article-header article-header--small">\n' +
                '<h2 class="h2 article-title">' +
                currentArticle.title +
                "</h2>\n" +
                '<div class="entry-info__content">\n' +
                '<div class="meta">' +
                moment()
                  .endOf(currentArticle.created_at)
                  .format("LLL") +
                "</div>\n" +
                "</div>\n" +
                "</div>" +
                '<div class="article__body">' +
                currentArticle.body +
                "</div>" +
                "</article>";

              articleLoader.css("opacity", 1);

              setTimeout(function() {
                articleLoader.css("opacity", 0);

                $articleWrap.append(newMarkup);
                popupsInit();
                tabsWidth();
                hljs.initHighlighting.called = false;
                hljs.initHighlighting();

                $sidenavArticles.removeClass(HC_SETTINGS.css.activeClass);
                $sidenavArticles
                  .eq(currentArticlePos)
                  .addClass(HC_SETTINGS.css.activeClass);

                var eqArticleID = $sidenavArticles
                  .eq(currentArticlePos)
                  .attr("id")
                  .replace("sidenav-article-", "");

                $(".article").each(function() {
                  var $this = $(this);

                  if ($this.attr("data-article") === eqArticleID) {
                    $this.addClass("js-active-article");
                  }
                });

                history.pushState(null, "", currentArticle.html_url);

                articleLoadTrigger = true;
              }, 600);
            }
          });
        }
      }
    }
  });

  $(document).on("click", ".js-sidenav-category-link", function(e) {
    e.preventDefault();
    var $categoryItem = $(this).parents(".sidenav-category");
    $categoryItem.toggleClass("is-active");
  });

  $(document).on("click", ".js-sidenav-section-link", function(e) {
    e.preventDefault();
    var $categoryItem = $(this).parents(".sidenav-section");
    $categoryItem.toggleClass("is-active");
  });

  $(".sidebar-nav--item").on("click", function() {
    var sidebarNavId = $(this)
      .find(".sidebar-nav--point")
      .attr("data-sidebar");
    $(this).addClass("sidebar-nav--checked");
    $("." + sidebarNavId).addClass("sidebar-nav--active");
  });

  Notification.init();

  $(".dropdown-toggle").on("click", function() {
    var $this = $(this);

    $(".dropdown-menu").attr("aria-expanded", false);
    $this.next().attr("aria-expanded", true);
  });

  //Highlight search field on focus
  $(document).on('focusin', '#query', function(){
    $(this).parents('.search').addClass('active');
  });

  $(document).on('blur', '#query', function(){
    var self = $(this);
    var searchForm = self.parents('.search');
    ($(this).val() === '') ? searchForm.removeClass('active') : searchForm.addClass('active');
  });

  $(document).on('keyup keydown', '#query', function(){
    var self = $(this);
    var close = self.siblings('.search-close');
    ($(this).val() === '') ? close.hide() : close.show();
  });

  $(document).on('click', '.search-close', function(){
    $(this).siblings('input[type="search"]').val('');
    $(this).hide().parents('.search').removeClass('active');
  });

  if(LS.utils.isHomePage()){
    $('.sidebar__link--home').addClass('is-active');
  }
  
  if ($("[data-article-page]").length) {
    $('body').addClass('article-layout');
  }

  $(document).on('click', '.lt-toc--title', function(){
    $('.lt-toc--current').trigger('click');
  });

  if($('.lt-toc').length == 0){
    $('.article-layout').addClass('article-wide');
  }

  //Code tabs: copy the content
  $('.tabs--code').each(function(){
    $(this).find('.tabs-menu').append('<span class="tabs__copy" data-copy><span class="tabs__copytext">Copied!</span></span>');
  });
  
  $(document).on('click', '[data-copy]', function(){    
    var $el = $(this).parents('.tabs').find('.tab:not(".is-hidden")').get(0);

    if(document.body.createTextRange) {
      var $range = document.body.createTextRange();
      $range.moveToElementText(el);
      $range.select();
      document.execCommand("Copy");
      document.selection.empty();
    }
    else if(window.getSelection) {
      var $selection = window.getSelection();
      var $range = document.createRange();
      $range.selectNodeContents($el);
      $selection.removeAllRanges();
      $selection.addRange($range);
      document.execCommand("Copy");
      window.getSelection().removeAllRanges();
    }

    $(this).find('.tabs__copytext').show();

    setTimeout(function(){
      $('.tabs__copytext').hide();
    },2000);
  }); 

});

},{}]},{},[1]);
