const EOF = Symbol("EOF"); // EOF: End Of File

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    return;
  } else {
    return data;
  }
}

function tagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else if (c === "/") {
    return endTagOpen;
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c === ">") {
    // console.log(c);
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else {
    return;
  }
}

function tagName(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    // 匹配字母代表为标签名
    return tagName;
  } else if (c.match(/^[\t\n\t ]$/)) {
    // 匹配空格代表属性
    return beforeAttributeName;
  } else if (c === "/") {
    // 代表标签结束
    return selfClosingStartTag;
  } else if (c === ">") {
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c === ">") {
    return data;
  } else if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "=") {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    return data;
  } else if (c === "EOF") {

  } else {

  }
}


module.exports.parseHTML = function parseHTML(html) {

  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
}