// import { config } from 'config.js';
import {
  utils
} from 'util.js'

var util = new utils();
class HTTP {

  constructor() {
    // this.httpUrl = config.configUrl;
  }
  ajaxServe(Type, url, data, jsonStr) {
    if (!Type) {
      console.warn('请求方式未定义');
      return;
    }
    if (!url) {
      console.warn('请求地址未定义');
      return;
    }

    if (jsonStr && jsonStr.loadSta) {
      util.showAlert(jsonStr.loading ? jsonStr.loading : '加载中...');
    }

    let header = jsonStr && jsonStr.header ? jsonStr.header : {
      'content-type': 'application/json',
    };
    if (wx.getStorageSync('token')) {header['Authorization'] = wx.getStorageSync('token')}

    return new Promise((resolve, reject) => {
      wx.request({ //发送请求
        url: url,
        data: data,
        method: Type,
        header: header,
        success: res => {
          // console.log(res);
          if (res.statusCode == 200 && res.data) {
            resolve(res.data);
          } else {
            if (!res.data) {
              resolve({
                'data': res
              });
            }
          }
          if (res.statusCode == 400) {
            util.showAlert("请求错误", 'none', 1500);

          }
          if (res.statusCode == 404) {
            util.showAlert("请求错误", 'none', 1500);

          }
          if (res.statusCode == 401) {
            util.showAlert("账号密码错误", 'none', 1500);

          }
          if (res.statusCode == 500) {
            util.showAlert("服务异常", 'none', 1500);

          }
        },
        fail: err => {
          reject(err)
          util.showAlert("请求超时", 'none', 1500);
        }
      })
    })
  }
}


export {
  HTTP
};