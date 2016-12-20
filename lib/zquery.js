/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(2);

	let funcsToBeCalled = [];
	const addFuncToQueue = (arg) => {
	  funcsToBeCalled.push(arg);
	};

	const $l = (arg) => {
	  if (typeof(arg) === "string") {
	    let elements = Array.from(document.querySelectorAll(arg));
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

	$l.extend = function (base, ...otherObjs) {
	  otherObjs.forEach( obj => {
	    for(let prop in obj){
	      base[prop] = obj[prop];
	    }
	  });
	  return base;
	};

	$l.ajax = function (options) {
	  const defaults = {
	    method: "GET",
	    success: () => {},
	    error: () => {},
	    data: {},
	    url: "",
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	  };
	  options = $l.extend(defaults, options);

	  const request = new XMLHttpRequest();
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
	};

	document.addEventListener("DOMContentLoaded", () => {
	  funcsToBeCalled.forEach((func) => {
	    func();
	  });

	  funcsToBeCalled = null;
	});

	window.$l = $l;


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(nodes) {
	    this.nodes = nodes;
	  }

	  each(cb) {
	    this.nodes.forEach(cb);
	  }

	  html(string) {
	    if (string === undefined) {
	      return this.each[0].innerHTML;
	    } else {
	      this.each(node => node.innerHTML = string);
	    }
	  }

	  empty() {
	    this.html("");
	  }

	  append(content) {
	    let addition = "";
	    if (typeof(content) === "string") {
	      addition = content;
	    } else if (content instanceof HTMLElement) {
	      addition = content.outerHTML;
	    } else if (content instanceof DOMNodeCollection) {
	      content.forEach(el => addition += el.outerHTML);
	    }
	    this.each(node => node.innerHTML += addition);
	  }

	  attr(attrName, value) {
	    if (value === undefined) {
	      return this.each[0].getAttribute(attrName);
	    } else {
	      this.each(node => node.setAttribute(attrName, value));
	    }
	  }

	  addClass(className) {
	    this.each(node => node.classList.add(className));
	  }

	  removeClass(className) {
	    this.each(node => node.classList.remove(className));
	  }

	  children() {
	    let childNodes = [];
	    this.each(node => {
	      childNodes = childNodes.concat(Array.from(node.children));
	    });
	    return new DOMNodeCollection(childNodes);
	  }

	  parent() {
	    let parentNodes = [];
	    this.each(node => {
	      parentNodes.push(node.parentNode);
	    });
	    return new DOMNodeCollection(parentNodes);
	  }

	  find(selector) {
	    let foundNodes = [];
	    this.each(node => {
	      const nodeList = node.querySelectorAll(selector);
	      foundNodes = foundNodes.concat(Array.from(nodeList));
	    });
	    return new DOMNodeCollection(foundNodes);
	  }

	  remove() {
	    this.each(node => node.parentNode.removeChild(node));
	  }

	  on(eventName, callback ) {
	    this.each(node => {
	      node.addEventListener(eventName, callback);
	      const eventKey = `jqliteEvents-${eventName}`;
	      if (typeof node[eventKey] === "undefined") {
	        node[eventKey] = [];
	      }
	      node[eventKey].push(callback);
	    });
	  }

	  off(eventName) {
	  this.each(node => {
	    const eventKey = `jqliteEvents-${eventName}`;
	    if (node[eventKey]) {
	      node[eventKey].forEach(callback => {
	        node.removeEventListener(eventName, callback);
	      });
	    }
	    node[eventKey] = [];
	    });
	  }
	}

	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);