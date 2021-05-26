const EOF = Symbol("EOF"); // EOF: End Of File

let currentToken = null;

function emit(token) {
  console.log(token);
}

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF"
    })
    return;
  } else {
    emit({
      type: "text",
      content: c
    })
    return data;
  }
}

function tagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: ""
    }
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
    // 拼接tagName
    currentToken.tagName += c;
    // 匹配字母代表为标签名
    return tagName;
  } else if (c.match(/^[\t\n\f ]$/)) {
    // 匹配空格代表属性
    return beforeAttributeName;
  } else if (c === "/") {
    // 代表标签结束
    return selfClosingStartTag;
  } else if (c === ">") {
    emit(currentToken);
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
    // 自封闭标签
    currentToken.isSelfClosing = true;
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