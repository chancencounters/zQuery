/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var DOMNodeCollection = __webpack_require__(1);
	
	var funcsToBeCalled = [];
	var addFuncToQueue = function addFuncToQueue(arg) {
	  funcsToBeCalled.push(arg);
	};
	
	var $z = function $z(arg) {
	  if (typeof arg === "string") {
	    var elements = Array.from(document.querySelectorAll(arg));
	    return new DOMNodeCollection(elements);
	  } else if (arg instanceof HTMLElement) {
	    return new DOMNodeCollection(Array.from(arg));
	  } else if (arg instanceof Function) {
	    if (document.readyState === "complete") {
	      arg();
	    } else {
	      addFuncToQueue(arg);
	    }
	  }
	};
	
	$z.extend = function (base) {
	  for (var _len = arguments.length, otherObjs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    otherObjs[_key - 1] = arguments[_key];
	  }
	
	  otherObjs.forEach(function (obj) {
	    for (var prop in obj) {
	      base[prop] = obj[prop];
	    }
	  });
	  return base;
	};
	
	$z.ajax = function (options) {
	  return new Promise(function (success, error) {
	    var defaults = {
	      method: "GET",
	      success: function success() {},
	      error: function error() {},
	      data: {},
	      url: "",
	      contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
	    };
	
	    options = $z.extend(defaults, options);
	
	    var request = new XMLHttpRequest();
	    request.open(options.method, options.url, true);
	    request.responseType = 'json';
	
	    request.onload = function () {
	      if (request.status === 200) {
	        options.success(request.response);
	      } else {
	        options.error(request.response);
	      }
	    };
	    request.send(JSON.stringify(options.data));
	  });
	};
	
	document.addEventListener("DOMContentLoaded", function () {
	  funcsToBeCalled.forEach(function (func) {
	    func();
	  });
	
	  funcsToBeCalled = null;
	});
	
	window.$z = $z;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DOMNodeCollection = function () {
	  function DOMNodeCollection(nodes) {
	    _classCallCheck(this, DOMNodeCollection);
	
	    this.nodes = nodes;
	  }
	
	  _createClass(DOMNodeCollection, [{
	    key: "each",
	    value: function each(cb) {
	      this.nodes.forEach(cb);
	    }
	  }, {
	    key: "html",
	    value: function html(string) {
	      if (string === undefined) {
	        return this.each[0].innerHTML;
	      } else {
	        this.each(function (node) {
	          return node.innerHTML = string;
	        });
	      }
	    }
	  }, {
	    key: "empty",
	    value: function empty() {
	      this.html("");
	    }
	  }, {
	    key: "css",
	    value: function css(attrName, value) {
	      if (attrName === "background-image") {
	        this.each(function (node) {
	          return node.style.backgroundImage = value;
	        });
	      };
	    }
	  }, {
	    key: "append",
	    value: function append(content) {
	      var addition = "";
	      if (typeof content === "string") {
	        addition = content;
	      } else if (content instanceof HTMLElement) {
	        addition = content.outerHTML;
	      } else if (content instanceof DOMNodeCollection) {
	        content.forEach(function (el) {
	          return addition += el.outerHTML;
	        });
	      }
	      this.each(function (node) {
	        return node.innerHTML += addition;
	      });
	    }
	  }, {
	    key: "attr",
	    value: function attr(attrName, value) {
	      if (value === undefined) {
	        return this.each[0].getAttribute(attrName);
	      } else {
	        this.each(function (node) {
	          return node.setAttribute(attrName, value);
	        });
	      }
	    }
	  }, {
	    key: "addClass",
	    value: function addClass(className) {
	      this.each(function (node) {
	        return node.classList.add(className);
	      });
	    }
	  }, {
	    key: "removeClass",
	    value: function removeClass(className) {
	      this.each(function (node) {
	        return node.classList.remove(className);
	      });
	    }
	  }, {
	    key: "children",
	    value: function children() {
	      var childNodes = [];
	      this.each(function (node) {
	        childNodes = childNodes.concat(Array.from(node.children));
	      });
	      return new DOMNodeCollection(childNodes);
	    }
	  }, {
	    key: "parent",
	    value: function parent() {
	      var parentNodes = [];
	      this.each(function (node) {
	        parentNodes.push(node.parentNode);
	      });
	      return new DOMNodeCollection(parentNodes);
	    }
	  }, {
	    key: "find",
	    value: function find(selector) {
	      var foundNodes = [];
	      this.each(function (node) {
	        var nodeList = node.querySelectorAll(selector);
	        foundNodes = foundNodes.concat(Array.from(nodeList));
	      });
	      return new DOMNodeCollection(foundNodes);
	    }
	  }, {
	    key: "remove",
	    value: function remove() {
	      this.each(function (node) {
	        return node.parentNode.removeChild(node);
	      });
	    }
	  }, {
	    key: "on",
	    value: function on(type, listener) {
	      this.nodes.forEach(function (el) {
	        el.addEventListener(type, listener);
	        var eventKey = "eventKey-" + type;
	        if (typeof el[eventKey] === "undefined") {
	          el[eventKey] = [];
	        }
	        el[eventKey].push(listener);
	      });
	    }
	  }, {
	    key: "off",
	    value: function off(type) {
	      this.nodes.forEach(function (el) {
	        var eventKey = "eventKey-" + type;
	        if (el[eventKey]) {
	          el[eventKey].forEach(function (listener) {
	            el.removeEventListener(type, listener);
	          });
	        }
	        el[eventKey] = [];
	      });
	    }
	  }]);
	
	  return DOMNodeCollection;
	}();
	
	module.exports = DOMNodeCollection;

/***/ }
/******/ ]);
//# sourceMappingURL=zquery.js.map