import axios from 'axios';
// import { Notification } from 'elementUI';
import {backHost} from '../static/config.js'
import Qs from 'qs';
import {Notice, Message} from 'iview';

//超时时间2min
axios.defaults.timeout = 2*60*1000;

// 配置后端地址
axios.defaults.baseURL = backHost;

// 前端发请求的时候携带cookie，目前只知道这么做，后续有好的方案在改进
axios.defaults.withCredentials = true;

// 请求拦截器
axios.interceptors.request.use(request => {
    //发送请求之前做点什么
    return request;
},error => {
    Vue.$notify({
        title:'错误',
        message:'请求超时，请检查您的网络状况！'
    })
    return Promise.reject(error);
})

// http响应拦截器
axios.interceptors.response.use(data => {
    if(!data || !data.data) {
        console.error('错误：无返回数据！');
        return data.data;
    };
    // if(data.data.status != 200) {
    //     console.error('错误：('+data.data.status+')'+data.data.message);
    //     return data.data;
    // };

    // 无权限
    if (data.data.status === 403) {
        console.error('403：', data.config.url, data.data.message);
        Notice.error({
            title: 'error',
            desc: 'Access Denied'
        });
        return data.data;
    }
    return data.data;
})


let fetch = (method='get',url,params,qs=true, upload=false) => {
    if(Object.prototype.toString.call(method) != "[object String]") {
        console.error("错误：请求方法错误！")
        return;
    };
    method = method.toLocaleLowerCase();
    if(method != 'get' && method != 'post' && method != 'put' && method != 'delete' && method != 'head' && method != 'connect' && method != 'options' && method != 'trace'){
        console.error("错误：请求方法错误！")
        return;
    };

    if(upload && method != 'post') {
        console.error("错误：请求方法错误！")
        return;
    };

    if(Object.prototype.toString.call(url) != "[object String]") {
        console.error("错误：url错误！")
        return;
    };
    let axiosConfig = {
        method:method,
        url:url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params:{},
        data:{},
    };

    if(upload) {
        axiosConfig.headers["Content-Type"] = 'multipart/form-data';
    }

    if(method == 'get' || method == 'delete') {
        axiosConfig.params = params;
    } else if (method === 'post' || method === 'put') {
        if (!qs || Object.prototype.toString.call(params) == '[object String]') {
            axiosConfig.headers['Content-Type'] = 'application/json';
            axiosConfig.data = params;
        } else {
            axiosConfig.data = Qs.stringify(params)
        }
    };
    return new Promise((resolve, reject) => {
        axios(axiosConfig)
            .then(response => {
                // 成功返回数据
                resolve(response);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            })
    })
}

export default (method, url, params, qs, upload) => {
    return fetch(method, url, params, qs, upload)
}