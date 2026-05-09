export type ActionResult<T = undefined> =
  | {
      success: true;
      data?: T;
      message?: string;
    }
  | {
      success: false;
      message: string;
      status?: number;
    };

export function actionSuccess<T>(data?: T, message?: string): ActionResult<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function actionFailure(message: string, status = 400): ActionResult<never> {
  return {
    success: false,
    message,
    status,
  };
}
