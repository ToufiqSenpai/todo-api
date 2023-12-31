import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import HttpStatus from "../enums/HttpStatus";
import responseStatus from "../utils/responseStatus";
import { ValidationException } from "flare-validator";

function errorHandling(error: Error, req: Request, res: Response, next: NextFunction): Response {
  if(error instanceof HttpException) {
    const resBody: any = {
      status: error.getHttpStatus(),
      message: error.message
    }

    if(error.getErrors()) resBody.errors = error.getErrors()

    return res.status(error.getHttpStatus()).json(resBody)
  } else if(error instanceof ValidationException) {
    return res.status(400).json({ ...responseStatus(400, 'Bad Request'), errors: error.violation.getMessageList() })
  } else {
    return res.status(500).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: error.name,
      trace: error.stack,
      timestamp: new Date().toISOString(),
      path: req.path
    })
  }
}

export default errorHandling