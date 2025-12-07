import Axios from "axios";

Axios.defaults.baseURL = "http://localhost:8000/";

const axiosInstance = Axios.create({
    withCredentials: true,
});

export async function HTTPGet (url,data) {
    const token = localStorage.getItem("token")
    Axios.defaults.headers.Authorization = `Bearer ${token}`;
    const res = await axiosInstance.get(url, data);
    return res
}

export async function HTTPost (){
    const token = localStorage.getItem("token")
    Axios.defaults.headers.Authorization = `Bearer ${token}`;
    const res = await axiosInstance.post(url, data);
    return res
}
