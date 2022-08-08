export default function errorHandler(status, message) {
  const err = new Error();
  err.status = status;
  err.message = message;

  return err;
}

// class ErrorHandler extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;

//     Error.captureStackTrace(this, this.constructor);
//   }
// }
// export default ErrorHandler;
