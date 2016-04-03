(function () {/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

require.config({
    baseUrl: '../../../',
    paths: {
        '$': 'node_modules/jquery/dist/jquery.min',
        'bluebird': 'node_modules/bluebird/js/browser/bluebird',
        'velocity': 'node_modules/velocity-animate/velocity.min',
        'navitron': 'node_modules/navitron/dist/navitron.min',
        'plugin': 'node_modules/plugin/dist/plugin.min',
        'requirejs': 'node_modules/requirejs/require',
        'astro-client': 'node_modules/astro-sdk/js/src/astro-client',
        'astro-base': 'node_modules/astro-sdk/js/src/astro-base',
        'astro-full': 'node_modules/astro-sdk/js/src/astro-full',
        'astro-rpc': 'node_modules/astro-sdk/js/src/global/astro-rpc',
        'left-drawer': 'app/scaffold-www/js/left-drawer',
        'ui-config': 'app/scaffold-www/js/ui-config'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

define("ui-config", function(){});

require(['ui-config'], function() {
    require([
        '$',
        'navitron',
        'astro-client'
    ],
    function($) {

        // Given a list of menuItems in the specified format,
        // generate HTML that navitron JS will understand.
        // The left menu supports a depth level of 0 to N.
        //
        // ** Note: All leaf nodes require an `href` key. **
        // Format:
        // [{
        //     "title": "Womens",
        //     "subItems": [
        //         {
        //             "title": "New Arrivals",
        //             "subItems": [
        //                 {
        //                     "title": "New In Shop All",
        //                     "href": "/womens/highlights/womens-new-arrivals"
        //                 },
        //                 {
        //                     "title": "New In Clothing",
        //                     "href": "/womens/highlights/new-in-clothing"
        //                 }
        //             ]
        //         }
        //     }, ... ]

        var bodyTemplate = document.body.innerHTML;
        var generateNavitronHtml = function(menuItems) {
            var SPACES_PER_TAB = 4;
            var currentTabDepth = 0;
            var generatedHtmlString = "";

            // pretty printer
            var pr = function(str) {
                var indent = Array((SPACES_PER_TAB * currentTabDepth) + 1).join(' ');
                generatedHtmlString = generatedHtmlString + htmlEscape(str) + '\n';
            };

            var htmlEscape = function(str) {
                return str.replace('&', '&amp;');
            };

            var parseData = function(menuItems) {
                for (var i = 0; i < menuItems.length; i++) {
                    var item = menuItems[i];
                    buildHtmlForItem(item);
                }
            };

            var buildHtmlForItem = function(item) {
                pr('<li>');
                currentTabDepth++;
                if(item.subItems && item.subItems.length > 0) {
                    buildNextButton(item.title);
                    pr('<ul>');
                    currentTabDepth++;

                    buildHeader(item.title);

                    parseData(item.subItems);
                    currentTabDepth--;
                    pr('</ul>');
                } else {
                    pr('<a class="navitron-link" href="' + item.href + '">' + item.title + '</a>');
                }
                currentTabDepth--;
                pr('</li>');
            };

            var buildNextButton= function(title) {
                pr('<button class="navitron__next-pane" type="button">' + title + '</button>');
            };

            var buildHeader = function(title) {
                pr('<li class="navitron__header">');
                currentTabDepth++;
                pr('<div class="c-bar">');
                currentTabDepth++;
                pr('<button class="c-button navitron__prev-pane" type="button">Back</button>');
                pr('<span class="c-bar__heading">' + title + '</span>');
                currentTabDepth--;
                pr("</div>");
                currentTabDepth--;
                pr('</li>');
            };

            parseData(menuItems);

            return generatedHtmlString;
        };

        var navigateToNewRootView = Astro.jsRpcMethod('navigateToNewRootView', ['url', 'title']);

        var setupNavitron = function() {
            // Setup the glue required to open selected items in the main navigation view
            $('.navitron-link').on('click', function(event) {
                var url = event.target.href;
                var title = event.target.innerText;
                navigateToNewRootView(url, title).error(function(error) {
                    console.log('error', error);
                });
                event.preventDefault();
            });

            // Run the secret sauce to create the navitron
            $('#leftMenuNavitron').navitron({
                structure: false,
                shiftAmount: 100
            });
        };

        var renderNavitron = function(menuItems) {
            var generatedHtml = generateNavitronHtml(menuItems);
            $('#menuPlaceHolder').replaceWith(generatedHtml);
            setupNavitron();
        };

        Astro.jsRpcMethod('menuItems', [])().then(function(menuItems) {
            renderNavitron(menuItems);
        });

        // Allows the left drawer to be rerendered by having the drawerController
        // call `renderLeftMenu`.
        Astro.on('setMenuItems', function(params) {
            document.body.innerHTML = bodyTemplate;
            renderNavitron(params.menuItems);
        });
    });
});

define("left-drawer", function(){});

// Scripts required in via this file will be combined into ui.js
require(
    [
        'left-drawer'
    ],
    function(
        leftDrawerUI
    ) {
        // Noop for now
    }
);

define("app/scaffold-www/js/ui.js", function(){});

}());