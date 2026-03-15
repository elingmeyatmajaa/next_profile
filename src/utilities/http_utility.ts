import axios from "axios";
import { HttpException, InvalidFormException, UnauthorizedException } from "@/app/exceptions/http_exception";

class HttpUtility {
    static setBaseUrl = (url: string) => {
        axios.defaults.baseURL = url;
    }

    static setToken = (token: string) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    static setHeader = (key: string, value: string) => {
        axios.defaults.headers.common[key] = value;
    }

    static get = async (url: string, option?: any ) => {
        try {
            const { data } = await axios.get(url, option);
            return data;
        } catch (error) {
            throw this._error(error);
        }
    }

    static post = async (url: string, body: any) => {
        try {
            const { data } = await axios.post(url, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return data;
        } catch (error: any) {
            throw this._error(error);
        }
    }

    static put = async (url: string, body: any) => {
        try {
            const { data } = await axios.put(url, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return data;
        } catch (error: any) {
            throw this._error(error);
        }
    }

    static postFile = async (url: string, body: any) => {
        let formData = new FormData();
        Object.keys(body).forEach((key) => {
            formData.append(key, body[key])
        })
        try {
            const { data } = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return data;
        } catch (error: any) {
            throw this._error(error);
        }
    }

    static putFile = async (url: string, body: any) => {
        let formData = new FormData();
        Object.keys(body).forEach((key) => {
            formData.append(key, body[key])
        })
        try {
            const { data } = await axios.put(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return data;
        } catch (error: any) {
            throw this._error(error);
        }
    }

    static delete = async (url: string) => {
        try {
            const { data } = await axios.delete(url);
            return data;
        } catch (error: any) {
            throw this._error(error);
        }
    }

    static _error = (error: any) => {
        if (!error.response) {
            throw Error('Network Error');
        }
        if (error.response.status == 401) {
            throw new UnauthorizedException();
        } else if (error.response.status == 422) {
            throw new InvalidFormException(error.response.data.errors);
        }
        throw new HttpException(error.response.status, error.response.data.message);
    }
}

export default HttpUtility;