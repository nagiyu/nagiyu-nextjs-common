export default class ResponseValidator {
  public static ValidateResponse(response: Response): void {
    switch (response.status) {
      case 200:
        break;
      case 400:
        throw new Error('Fetch Error: Bad Request');
      case 401:
        throw new Error('Fetch Error: Unauthorized');
      case 404:
        throw new Error('Fetch Error: Not Found');
      case 500:
        throw new Error('Fetch Error: Internal Server Error');
      default:
        throw new Error('Fetch Error: Unknown Error');
    }
  }
}
