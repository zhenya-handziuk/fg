/**
 * UnauthorizedError class
 */
export class UnauthorizedError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
