import HttpException from './HttpException';

class ServerErrorException extends HttpException {
  constructor() {
    super(
      500,
      "Oops, something went wrong! We're sorry for the inconvenience. Please try again later or contact support if the problem persists.",
      'ERROR'
    );
  }
}

export default ServerErrorException;
