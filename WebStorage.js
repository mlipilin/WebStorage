/**
 * Universal storage object.
 */
var WebStorage = WebStorage || (function () {
    "use strict";

    /**
     * Base storage class. 
     *
     * @return {Storage} New storage object.
     */
    var Storage = Storage || (function () {

        /**
         * Constructor of base storage class.
         *
         * @constructor
         * @param {object} parameters Constructor parameters.
         * @return {Storage} New storage object.
         */
        var Storage = function (parameters) {
            parameters = parameters || {};
            this._name = parameters.name;
        }

        /**
         * Set new item to storage / update existing item.
         * 
         * @param {object} key Item identifier.
         * @param {object} value Item value.
         */
        Storage.prototype.setItem = function (key, value) { };

        /**
         * Get item value by identifier.
         * 
         * @param {object} key Item identifier.
         * @return {object} Item from storage.
         */
        Storage.prototype.getItem = function (key) { };

        /**
         * Remove item by identifier.
         * 
         * @param {object} key Item identifier.
         */
        Storage.prototype.removeItem = function (key) { };

        /**
         * Clear all items in storage.
         */
        Storage.prototype.clear = function () { };

        return Storage;
    })();



    /**
     * Local storage class. 
     *
     * @return {LocalStorage} New local storage object.
     */
    var LocalStorage = LocalStorage || (function () {

        /**
         * Constructor of local storage class. 
         *
         * @constructor
         * @param {object} parameters Constructor parameters.
         * @return {LocalStorage} New local storage object.
         */
        var LocalStorage = function (parameters) {
            parameters = parameters || {};
            LocalStorage.parent.constructor.apply(this, arguments);

            if (!localStorage.getItem(this._name)) {
                var storageObject = {};
                localStorage.setItem(this._name, JSON.stringify(storageObject));
            }
        };
        extend(LocalStorage, Storage);

        /**
         * Set new item to storage / update existing item.
         * 
         * @param {object} key Item identifier.
         * @param {object} value Item value.
         */
        LocalStorage.prototype.setItem = function (key, value) {
            var storageObject = JSON.parse(localStorage.getItem(this._name));
            storageObject[key] = value;

            localStorage.setItem(this._name, JSON.stringify(storageObject));
        };

        /**
         * Get item value by identifier.
         * 
         * @param {object} key Item identifier.
         * @return {object} Item from storage.
         */
        LocalStorage.prototype.getItem = function (key) {
            var storageObject = JSON.parse(localStorage.getItem(this._name));
            return storageObject && storageObject[key];
        };

        /**
         * Remove item by identifier.
         * 
         * @param {object} key Item identifier.
         */
        LocalStorage.prototype.removeItem = function (key) {
            var storageObject = JSON.parse(localStorage.getItem(this._name));
            delete storageObject[key];

            localStorage.setItem(this.name, JSON.stringify(storageObject));
        };

        /**
         * Clear all items in storage.
         */
        LocalStorage.prototype.clear = function () {
            var storageObject = {};
            localStorage.setItem(this._name, JSON.stringify(storageObject));
        };

        /**
         * Remove storage.
         */
        LocalStorage.prototype.remove = function () {
            delete localStorage[this._name];
        };

        return LocalStorage;
    })();



    /**
     * Cookie storage class. 
     *
     * @return {CookieStorage} New cookie storage object.
     */
    var CookieStorage = CookieStorage || (function () {

        /**
         * Get browser cookies function.
         * 
         * @return {object} Browser cookies object.
         */
        var getCookies = getCookies || function () {
            var cookies = {},
                cookieString = document.cookie,
                cookieList = [];

            if (cookieString === '') {
                return cookies;
            }

            cookieList = cookieString.split('; ');
            for (var i = 0, length = cookieList.length; i < length; i += 1) {
                var cookie = cookieList[i],
                    p = cookie.indexOf('='),
                    name = cookie.substring(0, p),
                    value = cookie.substring(p + 1);

                value = decodeURIComponent(value);
                cookies[name] = value;
            }

            return cookies;
        };

        /**
         * Constructor of cookie storage class. 
         *
         * @constructor
         * @param {object} parameters Constructor parameters.
         * @return {CookieStorage} New cookie storage object.
         */
        var CookieStorage = function (parameters) {
            parameters = parameters || {};
            CookieStorage.parent.constructor.apply(this, arguments);
            this._days = 365;

            var cookies = getCookies(),
                storageObject = (cookies[this._name] && JSON.parse(cookies[this._name])) || {},
                cookie = "";

            cookie = this._name + "=" + encodeURIComponent(JSON.stringify(storageObject)) + "; max-age=" + this._days * 60 * 60 * 24;
            document.cookie = cookie;
        };
        extend(CookieStorage, Storage);

        /**
         * Set new item to storage / update existing item.
         * 
         * @param {object} key Item identifier.
         * @param {object} value Item value.
         */
        CookieStorage.prototype.setItem = function (key, value) {
            var cookies = getCookies(),
                storageObject = JSON.parse(cookies[this._name]),
                cookie = "";

            storageObject[key] = value;
            cookie = this._name + "=" + encodeURIComponent(JSON.stringify(storageObject)) + "; max-age=" + this._days * 60 * 60 * 24;
            document.cookie = cookie;
        };

        /**
         * Get item value by identifier.
         * 
         * @param {object} key Item identifier.
         * @return {object} Item from storage.
         */
        CookieStorage.prototype.getItem = function (key) {
            var cookies = getCookies(),
                storageObject = JSON.parse(cookies[this._name]);

            return storageObject && storageObject[key];
        };

        /**
         * Remove item by identifier.
         * 
         * @param {object} key Item identifier.
         */
        CookieStorage.prototype.removeItem = function (key) {
            var cookies = getCookies(),
                storageObject = JSON.parse(cookies[this._name]),
                cookie = "";

            delete storageObject[key];
            cookie = this._name + "=" + encodeURIComponent(JSON.stringify(storageObject)) + "; max-age=" + this._days * 60 * 60 * 24;
            document.cookie = cookie;
        };

        /**
         * Clear all items in storage.
         */
        CookieStorage.prototype.clear = function () {
            var cookie = this._name + "=" + encodeURIComponent(JSON.stringify({})) + "; max-age=" + this._days * 60 * 60 * 24;
            document.cookie = cookie;
        };

        /**
         * Remove storage.
         */
        CookieStorage.prototype.remove = function () {
            var cookie = this._name + "=" + encodeURIComponent(JSON.stringify({})) + "; max-age=0";
            document.cookie = cookie;
        };

        return CookieStorage;
    })();
    
    
    
    /**
     * User data storage class.
     * 
     * @return {UserDataStorage} New user data storage object.
     */
     var UserDataStorage = UserDataStorage || (function(){
     
        /**
         * Constructor of user data storage class. 
         *
         * @constructor
         * @param {object} parameters Constructor parameters.
         * @return {UserDataStorage} New user data storage object.
         */
        var UserDataStorage = function(parameters){
            parameters = parameters || {};
            UserDataStorage.parent.constructor.apply(this, arguments);
        };
        extend(UserDataStorage, Storage);
        
        /**
         * Set new item to storage / update existing item.
         * 
         * @param {object} key Item identifier.
         * @param {object} value Item value.
         */
        UserDataStorage.prototype.setItem = function (key, value) {};

        /**
         * Get item value by identifier.
         * 
         * @param {object} key Item identifier.
         * @return {object} Item from storage.
         */
        UserDataStorage.prototype.getItem = function (key) {};

        /**
         * Remove item by identifier.
         * 
         * @param {object} key Item identifier.
         */
        UserDataStorage.prototype.removeItem = function (key) {};

        /**
         * Clear all items in storage.
         */
        UserDataStorage.prototype.clear = function () {};

        /**
         * Remove storage.
         */
        UserDataStorage.prototype.remove = function () {};
        
        return UserDataStorage;
     })();
    


    /**
     * Interface for work with web storage. 
     */
    var WebStorage = {
        
        /**
         * Create web storage.
         * 
         * @param {string} name Storage name.
         * @return {Storage} New storage object.
         */
        create: function (name) {
            var parameters = {
                name: name
            };

            // Check supporting localStorage, Cookies or UserData
            return new CookieStorage(parameters);
        }
    };

    return WebStorage;
})();

var extend = extend || function (Child, Parent) {
    function F() { }
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.parent = Parent.prototype;
};