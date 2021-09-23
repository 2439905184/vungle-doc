var Notification = {
  init: function(options) {
    var defaultOptions = {
      el: '.js-alert-box',
      labels: ['alert_info', 'alert_success', 'alert_warning', 'alert_danger'],
      multiLang: true,
      showIcon: true,
      closeButton: true,
      showTitle: false
    };

    var newOptions = $.extend(defaultOptions, options);
    var optionsLabelsLength = newOptions.labels.length;

    function getLocale() {
      var links = window.location.href.split('/');
      var hcIndex = links.indexOf('hc');
      var links2 = links[hcIndex + 1].split('?');

      return links2[0];
    }

    var baseURL = '/api/v2/help_center/articles/search.json?label_names=' + newOptions.labels.join();
    var baseURLWithLocale = baseURL + '&locale=' + getLocale();

    var articlesURL = newOptions.multiLang ? baseURL : baseURLWithLocale;

    $.get(articlesURL).done(response);

    /**
     * @param {{label_names}[]} res.results
     */
    function response(res) {

      var articles = res.results;

      if (res && articles && articles.length > 0) {
        var $notifications = $('<div />', {
          'class': 'notifications'
        });

        articles.forEach(function(item) {
          var id = item.id;
          var key = 'notify-' + id;

          if (localStorage.getItem(key)) {
            return;
          }

          var cache;
          var similarLabel;

          var articleLabelsLength = item.label_names.length;

          for (var i = 0; i < optionsLabelsLength; ++i) {
            cache = newOptions.labels[i];

            for (var j = 0; j < articleLabelsLength; ++j) {
              if (cache === item.label_names[j]) {
                similarLabel = cache;
              }
            }
          }

          var $notify = $('<div />', {
            id: id,
            'class': 'alert alert--' + similarLabel
          });

          if (newOptions.showIcon) {
            var $notifyShape = $('<div />', {
              'class': 'alert__shape alert__shape--main'
            }).prependTo($notify);

            $('<i />', {
              'class': 'alert__icon alert__icon--notify'
            }).prependTo($notifyShape);
          }

          var $notifyBody = $('<div />', {
            'class': 'alert__body',
            html: item.body
          }).appendTo($notify);

          if (newOptions.showTitle) {
            $('<div />', {
              'class': 'alert__title',
              html: item.title
            }).prependTo($notifyBody);
          }

          if (newOptions.closeButton) {
            var $notifyShapeClose = $('<div />', {
              'class': 'alert__shape alert__shape--close'
            }).appendTo($notify);

            var $notifyIconClose = $('<button />', {
              'class': 'alert__icon alert__icon--close',
              'aria-hidden': 'true'
            }).prependTo($notifyShapeClose);

            $notifyIconClose.click(function() {
              $notify.hide();

              localStorage.setItem(key, 'hidden');
            });
          }

          $notify.appendTo($notifications);
        });

        $notifications.prependTo(newOptions.el);
      }
    }
  }
};
