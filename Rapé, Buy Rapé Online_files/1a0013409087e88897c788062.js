/* eslint-disable */
(function () {
    /* eslint-disable */
    if (!window.$mcSite) {
        $mcSite = {
            optinFeatures: [],

            loadingPrerequisites: [],
            permissionProviders: {},

            registerPermissionProvider: function (permission, permissionResolutionPromise) {
                window.$mcSite.permissionProviders[permission] = permissionResolutionPromise;
            },

            enableOptIn: function () {
                this.createCookie("mc_user_optin", true, 365);
                this.optinFeatures.forEach(function (fn) {
                    fn();
                });
            },

            runIfOptedIn: function (fn, additionalPermissions) {
                Promise.all(this.loadingPrerequisites).then(function () {
                    this._runIfOptedIn.call(this, fn, additionalPermissions);
                }.bind(this));
            },

            _runIfOptedIn: function (fn, additionalPermissions) {
                if (!additionalPermissions || additionalPermissions.length === 0) {
                    if (this.hasOptedIn()) {
                        fn();
                    } else {
                        this.optinFeatures.push(fn);
                    }
                } else {
                    var wrappedPermmissionsFn = function () {
                        if (additionalPermissions.length === 0) {
                            fn();
                        }

                        // Get available permission providers
                        var permissionProviders = additionalPermissions.reduce(function (providers, permission) {
                            if (window.$mcSite.permissionProviders[permission]) {
                                providers.push(window.$mcSite.permissionProviders[permission]);
                            }
                            return providers;
                        }, []);

                        // Check if all permissions are granted
                        Promise.all(permissionProviders).then(function (results) {
                            var allPermissionsGranted = results.every(function (result) {
                                return result === true;
                            });

                            if (allPermissionsGranted) {
                                fn();
                            }
                        });
                    }

                    if (this.hasOptedIn()) {
                        wrappedPermmissionsFn();
                    } else {
                        this.optinFeatures.push(wrappedPermmissionsFn);
                    }
                }
            },

            hasOptedIn: function () {
                var cookieValue = this.readCookie("mc_user_optin");

                if (cookieValue === undefined) {
                    return true;
                }

                return cookieValue === "true";
            },

            createCookie: function (name, value, expirationDays) {
                var cookie_value = encodeURIComponent(value) + ";";

                if (expirationDays === undefined) {
                    throw new Error("expirationDays is not defined");
                }

                // set expiration
                if (expirationDays !== null) {
                    var expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + expirationDays);
                    cookie_value += " expires=" + expirationDate.toUTCString() + ";";
                }

                cookie_value += "path=/";
                document.cookie = name + "=" + cookie_value;
            },

            readCookie: function (name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(";");

                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];

                    while (c.charAt(0) === " ") {
                        c = c.substring(1, c.length);
                    }

                    if (c.indexOf(nameEQ) === 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }

                return undefined;
            }
        };
    }

    

    $mcSite.pixel={settings:{domain:"mcjs.prd.a.intuit.com",version:"1.22.0",apiUrl:"https:\/\/chimpstatic.com\/pixel",autoTrack:"true",context_referenceSystem:"WOOCOMMERCE",context_mailchimpUserId:"248611190",context_mailchimpAudienceId:"307852",context_mailchimpForeignStoreId:"698db5c957962",context_publicConnectedSiteId:"1a0013409087e88897c788062"}};
})();
(function () {
    var module = window.$mcSite.pixel;

    if (module.installed === true) {
        return;
    }

    if (!module.settings) {
        return;
    }

    var settings = module.settings;

    if (!settings.domain || !settings.version || !settings.apiUrl) {
        return;
    }

    var sdkUrl = "https://" + settings.domain + "/assets/pixel-reporting-sdk/" + settings.version + "/pixel-reporting-sdk.js";

    var context = {
        mailchimpAudienceId: settings.context_mailchimpAudienceId,
        mailchimpStoreId: settings.context_mailchimpForeignStoreId,
        mailchimpConnectedSiteId: settings.context_publicConnectedSiteId,
        mailchimpUserId: settings.context_mailchimpUserId
    };

    var script = document.createElement("script");
    script.type = "module";
    script.textContent =
        'import pixel from "' + sdkUrl + '";' +
        "window.$mcSite.pixel.api = pixel;";

    window.$mcSite.runIfOptedIn(function () {
        Object.defineProperty(module, "api", {
            set: function (pixel) {
                Object.defineProperty(module, "api", { value: pixel, writable: true });

                var disableMailchimpPixelAutoTrack =
                    typeof window.disable_mailchimp_pixel_autotrack !== "undefined" &&
                    window.disable_mailchimp_pixel_autotrack === true;

                var autoTrack = disableMailchimpPixelAutoTrack ? false : settings.autoTrack === "true";

                pixel.init({
                    apiUrl: settings.apiUrl.replace(/\\\//g, "/"),
                    autoTrack: autoTrack,
                    referenceSystem: settings.context_referenceSystem,
                    context: context
                });

                module.installed = true;
            },
            configurable: true
        });

        document.body.appendChild(script);
    }, [
        "preferencesProcessingAllowed",
        "analyticsProcessingAllowed",
        "marketingAllowed"
    ]);
}());

