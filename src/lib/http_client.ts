import { UeException } from "@/exceptions/ue_exception";
import jsonToFormData from "@/utilities/json_to_formdata";
import axios from "axios";

export default class HttpClient {
  static defaultHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  static defaultHeadersFile() {
    return {
      "Content-Type":
        "multipart/form-data; boundary=<calculated when request is sent>",
      Accept: "application/json",
    };
  }

  static async serverGet(url: string, params?: object) {
    try {
      const response = await axios.get(`http://localhost:3000/api/${url}`, {
        headers: {
          ...this.defaultHeaders(),
        },
        withCredentials: true,
        params: params,
      });
      return response;
    } catch (error: any) {
      console.log(error);

      // if (error.response.status == 422) {
      //     throw new UeException(error.response.data.message, error.response.data.errors);
      // }
      throw error;
    }
  }

  static async GET(url: string, params?: object) {
    try {
      const response = await axios.get(`/api/${url}`, {
        headers: {
          ...this.defaultHeaders(),
        },
        params: params,
      });

      return response;
    } catch (error: any) {
      if (error.response.status == 422) {
        throw new UeException(
          error.response.data.message,
          error.response.data.errors
        );
      }
      throw error;
    }
  }

  static async POST(url: string, body?: any) {
    try {
      const response = await axios.post(`/api/${url}`, body, {
        headers: {
          ...this.defaultHeaders(),
        },
      });
      return response;
    } catch (error: any) {
      if (error.response.status == 422) {
        throw new UeException(
          error.response.data.message,
          error.response.data.errors
        );
      }
      throw error;
    }
  }

  static async POSTFILE(url: string, body: any) {
    let formData = jsonToFormData(body);
    console.log(formData, "formData");
    try {
      const response = await axios.post(`/api/${url}`, formData, {
        headers: {
          ...this.defaultHeadersFile(),
        },
      });
      return response;
    } catch (error: any) {
      if (error.response.status == 422) {
        throw new UeException(
          error.response.data.message,
          error.response.data.errors
        );
      }
      throw error;
    }
  }

  static async PUT(url: string, body: any) {
    try {
      const response = await axios.put(`/api/${url}`, body, {
        headers: {
          ...this.defaultHeaders(),
        },
      });
      return response;
    } catch (error: any) {
      if (error.response.status == 422) {
        throw new UeException(
          error.response.data.message,
          error.response.data.errors
        );
      }
      throw error;
    }
  }

  static async PUTFILE(url: string, body: any) {
    let formData = jsonToFormData(body);
    // let formData = new FormData();
    // Object.keys(body).forEach((key) => {
    //   formData.append(key, body[key]);
    // });
    formData.append("_method", "PUT");
    try {
      const response = await axios.put(`/api/${url}`, formData, {
        headers: {
          ...this.defaultHeadersFile(),
        },
      });
      return response;
    } catch (error: any) {
      if (error.response.status == 422) {
        throw new UeException(
          error.response.data.message,
          error.response.data.errors
        );
      }
      throw error;
    }
  }

  static async PUTFILEITEM(url: string, body: any) {
    let formData = new FormData();
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });
    formData.append("_method", "PUT");
    try {
      const response = await axios.put(`/api/${url}`, formData, {
        headers: {
          ...this.defaultHeadersFile(),
        },
      });
      return response;
    } catch (error: any) {
      if (error.response.status == 422) {
        throw new UeException(
          error.response.data.message,
          error.response.data.errors
        );
      }
      throw error;
    }
  }

  static async DELETE(url: string) {
    try {
      const response = await axios.delete(`/api/${url}`, {
        headers: {
          ...this.defaultHeaders(),
        },
      });
      return response;
    } catch (error: any) {
      if (error.response.status == 422) {
        throw new UeException(
          error.response.data.message,
          error.response.data.errors
        );
      }
      throw error;
    }
  }
}
