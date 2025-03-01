import axios from 'axios'
import store from '../store';
import { toast } from 'vue3-toastify'

const Axios = axios.create({
    withCredentials :true,
    baseURL :"http://localhost:3000",
    headers :{"Access-Control-Allow-Origin": "http://localhost:3000"}
})

Axios.interceptors.response.use(response =>{
    return response;
},error => {
    if (error.response.status == 401)
    {
        store.dispatch("reset")
        $cookies.remove('access_token')
    }

    return error.response
});
export default Axios