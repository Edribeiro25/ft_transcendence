<script setup lang="ts">
import Axios from '../services';
import {ref} from "vue";
import router from '../router';
import { toast } from 'vue3-toastify';
import store from '../store';
import {io} from 'socket.io-client'

const code = ref('');

function sendcode(){
    try {
        Axios.post("auth/Verify2FA",{code : code.value}).then(res => {
            if (res.data == true)
            {
                store.commit('setGamesocket',io('http://localhost:3000/game'))
                router.push("/")
            }  
            else
            {
                toast("Wrong Code Try again",
                {
                    type : "error"
                })
            }
        } ); 
    } catch (error) {
        
    }
}


store.state.state.disconnect()

</script>
<template>
    <h1>TWO FACTOR CONNECTION</h1>
    <div class="otp">
        <div>
            <form class="form" @submit.prevent="sendcode()">
                <input type="text" v-model="code" placeholder="Enter Code" >
                <button type="submit" class="btn btn-primary">Valid Code</button>
            </form>
        </div>
    </div>
</template>
<style lang="scss" scoped>

.otp{
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    button{
        height: 2rem;
    }
    input
    {
        height: 2rem;
        border-radius: 10px;
        padding-right: 0.5rem;
    }
    form{
        button{
            height: 2rem;
            margin-left: 1rem;
        }
    }
}
</style>