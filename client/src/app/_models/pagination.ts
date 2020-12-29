import { HttpResponse } from '@angular/common/http';

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  result: T;
  pagination: Pagination;

  constructor(response: HttpResponse<T>) {
    this.result = response.body;
    if (!!response.headers.get('Pagination')) {
      this.pagination = JSON.parse(response.headers.get('Pagination'));
    }
  }
}
