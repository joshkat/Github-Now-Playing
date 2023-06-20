function stream_to_message(stream, callback, ...args) {
  //...args here is an array of arguments
  let body = "";
  stream.on("data", (chunk) => (body += chunk));
  stream.on("end", () => callback(body, ...args));
}

module.exports = stream_to_message;
