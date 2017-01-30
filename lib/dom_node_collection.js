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

  css(attrName, value) {
    if (attrName === "background-image") {
      this.each(node => node.style.backgroundImage = value);
    };
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

  on(type, listener) {
    this.nodes.forEach( (el) => {
      el.addEventListener(type, listener);
      const eventKey = `eventKey-${type}`;
      if (typeof el[eventKey] === "undefined") {
       el[eventKey] = [];
    }
    el[eventKey].push(listener);
  });
 }

  off(type) {
    this.nodes.forEach( (el) => {
      const eventKey = `eventKey-${type}`;
      if(el[eventKey]) {
        el[eventKey].forEach( (listener) => {
          el.removeEventListener(type, listener);
        });
      }
    el[eventKey] = [];
    });
  }
}

module.exports = DOMNodeCollection;
