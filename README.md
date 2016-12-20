= zQuery -- Lightweight JavaScript Library

zQuery is a fast and lightweight javascript library that makes things like HTML document traversal and manipulation, event handling and Ajax much easier.

Some examples:

* DOM Manipulation through methods like attr() allows you to get the value of an attribute for the first element in the set of matched elements or set an attribute for every matched element.

  attr(attrName, value) {
    if (value === undefined) {
      return this.each[0].getAttribute(attrName);
    } else {
      this.each(node => node.setAttribute(attrName, value));
    }
  }

* DOM Traversal through methods like find, which gets the descendants of each element in the current set of matched elements filtered by a selector, DOMNodeCollection object or element.

  find(selector) {
    let foundNodes = [];
    this.each(node => {
      const nodeList = node.querySelectorAll(selector);
      foundNodes = foundNodes.concat(Array.from(nodeList));
    });
    return new DOMNodeCollection(foundNodes);
  }

* Perform asynchronous HTTP (AJAX) requests.

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

* Attach an event handler function for an event to the selected elements.

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
