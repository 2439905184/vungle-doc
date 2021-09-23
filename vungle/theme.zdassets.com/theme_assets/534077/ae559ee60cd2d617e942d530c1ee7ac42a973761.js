(function() {

  var debug = false;

  var root = this;

  var globalOptions = {
    className: 'by-default',
    mainClass: 'sidenav',
    insertPosition: 'beforeEnd'
  }

  var SIDENAV = function(obj) {
    if (obj instanceof SIDENAV) return obj;
    if (!(this instanceof SIDENAV)) return new SIDENAV(obj);
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = SIDENAV;
    }
    exports.SIDENAV = SIDENAV;
  } else {
    root.SIDENAV = SIDENAV;
  }


  // public methods
  SIDENAV.render = function(response, options) {
    if (debug) console.log('response from APIDATA', response);
    if (debug) console.log('optionsSideNav', options);

    isCorrectOptions(options, response, function(warning) {
      if (warning) {
        console.log('ERROR: options SideNav plugin is not Correct! ->', warning);
      } else {
        if (debug) console.log('options SideNav plugin is correct');
        extendOptions(globalOptions, options, function() {
          var locale = getLocale(window.location.pathname),
              currentSectionId = getSectionId(),
              currentArticleId = getArticleId(),
              currentCategoryId = getCategoryId();

          if (debug) console.log('currentSectionId', currentSectionId);
          if (debug) console.log('currentArticleId', currentArticleId);
          if (debug) console.log('currentCategoryId', currentCategoryId);
          if (debug) console.log('globalOptions extended', globalOptions);

          var divisions = [];
          globalOptions.content.forEach(function(item, i, arr) {
            if (item == 'categories') divisions[0] = item;
            if (item == 'sections') divisions[(arr.length - 1)] = item;
            if (item == 'articles') divisions[arr.length] = item;
          });
          for (var i = divisions.length; i >= 0; i--) {
            if (!divisions[i]) divisions.splice(i, 1);
          }

          if (debug) console.log('divisions', divisions);

          var concatMenu = [];
          for (var i = 0; i < divisions.length; i++) {
            response[divisions[i]].forEach(function(item) {
              item.divisionType = divisions[i];
              if (item.id == currentSectionId || item.id == currentArticleId || item.id == currentCategoryId) {
                item.isActive = 'is-active ';
              } else {
                item.isActive = '';
              }
            });
            concatMenu = concatMenu.concat(response[divisions[i]]);
          }
          if (debug) console.log('concatMenu', concatMenu);

          var elStore = {};
          var preMenu = concatMenu.reduce(function(res, current) {
            if (!res.groups) res.groups = [];

            if (!current.hasOwnProperty('section_id')) {
              var id;
              if (current.hasOwnProperty('category_id')) {
                id = current.category_id;
              } else {
                id = current.id
              }

              if (!elStore[id]) {
                var el = {id: id, nested: []};
                res.groups.push(el);
                elStore[id] = el;
              }

              if (current.hasOwnProperty('category_id')) {
                elStore[id].nested.push(current);
              } else {
                for (var key in current) {
                  if (key != 'id') elStore[id][key] = current[key];
                }
              }
            } else {
              if (isEmpty(elStore) || elStore['000']) {
                var id = '000';
                if (!elStore[id]) {
                  var el = {id: id, nested: []};
                  res.groups.push(el);
                  elStore[id] = el;
                }
                if (current.id == currentArticleId) {
                  current.isActive = 'is-active ';
                } else {
                  current.isActive = '';
                }
                if (current.section_id == currentSectionId) elStore[id].nested.push(current);
              } else {
                for (var key in elStore) {
                  elStore[key].nested.forEach(function(section, i) {
                    if (current.section_id == section.id) {
                      if (!elStore[key].nested[i].nested) elStore[key].nested[i].nested = [];
                      elStore[key].nested[i].nested.push(current);
                    }
                  });
                }
              }
            }

            return res;
          }, {});

          parseTemplate(preMenu.groups, '<ul>', '</ul>', function() {
            if (debug) console.log('globalOptions.renderedMenu', globalOptions.renderedMenu);
            if (globalOptions.renderedMenu) {
              var parent = document.getElementById(globalOptions['el']) ? document.getElementById(globalOptions['el']) : document.querySelector(globalOptions['el']);
              if (debug) console.log('globalOptions.el', parent);

              globalOptions.renderedMenu = '<div class="' + globalOptions.mainClass + ' ' + globalOptions.className + '">' + globalOptions.renderedMenu + '</div>';
              parent.insertAdjacentHTML(globalOptions.insertPosition, globalOptions.renderedMenu);
            }
          });
        });
      }
    });
  }


  // private methods
  function isCorrectOptions(options, response, callback) {
    if (debug) console.log('globalOptions SideNav', globalOptions);
    if (debug) console.log('SideNav options recvd', options);

    if (!options.hasOwnProperty('content')) return callback('has not content');
    if (!Array.isArray(options.content) || options.content.length == 0) return callback('content is not array or empty');
    if (!options.hasOwnProperty('el')) return callback('has not el');
    if (!/^#(\w)|^\.(\w)/.test(options.el)) return callback('el has not id or class');

    for (var i = 0; i < options.content.length; i++) {
      if (!response.hasOwnProperty(options.content[i])) return callback('has not division "' + options.content[i] + '" in response APIDATA, should query before render it');
    }

    return callback();
  }

  function getLocale(url) {
    var links = url.split('/'),
        hcIndex = links.indexOf('hc'),
        links2 = links[hcIndex + 1].split('?');
    return links2[0];
  }

  function getCategoryId() {
    if ($('[data-category-page]').length) {
      return getPageId(window.location.href);
    } else {
      var categoryLink = $('.breadcrumbs li:nth-child(2) a');
      return categoryLink.length ? getPageId(categoryLink.attr('href')) : null;
    }
  }

  function getSectionId() {
    if ($('[data-section-page]').length) {
      return getPageId(window.location.href);
    } else {
      var sectionLink = $('.breadcrumbs li:nth-child(3) a');
      return sectionLink.length ? getPageId(sectionLink.attr('href')) : null;
    }
  }

  function getArticleId() {
    if ($('[data-article-page]').length) {
      return getPageId(window.location.href);
    }
  }

  function getPageId(url) {
    var links = url.split('/');
    var result = links[links.length - 1];
    return parseInt(result, 10) || null;
  }

  function extendOptions(source, properties, callback) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
        if (property == 'el' && /^#(\w)/.test(properties[property])) source.el = properties.el.replace('#', '');
      }
    }
    return callback();
  }

  function parseTemplate(menuEls, startTag, endTag, callback) {
    if (debug) console.log('menuEls', menuEls);
    if (!globalOptions.hasOwnProperty('renderedMenu')) globalOptions.renderedMenu = '';
    if (menuEls[0].hasOwnProperty('name') || menuEls[0].hasOwnProperty('title')) var hasTopLevel = true;

    if (hasTopLevel) {
      startTag = startTag.replace('>', ' class="' + globalOptions.mainClass + '-' + menuEls[0].divisionType + '">');
      globalOptions.renderedMenu = globalOptions.renderedMenu + startTag;
    }

    menuEls.forEach(function(item) {
      if (hasTopLevel)  {
        var name = item.hasOwnProperty('name') ? item.name : item.title;

          if (item.divisionType == 'articles') {
            globalOptions.renderedMenu = globalOptions.renderedMenu + '<li class="' + item.isActive + globalOptions.mainClass + '-' + toSingular(item.divisionType) + '"' + ' id="' + globalOptions.mainClass + '-' + toSingular(item.divisionType) + '-' + item.id + '" data-article-draft="' + item.draft + '"><a class="' + globalOptions.mainClass + '-' + toSingular(item.divisionType) + '__link js-' + globalOptions.mainClass + '-' + toSingular(item.divisionType) + '-link" href="/hc/articles/' + item.id + '">' + name + '</a>';
          }

          else {
            globalOptions.renderedMenu = globalOptions.renderedMenu + '<li class="' + item.isActive + globalOptions.mainClass + '-' + toSingular(item.divisionType) + '"' + ' id="' + globalOptions.mainClass + '-' + toSingular(item.divisionType) + '-' + item.id + '"><a class="' + globalOptions.mainClass + '-' + toSingular(item.divisionType) + '__link js-' + globalOptions.mainClass + '-' + toSingular(item.divisionType) + '-link">' + name + '</a>';
          }
      }
      if (item.hasOwnProperty('nested') && item.nested.length > 0) {
        return parseTemplate(item.nested, '<ul>', '</li></ul>', false);
      } else {
        globalOptions.renderedMenu = globalOptions.renderedMenu + '</li>';
      }
    });

    if (hasTopLevel) globalOptions.renderedMenu = globalOptions.renderedMenu + endTag;

    if (callback) callback();
  }

  function isEmpty(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }

  function toSingular(plural) {
    var singular;
    if (plural == 'categories') singular = 'category';
    if (plural == 'sections') singular = 'section';
    if (plural == 'articles') singular = 'article';
    return singular;
  }

  // option needed for install plugin via NPM, Bower, etc.
  if (typeof define === 'function' && define.amd) {
    define('sidenavhelpdesk-js', [], function() {
      return SIDENAV;
    });
  }
}.call(this));