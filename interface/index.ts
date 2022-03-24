export interface IRequest extends Request {
    csrfToken(): string
}
