var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("app/constants", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FIREBASE_URL, FIREBASE_REF;
    return {
        setters:[],
        execute: function() {
            exports_1("FIREBASE_URL", FIREBASE_URL = 'https://boiling-heat-8707.firebaseio.com/heroes/');
            exports_1("FIREBASE_REF", FIREBASE_REF = new Firebase(FIREBASE_URL));
        }
    }
});
System.register("app/hero", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("node_modules/firebase-angular2/src/firebase.service.factory", ["node_modules/firebase-angular2/src/firebase.service"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var firebase_service_1;
    /**
     * Gets the default factory function for FirebaseService objects.
     *
     * Usage:
     *
     * ```TypeScript
     * // Make sure you included the Firebase SDK.
     * import {FirebaseServiceFactory} from 'firebase-angular2/core';
     * var service = FirebaseServiceFactory(Firebase);
     * ```
     *
     * Semantically, using this function is equivalent to the following statements:
     *
     * ```TypeScript
     * // Make sure you included the Firebase SDK.
     * import {FirebaseService} from 'firebase-angular2/core';
     * var firebaseService = new FirebaseService(Firebase);
     * ```
     *
     * @param Firebase
     * @returns {FirebaseService}
     * @constructor
     */
    function FirebaseServiceFactory(Firebase) {
        return new firebase_service_1.FirebaseService(Firebase);
    }
    exports_3("FirebaseServiceFactory", FirebaseServiceFactory);
    return {
        setters:[
            function (firebase_service_1_1) {
                firebase_service_1 = firebase_service_1_1;
            }],
        execute: function() {
        }
    }
});
System.register("node_modules/firebase-angular2/src/firebase.config", ['angular2/core', "node_modules/firebase-angular2/src/firebase.service.factory"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_1, firebase_service_factory_1;
    var FirebaseConfig;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (firebase_service_factory_1_1) {
                firebase_service_factory_1 = firebase_service_factory_1_1;
            }],
        execute: function() {
            /**
             * Defines an object that represents configuration for a FirebaseService.
             */
            FirebaseConfig = (function () {
                /**
                 * Creates a new FirebaseConfig object using the given Firebase URL.
                 * @param url The URL that should be used to connect to Firebase.
                 */
                function FirebaseConfig(url) {
                    this.url = url;
                }
                /**
                 * Creates a new Firebase JavaScript API Object from this configuration.
                 * @returns {Firebase}
                 */
                FirebaseConfig.prototype.createFirebase = function () {
                    return new Firebase(this.url);
                };
                /**
                 * Creates a new Firebase Service using the this configuration.
                 */
                FirebaseConfig.prototype.createService = function () {
                    return firebase_service_factory_1.FirebaseServiceFactory(this.createFirebase());
                };
                FirebaseConfig = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [String])
                ], FirebaseConfig);
                return FirebaseConfig;
            }());
            exports_4("FirebaseConfig", FirebaseConfig);
        }
    }
});
System.register("node_modules/firebase-angular2/src/firebase-utils", ['rxjs/Rx'], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Rx_1;
    var FirebaseUtils;
    return {
        setters:[
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            /**
             * A class that defines utility functions that help Wrap the Firebase JavaScript API.
             */
            FirebaseUtils = (function () {
                function FirebaseUtils() {
                }
                /**
                 * Wraps the given Firebase call in a Promise.
                 * When the async call returns, the Promise resolves with the callback
                 * arguments in an array.
                 * @param obj The object that the given function should be called on. This is typically your Firebase ref instance.
                 * @param fn The function that should be wrapped.
                 * @param args The Arguments that should be given to Firebase.
                 * @returns {Promise<any[]>}
                 */
                FirebaseUtils.wrapFirebaseAsyncCall = function (obj, fn, args) {
                    if (args === void 0) { args = []; }
                    args = args.slice();
                    return new Promise(function (resolve, reject) {
                        args.push(callback);
                        function callback(err) {
                            if (err !== null) {
                                reject(err);
                            }
                            else {
                                resolve(Array.prototype.slice.call(arguments));
                            }
                        }
                        fn.apply(obj, args);
                    });
                };
                /**
                 * Gets an observable that represents the given event name for the internal Firebase instance.
                 * Whenever the event is triggered by the internal Firebase instance, the Observable will resolve with the new data.
                 * This function is useful to map Firebase events to Observables.
                 * When the observable is disposed, the event listener is removed.
                 * @param firebase The Raw Firebase JavaScript API Object.
                 * @param eventName The name of the event that should be listened to.
                 * @returns {Observable<any>}
                 */
                FirebaseUtils.wrapFirebaseEvent = function (firebase, eventName) {
                    return Rx_1.Observable.create(function (observer) {
                        var callback = function () {
                            observer.next(Array.prototype.slice.call(arguments));
                        };
                        firebase.on(eventName, callback, function (err) {
                            observer.error(err);
                        });
                        return function () {
                            firebase.off(eventName, callback);
                        };
                    });
                };
                return FirebaseUtils;
            }());
            exports_5("FirebaseUtils", FirebaseUtils);
        }
    }
});
System.register("node_modules/firebase-angular2/src/firebase-array", ["angular2/core", "node_modules/firebase-angular2/src/firebase.service", "rxjs/Rx"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_2, firebase_service_2, Rx_2;
    var ArrayValue, FirebaseArray;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (firebase_service_2_1) {
                firebase_service_2 = firebase_service_2_1;
            },
            function (Rx_2_1) {
                Rx_2 = Rx_2_1;
            }],
        execute: function() {
            ArrayValue = (function () {
                function ArrayValue() {
                }
                return ArrayValue;
            }());
            // Polyfill Array.find()
            if (!Array.prototype.find) {
                Array.prototype.find = function (predicate) {
                    if (this === null) {
                        throw new TypeError('Array.prototype.find called on null or undefined');
                    }
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }
                    var list = Object(this);
                    var length = list.length >>> 0;
                    var thisArg = arguments[1];
                    var value;
                    for (var i = 0; i < length; i++) {
                        value = list[i];
                        if (predicate.call(thisArg, value, i, list)) {
                            return value;
                        }
                    }
                    return undefined;
                };
            }
            // Polyfill for Array.findIndex()
            if (!Array.prototype.findIndex) {
                Array.prototype.findIndex = function (predicate) {
                    if (this === null) {
                        throw new TypeError('Array.prototype.findIndex called on null or undefined');
                    }
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }
                    var list = Object(this);
                    var length = list.length >>> 0;
                    var thisArg = arguments[1];
                    var value;
                    for (var i = 0; i < length; i++) {
                        value = list[i];
                        if (predicate.call(thisArg, value, i, list)) {
                            return i;
                        }
                    }
                    return -1;
                };
            }
            /**
             * Defines a class that provides capabilities to synchronize ordered lists for a Firebase Object.
             *
             * **Example**:
             *
             * ```TypeScript
             * import {FirebaseService} from 'firebase-angular2/core';
             *
             * // Get the Array
             * var arr = new FirebaseService(
             *    new Firebase('https://YOUR-FIREBASE-URL.firebaseio-demo.com')
             * ).asArray();
             *
             * // Use Array
             * ```
             *
             * **Angular 2 Example**:
             *
             * ```TypeScript
             * // some.component.ts
             * import { Component, OnInit, provide } from 'angular2/core';
             * import { FirebaseArray, FirebaseService, FirebaseServiceFactory } from 'firebase-angular2/core';
             * import { Observable } from 'rxjs/Rx';
             *
             * @@Component({
             *    // FirebaseServiceFactory is not Implemented yet...
             *    selector: 'some-component',
             *
             *    // Make sure to include the async pipe so that the most recent value
             *    // is resolved from the data observable.
             *    template:
             *      'I have {{users.length}} users!' +
             *      '<div *ngFor="#user of (users.observable | async)">' +
             *      '   {{user.name}}' +
             *      '</div>' +
             *      '<h2>Users over 18:</h2>' +
             *      '<div *ngFor="#user of (over18 | async)>' +
             *      ' {{user.name}}' +
             *      '</div>' +,
             *
             *    // Declare the providers that should be used for the service.
             *    providers: [
             *      provide(
             *          FirebaseArray,
             *          {
             *              useValue: new FirebaseService(
             *                  new Firebase('https://YOUR-FIREBASE-URL.firebaseio-demo.com')
             *              ).asArray()
             *          }
             *      )
             *    ]
             * })
             * export class SomeComponent implements OnInit {
             *   private users: FirebaseArray;
             *   private over18: Observable<User>;
             *
             *   constructor(users: FirebaseArray) {
             *      this.users = users;
             *   }
             *
             *   findOver18(): Observable<User> {
             *      this.over18 = this.users.filter(u => u.age > 18);
             *   }
             *
             *   ngOnInit() {
             *      findOver18();
             *   }
             * }
             * ```
             *
             */
            FirebaseArray = (function () {
                /**
                 * Creates a new FirebaseArray using the given FirebaseService.
                 * @param firebaseService
                 */
                function FirebaseArray(firebaseService) {
                    /**
                     * @type {boolean}
                     * @private
                     */
                    this._initialized = false;
                    this._subject = new Rx_2.Subject();
                    this._service = firebaseService;
                    this._list = [];
                    this._init();
                }
                /**
                 * Adds the given data to the end of this array.
                 * Returns a promise that represents the async operation.
                 * @param data The data that should be added to the data structure.
                 * @returns {Promise<boolean>}
                 */
                FirebaseArray.prototype.add = function (data) {
                    if (typeof data === 'undefined' || data === null) {
                        throw new Error('Cannot add nulls to synchronized array as they cannot be reliably tracked. ' +
                            'If you want a "null"-like value, use a special trigger value, such as a custom Unit or Void object.');
                    }
                    return this._service.push(data);
                };
                /**
                 * Removes the child at the given index(a.k.a. key) from this array.
                 * @param index The key of the child that should be removed from the data structure.
                 * @returns {Promise<boolean>}
                 */
                FirebaseArray.prototype.remove = function (index) {
                    if (index === null) {
                        throw new Error('The provided index is invalid. Please make sure that it is in the range of 0 - array.length');
                    }
                    return this._service.remove(index.toString());
                };
                /**
                 * Sets the data stored at the given index (a.k.a. key).
                 * @param index The key of the child whose data should be replaced.
                 * @param data The data that the child should be replaced with.
                 * @returns {Promise<boolean>}
                 */
                FirebaseArray.prototype.set = function (index, data) {
                    if (data.hasOwnProperty('$id')) {
                        delete data.$id;
                    }
                    return this._service.child(index.toString()).set(data);
                };
                /**
                 * Gets an observable that resolves with the index of the given key is found.
                 * @param key
                 * @returns {Observable<number>}
                 */
                FirebaseArray.prototype.indexOfKey = function (key) {
                    return this._subject.map(function (arr) { return FirebaseArray._getPositionFor(key.toString(), arr); }).distinctUntilChanged();
                };
                /**
                 * Gets an observable that resolves whenever the index of the given value is found.
                 * @param val
                 * @param fromIndex
                 * @returns {Observable<number>}
                 */
                FirebaseArray.prototype.indexOf = function (val) {
                    return this.observable.map(function (arr) {
                        return arr.indexOf(val);
                    }).distinctUntilChanged();
                };
                /**
                 * Filters each of the elements in the observed arrays based on whether they match the provided comparison function.
                 * @param callback
                 * @param thisArg
                 */
                FirebaseArray.prototype.filter = function (callback, thisArg) {
                    return this.observable.map(function (arr) {
                        return arr.filter(callback, thisArg);
                    });
                };
                /**
                 * Maps each observed array to a new array that is made up of the results of calling the given callback function.
                 * @param callback
                 * @param thisArg
                 */
                FirebaseArray.prototype.map = function (callback, thisArg) {
                    return this.observable.map(function (arr) { return arr.map(callback, thisArg); });
                };
                /**
                 * Returns an observable that resolves whenever a new value is found in the underlying array.
                 * If the value was removed, or was originally not present in the array, `undefined` is returned.
                 * @param callback The function that is used to determine if a value is "found".
                 * @param thisArg The object that the callback should be called on.
                 * @returns {Observable<any>}
                 */
                FirebaseArray.prototype.find = function (callback, thisArg) {
                    return this.observable.map(function (arr) { return arr.find(callback, thisArg); }).distinctUntilChanged();
                };
                /**
                 * Returns an observable that resolves with the index of the item whenever a new value is found in the underlying array.
                 * If the value was removed, or was originally not present in the array, `-1` is returned.
                 * @param callback The function that is used to determine if a value is "found".
                 * @param thisArg The object that the callback should be called on.
                 * @returns {Observable<any>}
                 */
                FirebaseArray.prototype.findIndex = function (callback, thisArg) {
                    // <any> cast is to get typescript compiler to ignore "incorrect" arguments
                    return this.observable.map(function (arr) { return arr.findIndex(callback, thisArg); }).distinctUntilChanged();
                };
                /**
                 * Registers handlers for notification when this array is updated.
                 * @param onNext
                 * @param onError
                 * @param onComplete
                 * @returns {Subscription<any[]>}
                 */
                FirebaseArray.prototype.subscribe = function (onNext, onError, onComplete) {
                    return this.observable.subscribe(onNext, onError, onComplete);
                };
                Object.defineProperty(FirebaseArray.prototype, "service", {
                    /**
                     * Gets the underlying service for this array.
                     * @returns {FirebaseService}
                     */
                    get: function () {
                        return this._service;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseArray.prototype, "length", {
                    /**
                     * Gets an observable for the length of the array.
                     * @returns {Observable<number>}
                     */
                    get: function () {
                        return this.observable.map(function (a) { return a.length; }).distinctUntilChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseArray.prototype, "array", {
                    /**
                     * Gets the array that is currently stored in this service.
                     * @returns {*[]}
                     */
                    get: function () {
                        return FirebaseArray._mapArrayValues(this._list);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseArray.prototype, "observable", {
                    /**
                     * Gets an observable that notifies whenever the underlying array is updated.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this._subject.map(FirebaseArray._mapArrayValues);
                    },
                    enumerable: true,
                    configurable: true
                });
                FirebaseArray._mapArrayValues = function (arr) {
                    return arr.map(function (v) { return v.value; });
                };
                /**
                 * @private
                 */
                FirebaseArray.prototype._init = function () {
                    if (!this._initialized) {
                        this._subscribeToEvent(this._service.childAddedRaw, this._childAdded.bind(this));
                        this._subscribeToEvent(this._service.childRemovedRaw, this._childRemoved.bind(this));
                        this._subscribeToEvent(this._service.childChangedRaw, this._childChanged.bind(this));
                        this._subscribeToEvent(this._service.childMovedRaw, this._childMoved.bind(this));
                        this._initialized = true;
                    }
                };
                /**
                 * @param observable
                 * @param reciever
                 * @private
                 */
                FirebaseArray.prototype._subscribeToEvent = function (observable, reciever) {
                    observable.subscribe(this._wrap(reciever), this._subject.error.bind(this._subject), this._subject.complete.bind(this._subject));
                };
                /**
                 * @param func
                 * @returns {function(any[]): undefined}
                 * @private
                 */
                FirebaseArray.prototype._wrap = function (func) {
                    return function (args) {
                        var child = args[0];
                        func.apply(void 0, [child.val(), child.key()].concat(args));
                    };
                };
                /**
                 * @param key
                 * @param list
                 * @returns {number}
                 * @private
                 */
                FirebaseArray._getPositionFor = function (key, list) {
                    for (var i = 0; i < list.length; i++) {
                        var v = list[i];
                        if (v.id === key) {
                            return i;
                        }
                    }
                    return -1;
                };
                /**
                 * @param prevChildKey
                 * @param list
                 * @returns {any}
                 * @private
                 */
                FirebaseArray._getPositionAfter = function (prevChildKey, list) {
                    if (prevChildKey === null) {
                        return 0;
                    }
                    else {
                        var i = FirebaseArray._getPositionFor(prevChildKey, list);
                        if (i === -1) {
                            return list.length;
                        }
                        else {
                            return i + 1;
                        }
                    }
                };
                FirebaseArray.prototype._emit = function () {
                    this._subject.next(this._list);
                };
                /**
                 * @param child
                 * @private
                 */
                FirebaseArray.prototype._childAdded = function (val, key, snap, prevChild) {
                    var value = {
                        value: val,
                        id: key
                    };
                    var pos = FirebaseArray._getPositionAfter(prevChild, this._list);
                    this._list.splice(pos, 0, value);
                    this._emit();
                };
                /**
                 *
                 * @param child
                 * @private
                 */
                FirebaseArray.prototype._childRemoved = function (val, key) {
                    var pos = FirebaseArray._getPositionFor(key, this._list);
                    if (pos > -1) {
                        this._list.splice(pos, 1);
                        this._emit();
                    }
                };
                /**
                 * @param child
                 * @private
                 */
                FirebaseArray.prototype._childMoved = function (val, key, snap, prevChildKey) {
                    var pos = FirebaseArray._getPositionFor(key, this._list);
                    if (pos > -1) {
                        var data = this._list.splice(pos, 1)[0];
                        var newPos = FirebaseArray._getPositionAfter(prevChildKey, this._list);
                        this._list.splice(newPos, 0, data);
                        this._emit();
                    }
                };
                /**
                 * @param child
                 * @private
                 */
                FirebaseArray.prototype._childChanged = function (val, key) {
                    var pos = FirebaseArray._getPositionFor(key, this._list);
                    if (pos > -1) {
                        this._list[pos] = {
                            value: val,
                            id: key
                        };
                        this._emit();
                    }
                };
                FirebaseArray = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [firebase_service_2.FirebaseService])
                ], FirebaseArray);
                return FirebaseArray;
            }());
            exports_6("FirebaseArray", FirebaseArray);
        }
    }
});
System.register("node_modules/firebase-angular2/src/firebase.service", ['angular2/core', "node_modules/firebase-angular2/src/firebase-utils", "node_modules/firebase-angular2/src/firebase-array"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var core_3, firebase_utils_1, firebase_array_1;
    var FirebaseService;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (firebase_utils_1_1) {
                firebase_utils_1 = firebase_utils_1_1;
            },
            function (firebase_array_1_1) {
                firebase_array_1 = firebase_array_1_1;
            }],
        execute: function() {
            /**
             * Defines a service that wraps the Firebase Javascript API in a nice, Observable-enabled manner.
             *
             * **Example**:
             *
             * ```TypeScript
             * import {FirebaseService} from 'firebase-angular2/core';
             *
             * // Tell TypeScript that the Firebase SDK has created a global for us
             * declare var Firebase;
             *
             * var firebase = new FirebaseService(
             *    new Firebase('https://YOUR-FIREBASE-URL.firebaseio-demo.com')
             * );
             *
             * // Use Service
             * ```
             *
             * **Angular 2 Example:**
             * ```
             * // some.component.ts
             * import { Component, OnInit, provide } from 'angular2/core';
             * import { FirebaseService, FirebaseServiceFactory } from 'firebase-angular2/core';
             * import { Observable } from 'rxjs/Rx';
             *
             * @@Component({
             *    // FirebaseServiceFactory is not Implemented yet...
             *    selector: 'some-component',
             *
             *    // Make sure to include the async pipe so that the most recent value
             *    // is resolved from the data observable.
             *    template: 'My Data: {{data | async}}',
             *
             *    // Declare the providers that should be used for the service.
             *    providers: [
             *      provide(FirebaseService, { useFactory: FirebaseServiceFactory })
             *    ]
             * })
             * export class SomeComponent implements OnInit {
             *   private firebase: FirebaseService;
             *   data: Observable<any>;
             *
             *   constructor(firebase: FirebaseService) {
             *      this.firebase = firebase;
             *   }
             *
             *   observeData() {
             *      this.data = this.firebase.data;
             *   }
             *
             *   ngOnInit() {
             *      this.observeData();
             *   }
             * }
             * ```
             */
            FirebaseService = (function () {
                /**
                 * Creates a new FirebaseService using the given Firebase JavaScript API Object.
                 * @param firebase The Object that represents the instantiated Firebase JavaScript API Object.
                 */
                function FirebaseService(firebase) {
                    this._firebase = firebase;
                }
                Object.defineProperty(FirebaseService.prototype, "firebase", {
                    /**
                     * Gets the internal Firebase Instance.
                     * @returns {Firebase}
                     */
                    get: function () {
                        return this._firebase;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Wraps the given Firebase event type as an observable.
                 * @param eventType {string} One of the following strings: "value", "child_added", "child_changed", "child_removed", or "child_moved."
                 */
                FirebaseService.prototype.wrapFirebaseEvent = function (eventType) {
                    return firebase_utils_1.FirebaseUtils.wrapFirebaseEvent(this.firebase, eventType);
                };
                /**
                 * Retrieves an observable that wraps the given event from the Firebase API.
                 * @param eventType {string} One of the following strings: "value", "child_added", "child_changed", "child_removed", or "child_moved."
                 * @returns {Observable<FirebaseDataSnapshot>} An object that represents the asynchronous stream of events.
                 */
                FirebaseService.prototype.on = function (eventType) {
                    return this.wrapFirebaseEvent(eventType);
                };
                Object.defineProperty(FirebaseService.prototype, "valueRaw", {
                    /**
                     * Gets the raw event stream for the 'value' event from the underlying Firebase Object.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.wrapFirebaseEvent('value');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "value", {
                    /**
                     * Gets an observable that resolves with the value in this Firebase location and whenever the data is updated.
                     * Internally, this maps to the 'value' event emitted by Firebase.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.valueRaw.map(function (data) { return data[0].val(); });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "dataRaw", {
                    /**
                     * Alias for .valueRaw.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.valueRaw;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "data", {
                    /**
                     * Gets an observable that resolves with the data in this Firebase location and whenever the data is updated.
                     * Semantically the same as calling .value.
                     * Internally, this maps to the 'value' event emitted by Firebase.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "childAddedRaw", {
                    /**
                     * Gets the raw event stream for the 'child_added' event from the underlying Firebase Object.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.wrapFirebaseEvent('child_added');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "childAdded", {
                    /**
                     * Gets an observable that resolves whenever a child is added to this Firebase location.
                     * Internally, this maps to the 'child_added' event emitted by Firebase.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.childAddedRaw.map(function (data) { return data[0].val(); });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "childChangedRaw", {
                    /**
                     * Gets the raw event stream for the 'child_changed' event from the underlying Firebase Object.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.wrapFirebaseEvent('child_changed');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "childChanged", {
                    /**
                     * Gets an observable that resolves whenever the data of a child in this Firebase location is modified.
                     * Internally, this maps to the 'child_changed' event emitted by Firebase.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.childChangedRaw.map(function (data) { return data[0].val(); });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "childRemovedRaw", {
                    /**
                     * Gets the raw event stream for the 'child_removed' event from the underlying Firebase Object.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.wrapFirebaseEvent('child_removed');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "childRemoved", {
                    /**
                     * Gets an observable that resolves whenever a child is removed from this Firebase location.
                     * Internally, this maps to the 'child_removed' event emitted by Firebase.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.childRemovedRaw.map(function (data) { return data[0].val(); });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "childMoved", {
                    /**
                     * Gets an observable that resolves whenever a child is moved in this Firebase location.
                     * Internally, this maps to the 'child_moved' event emitted by Firebase.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.childMovedRaw.map(function (data) { return data[0].val(); });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseService.prototype, "childMovedRaw", {
                    /**
                     * Gets the raw event stream for the 'child_moved' event from the underlying Firebase Object.
                     * @returns {Observable<any>}
                     */
                    get: function () {
                        return this.wrapFirebaseEvent('child_moved');
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Sets the data exact data that this Firebase location should contain and
                 * returns an observable that represents the operation.
                 * @param data The data that should be set to this location.
                 * @returns {Promise<boolean>} Returns a promise that resolves `true` if the data was set. Otherwise the promise rejects if there was an error.
                 */
                FirebaseService.prototype.setData = function (data) {
                    return firebase_utils_1.FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.set, [data]).then(function () { return true; });
                };
                /**
                 * @alias setData(data)
                 */
                FirebaseService.prototype.set = function (data) {
                    return this.setData(data);
                };
                /**
                 * Adds the given data to this Firebase location.
                 * @param data The data that should be added.
                 * @returns {Promise<boolean>}
                 */
                FirebaseService.prototype.push = function (data) {
                    return firebase_utils_1.FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.push, [data]).then(function () { return true; });
                };
                /**
                 * Removes the child with the given key from this location.
                 * If a key is not provided, then this location will be removed from it's parent location.
                 * @param key The key of the child that should be removed from this location.
                 * @returns {Promise<boolean>}
                 */
                FirebaseService.prototype.remove = function (key) {
                    var firebase = this.firebase;
                    if (key) {
                        firebase = firebase.child(key);
                    }
                    return firebase_utils_1.FirebaseUtils.wrapFirebaseAsyncCall(firebase, this.firebase.remove, []).then(function () { return true; });
                };
                /**
                 * Wraps this FirebaseService in a new FirebaseArray object.
                 * The FirebaseArray service provides functionality for dealing with synchronized order lists of objects.
                 * @returns {FirebaseArray}
                 */
                FirebaseService.prototype.asArray = function () {
                    return new firebase_array_1.FirebaseArray(this);
                };
                /**
                 * Gets a child Firebase service that represents the data at the given path.
                 * @param path The relative path from this Firebase location to the requested location.
                 * @returns {FirebaseService}
                 */
                FirebaseService.prototype.child = function (path) {
                    return new FirebaseService(this.firebase.child(path));
                };
                FirebaseService = __decorate([
                    core_3.Injectable(), 
                    __metadata('design:paramtypes', [Object])
                ], FirebaseService);
                return FirebaseService;
            }());
            exports_7("FirebaseService", FirebaseService);
        }
    }
});
System.register("node_modules/firebase-angular2/src/firebase-auth.service", ['angular2/core', "node_modules/firebase-angular2/src/firebase.service", "node_modules/firebase-angular2/src/firebase-utils"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var core_4, firebase_service_3, firebase_utils_2;
    var FirebaseAuthService;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (firebase_service_3_1) {
                firebase_service_3 = firebase_service_3_1;
            },
            function (firebase_utils_2_1) {
                firebase_utils_2 = firebase_utils_2_1;
            }],
        execute: function() {
            /**
             * Defines a Firebase Service that provides Auth & Auth features.
             */
            FirebaseAuthService = (function () {
                /**
                 * Initializes a new FirebaseAuthService using the given FirebaseService.
                 * @param firebase
                 */
                function FirebaseAuthService(firebase) {
                    this._firebase = firebase;
                }
                Object.defineProperty(FirebaseAuthService.prototype, "service", {
                    /**
                     * Gets the FirebaseService that this Auth service is using.
                     * @returns {FirebaseService}
                     */
                    get: function () {
                        return this._firebase;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FirebaseAuthService.prototype, "firebase", {
                    /**
                     * Gets the internal Firebase JavaScript API Service.
                     * @returns {Firebase}
                     */
                    get: function () {
                        return this.service.firebase;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Authenticates the Firebase client using email & password credentials.
                 * This will start a session that is connected to the FirebaseService.
                 * @param credentials
                 */
                FirebaseAuthService.prototype.authWithPassword = function (credentials) {
                    return firebase_utils_2.FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.authWithPassword, [credentials])
                        .then(function (args) { return args[1]; });
                };
                FirebaseAuthService = __decorate([
                    core_4.Injectable(), 
                    __metadata('design:paramtypes', [firebase_service_3.FirebaseService])
                ], FirebaseAuthService);
                return FirebaseAuthService;
            }());
            exports_8("FirebaseAuthService", FirebaseAuthService);
        }
    }
});
System.register("node_modules/firebase-angular2/src/firebase.service.provider", ['angular2/core', "node_modules/firebase-angular2/src/firebase.service", "node_modules/firebase-angular2/src/firebase.service.factory"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var core_5, firebase_service_4, firebase_service_factory_2;
    var FirebaseServiceProvider;
    return {
        setters:[
            function (core_5_1) {
                core_5 = core_5_1;
            },
            function (firebase_service_4_1) {
                firebase_service_4 = firebase_service_4_1;
            },
            function (firebase_service_factory_2_1) {
                firebase_service_factory_2 = firebase_service_factory_2_1;
            }],
        execute: function() {
            /**
             * Gets the default Provider for FirebaseService services.
             * Semantically, using this variable is equivalent to the following statements:
             *
             * ```TypeScript
             * import {FirebaseService, FirebaseServiceFactory} from 'firebase-angular2/core';
             * var provider = provide(FirebaseService, {useFactory: FirebaseServiceFactory})
             * ```
             *
             * @type {Provider}
             */
            exports_9("FirebaseServiceProvider", FirebaseServiceProvider = core_5.provide(firebase_service_4.FirebaseService, {
                useFactory: firebase_service_factory_2.FirebaseServiceFactory,
                deps: ['Firebase']
            }));
        }
    }
});
System.register("node_modules/firebase-angular2/src/firebase.provider", ['angular2/core'], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var core_6;
    var FirebaseProvider;
    return {
        setters:[
            function (core_6_1) {
                core_6 = core_6_1;
            }],
        execute: function() {
            if (typeof Firebase === 'undefined') {
                console.warn('"Firebase" is either not defined or is null. Please make sure that you are including the Firebase SDK script before loading this or related angular2-firebase scripts.');
            }
            /**
             * Declares a basic provider for the Global Firebase API object that is loaded by the Firebase JavaScript SDK.
             *
             * Usage:
             *
             * ```TypeScript
             * import {FirebaseProvider} from 'firebase-angular2/core';
             *
             * // Later in the application when you are declaring the providers...
             *
             * bootstrap(MyAppComponent, [FirebaseProvider, MyOtherProvider]);
             * ```
             *
             * @type {Provider}
             */
            exports_10("FirebaseProvider", FirebaseProvider = core_6.provide('Firebase', {
                useFactory: function () {
                    if (Firebase === undefined || Firebase === null) {
                        console.error('"Firebase" is either not defined or is null. Please make sure that you are including the Firebase SDK script before loading this or related angular2-firebase scripts.');
                    }
                    return Firebase;
                }
            }));
        }
    }
});
System.register("node_modules/firebase-angular2/core", ["node_modules/firebase-angular2/src/firebase.service", "node_modules/firebase-angular2/src/firebase-utils", "node_modules/firebase-angular2/src/firebase-auth.service", "node_modules/firebase-angular2/src/firebase.config", "node_modules/firebase-angular2/src/firebase.service.provider", "node_modules/firebase-angular2/src/firebase.service.factory", "node_modules/firebase-angular2/src/firebase.provider", "node_modules/firebase-angular2/src/firebase-array"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_11(exports);
    }
    return {
        setters:[
            function (firebase_service_5_1) {
                exportStar_1(firebase_service_5_1);
            },
            function (firebase_utils_3_1) {
                exportStar_1(firebase_utils_3_1);
            },
            function (firebase_auth_service_1_1) {
                exportStar_1(firebase_auth_service_1_1);
            },
            function (firebase_config_1_1) {
                exportStar_1(firebase_config_1_1);
            },
            function (firebase_service_provider_1_1) {
                exportStar_1(firebase_service_provider_1_1);
            },
            function (firebase_service_factory_3_1) {
                exportStar_1(firebase_service_factory_3_1);
            },
            function (firebase_provider_1_1) {
                exportStar_1(firebase_provider_1_1);
            },
            function (firebase_array_2_1) {
                exportStar_1(firebase_array_2_1);
            }],
        execute: function() {
        }
    }
});
System.register("app/hero.service", ['angular2/core', "app/constants"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var core_7, constants_1;
    var HeroService;
    return {
        setters:[
            function (core_7_1) {
                core_7 = core_7_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            }],
        execute: function() {
            // Don't forget the parentheses! Neglecting them leads to an error that's difficult to diagnose.
            HeroService = (function () {
                function HeroService() {
                }
                HeroService.prototype.getHeroes = function () {
                    var heroes = [];
                    var heroesPromise = new Promise(function (resolve, reject) {
                        constants_1.FIREBASE_REF.on('value', function (snapshot) {
                            var heroesRef = snapshot.val();
                            for (var hero in heroesRef) {
                                heroes.push(heroesRef[hero]);
                            }
                            if (heroes.length >= 0) {
                                resolve(heroes);
                            }
                            else {
                                reject(heroes);
                            }
                        }, function (error) {
                            reject(error);
                        });
                    });
                    return heroesPromise;
                };
                // getHeroesSlowly() {
                //     return new Promise<Hero[]>(resolve =>
                //         setTimeout(() => resolve(HEROES), 2000) // 2 seconds
                //     );
                // }
                /* Get one specific hero by id */
                HeroService.prototype.getHero = function (id) {
                    return Promise.resolve(this.getHeroes()).then(function (heroes) { return heroes.filter(function (hero) { return hero.id === id; })[0]; });
                };
                HeroService = __decorate([
                    core_7.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], HeroService);
                return HeroService;
            }());
            exports_12("HeroService", HeroService);
        }
    }
});
System.register("app/hero-detail.component", ['angular2/core', 'angular2/router', "app/hero.service", "app/constants"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var core_8, router_1, hero_service_1, constants_2;
    var HeroDetailComponent;
    return {
        setters:[
            function (core_8_1) {
                core_8 = core_8_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (hero_service_1_1) {
                hero_service_1 = hero_service_1_1;
            },
            function (constants_2_1) {
                constants_2 = constants_2_1;
            }],
        execute: function() {
            HeroDetailComponent = (function () {
                function HeroDetailComponent(_heroService, _routeParams) {
                    this._heroService = _heroService;
                    this._routeParams = _routeParams;
                    this.timer = 0;
                }
                HeroDetailComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    // the + operator converts the string into a number
                    this.id = +this._routeParams.get('id');
                    this._heroService.getHero(this.id)
                        .then(function (hero) { return _this.hero = hero; });
                };
                HeroDetailComponent.prototype.goBack = function () {
                    window.history.back();
                };
                // save changes in input with delay (defer on typing)
                HeroDetailComponent.prototype.delayUpdate = function (newValue) {
                    var firebaseHeroRef = new Firebase(constants_2.FIREBASE_URL + this.id);
                    firebaseHeroRef.update({ id: this.id, name: newValue });
                };
                HeroDetailComponent.prototype.onKey = function (event) {
                    var _this = this;
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function () { return _this.delayUpdate(event.target.value); }, 300);
                };
                HeroDetailComponent = __decorate([
                    core_8.Component({
                        selector: 'my-hero-detail',
                        templateUrl: 'app/hero-detail.component.html',
                        styleUrls: ['app/hero-detail.component.css']
                    }), 
                    __metadata('design:paramtypes', [hero_service_1.HeroService, router_1.RouteParams])
                ], HeroDetailComponent);
                return HeroDetailComponent;
            }());
            exports_13("HeroDetailComponent", HeroDetailComponent);
        }
    }
});
System.register("app/heroes.component", ['angular2/core', 'angular2/router', "app/hero-detail.component", "app/hero.service"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var core_9, router_2, hero_detail_component_1, hero_service_2;
    var HeroesComponent;
    return {
        setters:[
            function (core_9_1) {
                core_9 = core_9_1;
            },
            function (router_2_1) {
                router_2 = router_2_1;
            },
            function (hero_detail_component_1_1) {
                hero_detail_component_1 = hero_detail_component_1_1;
            },
            function (hero_service_2_1) {
                hero_service_2 = hero_service_2_1;
            }],
        execute: function() {
            HeroesComponent = (function () {
                function HeroesComponent(_router, _heroService) {
                    this._router = _router;
                    this._heroService = _heroService;
                }
                ;
                HeroesComponent.prototype.getHeroes = function () {
                    var _this = this;
                    // use the getHeroesSlowly() method to see how the promise works
                    this._heroService.getHeroes().then(function (heroes) { return _this.heroes = heroes; });
                };
                // init the component with data from somewhere (like a server)
                HeroesComponent.prototype.ngOnInit = function () {
                    this.getHeroes();
                };
                HeroesComponent.prototype.onSelect = function (hero) {
                    this.selectedHero = hero;
                };
                ;
                HeroesComponent.prototype.gotoDetail = function () {
                    this._router.navigate(['HeroDetail', { id: this.selectedHero.id }]);
                };
                HeroesComponent = __decorate([
                    core_9.Component({
                        // The selector specifies a simple CSS selector for an HTML element that represents the component.
                        selector: 'my-heroes',
                        // The template specifies the component's companion template,
                        // written in an enhanced form of HTML that tells Angular how to render this component's view.
                        // !Must specify the path all the way back to the application root.
                        templateUrl: 'app/heroes.component.html',
                        // these styles are only applied to this component. No other component
                        // will get these css rules -> They are hidden in the ShadowDOM
                        // !Must specify the path all the way back to the application root.
                        styleUrls: ['app/heroes.component.css'],
                        directives: [hero_detail_component_1.HeroDetailComponent]
                    }), 
                    __metadata('design:paramtypes', [router_2.Router, hero_service_2.HeroService])
                ], HeroesComponent);
                return HeroesComponent;
            }());
            exports_14("HeroesComponent", HeroesComponent);
        }
    }
});
System.register("app/dashboard.component", ['angular2/core', 'angular2/router', "app/hero.service"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var core_10, router_3, hero_service_3;
    var DashboardComponent;
    return {
        setters:[
            function (core_10_1) {
                core_10 = core_10_1;
            },
            function (router_3_1) {
                router_3 = router_3_1;
            },
            function (hero_service_3_1) {
                hero_service_3 = hero_service_3_1;
            }],
        execute: function() {
            DashboardComponent = (function () {
                function DashboardComponent(_router, _heroService) {
                    this._router = _router;
                    this._heroService = _heroService;
                    this.heroes = [];
                }
                /* Set needed variables while initiating to prevent errors
                * ngOnInit is called right after the directive's data-bound properties
                *  have been checked for the first time, and before any of its children have been checked.
                *  It is invoked only once when the directive is instantiated.
                */
                DashboardComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    // show loading info till heroes are fetched from server
                    this.heroes = [{ id: -1, name: 'Loading...' }];
                    this._heroService.getHeroes()
                        .then(function (heroes) { return _this.heroes = heroes.slice(1, 5); });
                    // this function represents the same then the line above.
                    // But without the fat-arrow the 'this' context is bound to the function block (so self would be needed)
                    // .then(function(heroes:Hero[]) {
                    //     console.log(heroes);
                    //     return this.heroes = heroes.slice(1,5);
                    // });
                };
                DashboardComponent.prototype.gotoDetail = function (hero) {
                    var link = ['HeroDetail', { id: hero.id }];
                    this._router.navigate(link);
                };
                DashboardComponent = __decorate([
                    core_10.Component({
                        selector: 'my-dashboard',
                        templateUrl: 'app/dashboard.component.html',
                        styleUrls: ['app/dashboard.component.css']
                    }), 
                    __metadata('design:paramtypes', [router_3.Router, hero_service_3.HeroService])
                ], DashboardComponent);
                return DashboardComponent;
            }());
            exports_15("DashboardComponent", DashboardComponent);
        }
    }
});
System.register("app/app.component", ['angular2/core', 'angular2/router', "app/hero.service", "app/heroes.component", "app/dashboard.component", "app/hero-detail.component"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var core_11, router_4, hero_service_4, heroes_component_1, dashboard_component_1, hero_detail_component_2;
    var AppComponent;
    return {
        setters:[
            function (core_11_1) {
                core_11 = core_11_1;
            },
            function (router_4_1) {
                router_4 = router_4_1;
            },
            function (hero_service_4_1) {
                hero_service_4 = hero_service_4_1;
            },
            function (heroes_component_1_1) {
                heroes_component_1 = heroes_component_1_1;
            },
            function (dashboard_component_1_1) {
                dashboard_component_1 = dashboard_component_1_1;
            },
            function (hero_detail_component_2_1) {
                hero_detail_component_2 = hero_detail_component_2_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.title = 'Tour of Heroes';
                }
                AppComponent = __decorate([
                    core_11.Component({
                        selector: 'my-app',
                        template: "\n                <h1>{{title}}</h1>\n                <nav>\n                    <a [routerLink]=\"['Dashboard']\">Dashboard</a>\n                    <a [routerLink]=\"['Heroes']\">Heroes</a>\n                </nav>\n                <router-outlet></router-outlet>\n    ",
                        styleUrls: ['app/app.component.css'],
                        directives: [router_4.ROUTER_DIRECTIVES],
                        providers: [hero_service_4.HeroService, router_4.ROUTER_PROVIDERS]
                    }),
                    router_4.RouteConfig([
                        {
                            path: '/heroes',
                            name: 'Heroes',
                            component: heroes_component_1.HeroesComponent
                        },
                        {
                            path: '/dashboard',
                            name: 'Dashboard',
                            component: dashboard_component_1.DashboardComponent,
                            // the browser launches with / when starting. 
                            // useAsDefault sets the specific route as start route
                            useAsDefault: true
                        },
                        {
                            // the colon (:) in front of id means that id is a variable
                            path: '/detail/:id',
                            name: 'HeroDetail',
                            component: hero_detail_component_2.HeroDetailComponent
                        }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_16("AppComponent", AppComponent);
            ;
        }
    }
});
// App bootstrapping is a separate concern from presenting a view.
// We might launch the AppComponent in multiple environments with different bootstrappers. 
// Testing the component is much easier if it doesn't also try to run the entire application. 
// Let's make the small extra effort to do it the right way.
System.register("app/boot", ['angular2/platform/browser', "app/app.component"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var browser_1, app_component_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, []);
        }
    }
});
//# sourceMappingURL=app.js.map