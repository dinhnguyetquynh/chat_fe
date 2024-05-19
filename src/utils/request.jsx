import { notification } from 'antd';
import axios from 'axios';
import localStorageService from '../services/localStorageService.js';
import { APP_KEY } from '../common/constant';

const baseConfig = {
  timeout: 10000,
  baseURL: 'http://localhost:3000/api',
};

class Request {
  instance;

  constructor(config) {
    this.instance = axios.create(config);
    this.instance.interceptors.request.use(
      (requestConfig) => {
        const token = localStorageService.getValue(APP_KEY.token) || '';
        requestConfig.headers.Authorization = `Bearer ${token}`;
        return requestConfig;
      },
      (err) => {
        console.error('request interceptors error:', err);
      },
    );

    this.instance.interceptors.response.use(
      (res) => {
        const { status, data } = res;

        if (status === 204) {
          // no content
          return true;
        }
        return data;
      },
      async (error) => {
        const { status, data } = error.response || {};
        const { errorCode = '', details } = data;

        console.log(data);
        const msg = details.map((detail) => detail.message).join(', ');

        if (status === 400) {
          notification.error({ message: msg });
          return Promise.reject(data);
        }
        // 401: Re-login required
        if (status === 401) {
          const originalRequest = error.config;
          // clear userinfo

          if (errorCode === 'token_expired' && !originalRequest._retry) {
            const refreshToken =
              localStorageService.getValue(APP_KEY.refreshToken) || null;
            if (refreshToken) {
              originalRequest._retry = true;
              try {
                const resp = await fetch(`${baseConfig.baseURL}/auth/token`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ token: refreshToken }),
                }).then((data) => data.json());

                const accessToken = resp.access_token;
                const _refreshToken = resp.refresh_token;

                localStorageService.setValue(APP_KEY.token, accessToken);
                localStorageService.setValue(
                  APP_KEY.refreshToken,
                  _refreshToken,
                );

                originalRequest.headers.Authorization = accessToken;
                return this.instance(originalRequest);
              } catch (error) {
                notification.error({
                  message: `re assign token error ${error}`,
                });
              }
            } else {
              notification.error({ message: 'no refresh token' });
            }
          }
          return Promise.reject(false);
        }

        if (status === 403) {
          // Permission interception
          // window.location.href = "/auth/login";
          return Promise.reject(false);
        }

        if (status === 404) {
          notification.error({ message: msg });
          return Promise.reject(data);
        }

        if (status >= 500) {
          console.log(data);
          console.error(
            `Request failed with status code ${500}, ${
              'Server external error' || ''
            }`,
          );
        }
        return Promise.reject(data);
      },
    );
  }

  request(config) {
    return this.instance.request(config);
  }

  get(url, config = {}) {
    return this.instance.get(url, config);
  }

  post(url, data, config = {}) {
    return this.instance.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.instance.put(url, data, config);
  }

  delete(url, data, config = {}) {
    return this.instance.delete(url, {
      data,
      ...config,
    });
  }
}

const request = new Request(baseConfig);
export default request;
export { Request };
