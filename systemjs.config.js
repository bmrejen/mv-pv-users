(function(global) {

    var map = {
        // our app is within the app folder
        app: 'app',
        // angular bundles
        '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
        '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
        '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
        '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
        '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
        '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
        '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
        // other libraries
        'rxjs': 'npm:rxjs'
    };

    var packages = {
        app: {
            main: './main.js',
            defaultExtension: 'js'
        },
        rxjs: {
            defaultExtension: 'js'
        }

    };

    var config = {
        defaultJSExtensions: true,
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        map: map,
        packages: packages
    };

    System.config(config);
})(this);
