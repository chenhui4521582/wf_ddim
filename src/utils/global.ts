export interface GlobalResParams<T> {
  msg: string;
  obj: T;
  status: number;
};

export interface PaginationTableParams {
  pageNum: number;
  pageSize: number;
  [propName: string]: any;
};