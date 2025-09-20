interface LoginState {
    isLoggedIn: boolean,
    email: string,
    password: string,
    isLoading: boolean,
    errors: {
        email?: string[] | undefined,
        password?: string[] | undefined,
    }
}