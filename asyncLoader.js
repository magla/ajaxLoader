/*
    JS object for asynchronous loading of web pages
    Input parameters: 
        - settings: JS object

    Dependencies: jQuery

    Usage: 
    var asyncLoader = new AsyncLoader();
    asyncLoader.load($(link), {}); 

*/

(function(window) {

    'use strict';

    /**
     * AsyncLoader function/object
     */
    function AsyncLoader() {
        this._init();

        // Default settings
        this.settings = {
            link: null,
            loadWrapper: '.asyncWrapper',
            loadContent: '.asyncContent',
            pathname: window.location.pathname,
            production: false,
            preloadAction: function() {},
            postloadAction: function() {}
        };
    }

    /**
     * Initialize the loader
     */
    AsyncLoader.prototype._init = function() {
        this._backListener();
    }

    /**
     * Main public function
     */
    AsyncLoader.prototype.load = function(settings) {
        this.settings = $.extend(this.settings, settings);
        this.settings.preloadAction();
        this._loadContent(this.settings.link);
        this.settings.postloadAction();
    }

    /**
     * Load the content and put it into the DOM
     */
    AsyncLoader.prototype._loadContent = function() {
        var loadSrc = this.settings.link.attr('href');
        $.ajax({
                url: loadSrc,
                data: {
                    xhr: 1
                },
                method: 'POST'
            }).success(function(data) {
                var head = $(data).find('head');

                // Append new html
                this._appendData(data);

                // Update metadata and run google analytics
                this._metadataUpdate(head);
                this._historyUpdate();

                return true;
            })
            .error(function(data) {
                location.href = '/404.html';
            });
    }

    /**
     * Append new html into the DOM
     */
    AsyncLoader.prototype._appendData = function(data) {
        data = $(data).find(this.settings.loadContent);
        $(asyncLoader.loadWrapper).empty().append(data);
    }

    /**
     * Update the metadata information
     */
    AsyncLoader.prototype._metadataUpdate = function(head) {
        var title = head.find('title').text();
        var desc = head.find('meta[name="description"]').text();
        var keywords = head.find('meta[name="keywords"]').text();

        document.title = title;
        $('meta[name="description"]').attr('content', desc);
        $('meta[name="keywords"]').attr('content', keywords);
    }

    /**
     * Update the history
     */
    AsyncLoader.prototype._historyUpdate = function() {
        var loadSrc = this.settings.link.attr('href');

        // If back button pressed, do not push state
        if (!(this.settings.link.hasClass('backHandler'))) {
            history.pushState({
                page: loadSrc,
                prevUrl: document.location.href /*, chunk: this.rel*/
            }, null, loadSrc);
        }
    }

    /**
     * Send data to Google Analytics
     */
    AsyncLoader.prototype._googleAnalytics = function() {
        if (this.settings.production) {
            var newPage = document.location.pathname + document.location.search + document.location.hash;
            ga('send', 'pageview', newPage);
        }
    }

    /**
     * Back button
     */
    AsyncLoader.prototype._backListener = function() {
        window.beginUrl = this.settings.pathname;

        $(window).on('popstate', function(event) {
            if (history.state === null) {
                $('body').append('<a class="backHandler" href="' + window.beginUrl + '" style="display: none;"></a>');
                this._loadContent($('.backHandler'));
                $('.backHandler').remove();
            } else {
                // dummy anchor for ajaxNavigation, simulates back click:
                $('body').append('<a class="backHandler" data-loader="' + history.state.dataload + '" href="' + history.state.page + '" style="display: none;"></a>');
                this._loadContent($('.backHandler'));
                $('.backHandler').remove();
            }
        });
    }

    /**
     * Add AsyncLoader to global namespace
     */
    window.AsyncLoader = AsyncLoader;

})(window);
