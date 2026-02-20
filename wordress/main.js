/**
 * Component Loader — loads header.html & footer.html into their placeholders
 */
(function () {
    'use strict';

    function loadComponent(placeholderId, componentPath, callback) {
        var el = document.getElementById(placeholderId);
        if (!el) return;

        fetch(componentPath)
            .then(function (res) {
                if (!res.ok) throw new Error('Failed to load: ' + componentPath);
                return res.text();
            })
            .then(function (html) {
                el.outerHTML = html;
                if (typeof callback === 'function') callback();
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    var scriptSrc = document.currentScript
        ? document.currentScript.src
        : (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1].src;
        })();

    var base = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);

    loadComponent('header-placeholder', base + 'components/header.html', function () {
        if (typeof initHeader === 'function') initHeader();
        document.dispatchEvent(new Event('headerLoaded'));
    });

    loadComponent('footer-placeholder', base + 'components/footer.html', function () {
        document.dispatchEvent(new Event('footerLoaded'));
    });
})();

$(function () {
    // Page-specific logic here
});
