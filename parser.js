const EOF = Symbol("EOF"); // EOF: End Of File

let currentToken = null;
let currentAttribute = null;

function emit(token) {
  if (token.type !== "text") {
    console.log(token);
  }
}

function data(c) {
  // 判断开始标签
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
    emit({
      type: "text",
      content: c
    })
    return;
  }
}

function endTagOpen(c) {
  if (c === ">") {
    // console.log(c);
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: ""
    }
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
    currentToken.tagName += c;
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c === ">" || c === "/" || c === EOF) {
    return afterAttributeName(c);
  } else if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "=") {
    // return beforeAttributeName; 
  } else {
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(c);
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === "\"" || c === "'" || c ==="<") {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === "\"") {
    // 判断属性值是否是双引号包裹
    return doubleQuotedAttributeValue;
  } else if (c === "\'") {
    // 判断属性值是否是单引号包裹
    return singleQuotedAttributeValue;
  } else if (c === ">") {

  } else {
    return UnquotedAttributeValue(c);
  }

}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === EOF) {
    
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {

  } else if (c === "\"" || c === "'" || c === "<" || c === "=" || c === "`") {

  } else if (c === EOF) {

  } else {
    // 拼接属性值
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    // 自封闭标签
    currentToken.isSelfClosing = true;
    emit(currentToken);
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