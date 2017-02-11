/*
    JS object for asynchronous loading of web pages
    Input parameters: 
        - settings: JS object

    Dependencies: jQuery

    Usage: 
    var asyncLoader = new AsyncLoader();
    asyncLoader.load({}); 
*/

(function(window) {

    'use strict';

    /**
     * AsyncLoader function/object
     */
    function AsyncLoader() {
        this._init();
    }

    /**
     * Initialize the loader
     */
    AsyncLoader.prototype._init = function() {
        this._backListener();
    }

    // Default settings
    AsyncLoader.prototype.settings = {
        link: null,
        loadWrapper: '#asyncWrapper',
        loadContent: '.asyncContent',
        partial: true,
        pathname: window.location.pathname,
        production: false
    }

    /**
     * Main public functions
     */
    AsyncLoader.prototype.load = function(settings) {
        this.settings = $.extend(this.settings, settings);
        this._loadContent(this.settings.link);
    }

    AsyncLoader.prototype.preloadAction = function(callback) {
        callback();
    }

    AsyncLoader.prototype.postloadAction = function(callback) {
        callback();
    }

    AsyncLoader.prototype.errorAction = function(callback) {
        if (callback) {
            callback();
        } else location.href = '404.html';
    }

    /**
     * Load the content and put it into the DOM
     */
    AsyncLoader.prototype._loadContent = function() {
        var loadSrc = this.settings.link.attr('href');
        var that = this;

        $.ajax({
            url: loadSrc,
            method: 'GET',   
            dataType: 'html',
            async: true,
            beforeSend: that.preloadAction(),
            success: function(data) {

                // Append new html
                that._appendData(data);

                // Run google analytics if on production
                if (that.settings.production)
                    that._googleAnalytics();
        
                // Update the history via History API
                that._historyUpdate();

                // Update metadata if the data is not partial
                if (!that.settings.partial){
                    var head = $(data).find('head');
                    that._metadataUpdate(head);
                }

                return true;
            }, 
            error: that.errorAction(),
            complete: that.postloadAction()
        });
    }

    /**
     * Append new html into the DOM
     */
    AsyncLoader.prototype._appendData = function(data) {
        data = $(data).find(this.settings.loadContent);

        // Empty the wrapper and append new data to the DOM
        $(this.settings.loadWrapper).empty().append(data);
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
        var that = this;
        window.beginUrl = this.settings.pathname;

        $(window).on('popstate', function(event) {
            if (history.state === null) {
                $('body').append('<a class="backHandler" href="' + window.beginUrl + '" style="display: none;"></a>');
                that.load({link: $('.backHandler')});
                $('.backHandler').remove();
            } else {
                // dummy anchor for ajaxNavigation, simulates back click:
                $('body').append('<a class="backHandler" data-loader="' + history.state.dataload + '" href="' + history.state.page + '" style="display: none;"></a>');
                that.load({link: $('.backHandler')});
                $('.backHandler').remove();
            }
        });
    }

    /**
     * Add AsyncLoader to global namespace
     */
    window.AsyncLoader = AsyncLoader;

})(window);
