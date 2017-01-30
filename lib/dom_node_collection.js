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
      const eventKey = `${eventName}`;
      if (typeof node[eventKey] === "undefined") {
        node[eventKey] = [];
      }
      node[eventKey].push(callback);
    });
  }

  off(eventName) {
  this.each(node => {
    const eventKey = `${eventName}`;
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
