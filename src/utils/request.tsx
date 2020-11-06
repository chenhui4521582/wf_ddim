/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { Toast } from 'antd-mobile';
import { appCall } from '@/utils/bridge.js';

interface codeMessageType {
  [key: number]: string;
}

const codeMessage: codeMessageType = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    Toast.offline(errorText, 1);
  } else if (!response) {
    Toast.offline('您的网络发生异常，无法连接服务器', 1);
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  credentials: 'include', // 默认请求是否带上cookie
});

const getIMToken = async () => {
  return new Promise((resolve, reject) => {
    appCall.callIOSHandler('ddimGetTokenCallBack', {}, function(response: any) {
      const { data } = JSON.parse(response);
      resolve(data);
    });
  });
};

request.use(async (ctx, next) => {
  // let dataToken = await getIMToken();
  let dataToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDQ2NTE5MjIzMTksInBheWxvYWQiOiJcIjR3NGI4dDBsM3Q2ZTVmb29hempqNHZ0ejhlMTlwY3cyXCIifQ.q99Wd4wg4XzUcjHER_qW-xyrZwn8er_AV0A3PomTeEk';
  const { req } = ctx;
  const { options } = req;
  options.headers = {
    token: dataToken as string,
    ...options.headers,
  };
  await next();
  const { res } = ctx;
  if (res.status !== 200) {
    Toast.offline(res.msg, 3);
  }
});

export default request;
