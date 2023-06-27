import { ExpressMiddlewareInterface, SelectQueryBuilder } from 'typenexus';
import { NextFunction, Request, Response } from 'express';

declare module 'typeorm' {
  export interface SelectQueryBuilder<Entity> {
    paginate(per_page?: number | null): Promise<PaginationAwareObject<Entity>>;
  }
}
export interface PaginationAwareObject<T> {
  from: any;
  to: any;
  per_page: any;
  total: number | any;
  page: number;
  prev_page?: number | null;
  next_page?: number | null;
  last_page: number | null;
  data: Array<T>;
}
/**
 * Number of items to list per page (default: 20, max: 100).
 * @default 20
 */
export function getPerPage(req: Request, defaultPerPage: number = 20) {
  let per_page = parseInt(req.query.per_page as string);
  if (per_page > 100) {
    per_page = 100;
  }
  return per_page || defaultPerPage;
}
/**
 * Page number (default: 1).
 * @default 1
 */
export function getPage(req: Request, defaultPage: number = 1) {
  return parseInt(req.query.page as string) || defaultPage;
}

export class PaginationMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional
  use(request: Request, response: Response, next: NextFunction): any {
    SelectQueryBuilder.prototype.paginate = async function (per_page?: number | null): Promise<any> {
      let current_page = getPage(request);
      if (!per_page) per_page = getPerPage(request); // If not set, then get from request, default to 15
      else per_page = getPerPage(request, per_page); // If set, check if the request has per_page (which will override), or fallback to the set default
      return await paginate(this, current_page, per_page);
    };
    next();
  }
}

export const paginate = async function <T>(
  builder: SelectQueryBuilder<any>,
  page: number,
  per_page: number,
): Promise<PaginationAwareObject<T>> {
  let skip = (page - 1) * per_page;
  const total = builder;
  const count = await total.getCount();
  const calcule_last_page = count % per_page;
  const last_page = calcule_last_page === 0 ? count / per_page : Math.trunc(count / per_page) + 1;
  let res = await builder.skip(skip).take(per_page).getMany();
  return {
    from: skip <= count ? skip + 1 : null,
    to: count > skip + per_page ? skip + per_page : count,
    per_page: per_page,
    total: count,
    page: page,
    prev_page: page > 1 ? page - 1 : null,
    next_page: count > skip + per_page ? page + 1 : null,
    last_page: last_page,
    data: res || [],
  };
};
