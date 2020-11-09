export interface ApiError {
  title: string;
  errors?: { [prop: string]: string[] };
}

export interface ErrorResponse {
  error: ApiError;
}
