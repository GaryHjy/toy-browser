const net = require('net');

class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.path = options.path || '/';
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }
    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port,
        }, () => {
          connection.write(this.toString());
        })
      }
  
      connection.on('data', function(data) {
        resolve(data.toString());
        connection.end();
      })

      connection.on('error', function(err) {
        reject(err);
        connection.end();
      })
    })
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}
`}
};

class Response {};

// const client = net.createConnection({
//   host: 'localhost',
//   port: '8088',
// }, function() {
// //   client.write(`
// // POST / HTTP/1.1\r
// // Content-Type: application/x-www-form-urlencoded\r
// // Content-Length: 8\r
// // \r
// // name=ayu\r\n`);
//   const request = new Request({
//     method: 'POST',
//     host: '127.0.0.1',
//     port: '8088',
//     path: '/',
//     body: {
//       name: 'ayu'
//     },
//     headers: {
//       ['X-Foo2']: 'customed'
//     }
//   })
//   client.write(request.toString());
// })

// client.on('data', function(data) {
//   console.log(data.toString());
//   client.end();
// })

// client.on('end', () => {
//   console.log('disconnected from server');
// });

void async function() {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    body: {
      name: 'ayu'
    },
    headers: {
      ['X-Foo2']: 'customed'
    }
  });

  try {
    const res = await request.send();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}();