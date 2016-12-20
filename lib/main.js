const DOMNodeCollection = require('./dom_node_collection.js');

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
