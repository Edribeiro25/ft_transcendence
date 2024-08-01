<script lang="ts" setup>

import { ref, onMounted} from 'vue'
import Axios from '../services'
import { useStore } from 'vuex';
import Picture from '../components/Picture.vue';
import History from '../components/History.vue';
import { toast } from 'vue3-toastify'
/* Variables */
const store = useStore()
const User = ref()
const name = ref()
const Qrcode = ref('')
const btn = ref(false)
const code = ref('')
const activated = ref(false)


	/*Before Mount */



onMounted(() => {
	btn.value = store.state.user.Twofa
	name.value = store.state.user.username
	activated.value = store.state.user.Twofa
})
/* function */


async function editName(event) {
	User.value = store.getters.getuser
	await Axios.post("users/Change", {id : User.value.id, name: event.target.value})
	.then(response => {
		if (response.status == 201) {
			name.value = response.data
		}
		else
		{
			toast("Name too large", { autoClose: true}) 
		}
	})
}

async function Button2fa() {
	Axios.post('auth/Generate2FA')
	.then((res : any) =>{
		if(res)
		{
			Qrcode.value = res.data
			activated.value = false
		}
	})
	btn.value = true
}

function activate2fa(){
	Axios.post("auth/Activate2Fa",{id : store.state.user.id , code : code.value})
	.then(res => {
		if (res.data == true)
		{
			activated.value = true
		}
		else
		{
			toast("Wrong Code Try again",{
					type : "error"
				})
		}
	}); 
}

function delete2fa(){
	Axios.get("auth/Delete/" + store.state.user.id)
	.then((res : any) => {
		if (res.data == true)
		{
			activated.value = false
			btn.value = false
		}
	}); 
}

</script>

<template>
<div class="profile">
	<Picture/>	
	<div class="name"> <h2>{{ name }}</h2></div>
	<div class="components">
		<div class="edit">
			<h5>Edit Name:</h5>
			<input type="text" class="edit_name_class" @change="editName($event)">
		</div>
		<div>
			<h5>Auth 2FA: {{ activated }}</h5>
		</div>
		<div class="btn" v-if="btn == false"> 
			<button class="false" @click="Button2fa">GENERATE</button>
		</div>
		<div v-else-if="activated == false" class="QR">
			<img id="qrImage" height="250" width="250" :src="Qrcode">
			<form class="form" @submit.prevent="activate2fa()">
				<input type="text" v-model="code" placeholder="Enter Code" >
				<button type="submit" class="btn btn-primary">Validate Code</button>
			</form>
		</div>
		<div v-else class="btnD">
			<button class="delete" @click="delete2fa">delete2fa</button>
		</div>
	</div>
	<History/>
</div>
</template>

<style lang="scss" scoped>

.profile {
display: flex;
	 flex-direction: column;
	 align-content:flex-start;
	 flex-wrap: nowrap;
	 align-items: center;

}
input[type="text"] {
	width:200px;
    margin-top: 0.4rem;
	height:25px;
    border-radius:3px;
    background-color: rgb(237, 239, 239);
    margin-left:2px;

}
.edit {
	display: flex;
	flex-direction: row;
	h5 {
		margin-top: 1rem;
	}
}
.edit_name_class{
	display: flex;
}
.delete{
	height: 100%;
	color: #f8f9f9;
		text-align: center;
		font-size: 0.7rem;
		transition: 0.1s ease-in-out;
	    background-color: #d91b1b;
}

.btnD{
	height: 1.5rem;
}
.btn {
	display: flex;
	height: 1.5rem;
	justify-content: center;
	.false{
		width: 70%;
		color: #f8f9f9;
		border: 1px solid #1a4258;
		border-radius: 30px;
		text-align: center;
		font-size: 0.7rem;
		transition: 0.1s ease-in-out;
	    background-color: #d91b1b;
	 }
}
.QR{
display: flex;
	 align-items: center;
	 flex-direction: column;	
gap: 0.5rem;
     img{
	     border-radius: 3px;
     }
     input{
padding: 0;
margin: 0.5rem
     }
     button{
	     justify-content: center;
width: 100%;
height: 100%;
padding: 0;
margin: 0rem;
     }
}
</style>
