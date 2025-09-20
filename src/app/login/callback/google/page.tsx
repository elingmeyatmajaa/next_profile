import HttpServer from "@/lib/http_server";

async function getToken(params: any) {
    const { data } = await HttpServer.POST('/google-login', { ...params })
    return data
}

export default function Page(request: any) {
    const params = request.searchParams;
    getToken(params)
    return (
        <div>
            <h1>Google Login Callback</h1>
            <p>Code: </p>
        </div>
    )

}