/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.htm":
/*!***********************!*\
  !*** ./src/index.htm ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "index.htm";

/***/ }),

/***/ "./src/js/dog.ts":
/*!***********************!*\
  !*** ./src/js/dog.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Dog = /** @class */ (function () {
    function Dog(id, img) {
        this.Id = id;
        this.Img = img;
    }
    return Dog;
}());
/* harmony default export */ __webpack_exports__["default"] = (Dog);


/***/ }),

/***/ "./src/js/index.ts":
/*!*************************!*\
  !*** ./src/js/index.ts ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dog */ "./src/js/dog.ts");
new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        dogs: [],
        methodType: "",
        showing: false,
        sayHello: "Say hello"
    },
    methods: {
        show: function () {
            if (this.methodType == "frejaMode") {
                this.showing = false;
                if (this.dogs.length == generateDogs().length) {
                    this.dogs = [];
                }
                this.dogs.push(generateDog(this.dogs));
            }
            else if (this.methodType == "frejaMode2") {
                this.showing = false;
                this.dogs = [];
                this.dogs.push(generateDog(this.dogs));
            }
            else if (!this.showing) {
                // generateDogs().forEach(element => {
                //     this.dogs.push({id: element.Id, img: element.Img})
                // })
                this.dogs = generateDogs();
                this.showing = true;
                this.sayHello = "Say bye"; //Maybe make whole text and show/hide
            }
            else {
                this.dogs = [];
                this.showing = false;
                this.sayHello = "Say hello";
            }
        }
    }
});

function generateDogs() {
    var dogArray;
    dogArray = [];
    for (var _i = 0; _i < 81; _i++) {
        dogArray.push(new _dog__WEBPACK_IMPORTED_MODULE_0__["default"](_i, ('/HundePictures/' + (_i + 1).toString() + '.jpg')));
    }
    return dogArray;
}
function generateDog(dogs) {
    var allDogs = generateDogs();
    dogs.forEach(function (element) {
        allDogs = allDogs.filter(function (item) { return item != element; });
    });
    if (allDogs.length != 0) {
        return allDogs[getRandomInt(allDogs.length)];
    }
    return new _dog__WEBPACK_IMPORTED_MODULE_0__["default"](-1, "");
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


/***/ }),

/***/ "./src/scss/styles.scss":
/*!******************************!*\
  !*** ./src/scss/styles.scss ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bundle.css";

/***/ }),

/***/ 0:
/*!**************************************************************************************!*\
  !*** multi ./src/index.htm ./src/scss/styles.scss ./src/js/index.ts ./src/js/dog.ts ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./src/index.htm */"./src/index.htm");
__webpack_require__(/*! ./src/scss/styles.scss */"./src/scss/styles.scss");
__webpack_require__(/*! ./src/js/index.ts */"./src/js/index.ts");
module.exports = __webpack_require__(/*! ./src/js/dog.ts */"./src/js/dog.ts");


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map