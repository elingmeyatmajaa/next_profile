import { createSlice } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";

export function loginAction(email: string, password: string) {
  return async function loginThunk(dispatch: any, getState: any) {
    const { email, password } = getState().login;
    dispatch({
      type: "login/store",
      payload: {
        ...getState().login,
        isLoading: true,
      },
    });
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: `/login`,
    });
    if (res?.ok) {
      dispatch({
        type: "login/store",
        payload: {
          ...getState().login,
          isLoggedIn: true,
          isLoading: false,
        },
      });
    } else {
      const params = new URLSearchParams(res?.error ?? "");
      dispatch({
        type: "login/store",
        payload: {
          ...getState().login,
          isLoading: false,
          errors: {
            email: params.get("email") ? [params.get("email")] : undefined,
            password: params.get("password")
              ? [params.get("password")]
              : undefined,
          },
        },
      });
    }
    dispatch({
      type: "login/store",
      payload: {
        ...getState().login,
        isLoading: false,
      },
    });
  };
}

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLoggedIn: false,
    email: "",
    password: "",
    isLoading: false,
    errors: {},
  } as LoginState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
      state.errors = {
        ...state.errors,
        email: undefined,
      };
    },
    setPassword(state, action) {
      state.password = action.payload;
      state.errors = {
        ...state.errors,
        password: undefined,
      };
    },
    store(state, action) {
      return action.payload;
    },
  },
});
export const { store, setEmail, setPassword } = loginSlice.actions;
export default loginSlice.reducer;
