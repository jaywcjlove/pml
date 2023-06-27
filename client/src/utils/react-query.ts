import { MutationFunction, MutationOptions, useMutation, QueryClient } from '@tanstack/react-query';
import { getToken } from '../store/persistence';

// export const HOST = process.env.API_HOST || 'http://localhost:3002';
// export const getUrl = (path: string) => (process.env.NODE_ENV === 'production' ? path : `${HOST}${path}`);
export const getUrl = (path: string) => path;

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {},
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
  },
});

/**
 * Fetch API 请求
 * ## 返回状态
 *
 * 200: '服务器成功返回请求的数据'
 * 201: '新建或修改数据成功'
 * 400: '发出的请求错误'
 * 401: '用户没有权限'
 * 403: '用户访问被禁止'
 * 404: '请求不存在，服务器没有进行操作'
 * 406: '请求的格式错误'
 * 410: '资源被永久删除'
 * 422: '验证错误'
 * 500: '服务器发生错误，请检查服务器'
 * 502: '网关错误'
 * 503: '服务不可用，服务器暂时过载或维护'
 * 504: '网关超时'
 * @param url string  请求 API
 */
export const fetchFn = (url: string, { ...fetchOption }: RequestInit = {}) => {
  fetchOption.headers = new Headers({
    ...fetchOption.headers,
    'Content-Type': 'application/json',
  });
  const token = getToken();
  if (token) {
    fetchOption.headers.set('Authorization', `token ${token}`);
  }
  return fetch(getUrl(url), fetchOption);
};

export const fetchFetcher = (url: string, { ...fetchOption }: RequestInit = {}) => {
  return fetchFn(url, fetchOption)
    .then(async (res) => {
      if (!/(200|201)/.test(String(res.status))) {
        const result = await res.json();
        throw new Response('', {
          status: res.status || result.code,
          headers: res.headers,
          statusText: encodeURI(`${result.message}`),
        });
      }
      return res.json();
    })
    .catch((err: Error) => {
      // @ts-ignore
      const message = decodeURI(err.message || err.statusText);
      throw new Response('', {
        // @ts-ignore
        status: err.status || 500,
        statusText: encodeURI(message),
      });
    });
};

export interface ReactMutationOptions<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>
  extends Omit<RequestInit, 'body'>,
    MutationOptions<TData, TError, TVariables, TContext> {
  url?: string;
}

export function useReactMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  options: ReactMutationOptions<TData, TError, TVariables, TContext>,
) {
  const {
    url,
    cache,
    credentials,
    headers,
    integrity,
    keepalive,
    method = 'POST',
    mode,
    redirect,
    referrer,
    referrerPolicy,
    signal,
    window,
    ...opts
  } = options || {};
  const fetchOption: RequestInit = {
    cache,
    credentials,
    headers,
    integrity,
    keepalive,
    method,
    mode,
    redirect,
    referrer,
    referrerPolicy,
    signal,
    window,
  };
  const mutationOptions: MutationOptions<TData, TError, TVariables, TContext> = { ...opts };
  if (url) {
    const cusFn: MutationFunction<TData, TVariables> = (newData) => {
      if (newData && Object.prototype.toString.call(newData).slice(8, -1) !== 'FormData') {
        fetchOption.body = JSON.stringify(newData);
      }
      return fetchFetcher(url, { ...fetchOption });
    };
    mutationOptions.mutationFn = mutationOptions.mutationFn || cusFn;
  }
  return useMutation(mutationOptions);
}
