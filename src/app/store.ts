import {
    configureStore,
} from '@reduxjs/toolkit'
import { loginSlice } from './login/redux/login_slice';
const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        login: loginSlice.reducer,
    },
})
export default store;