<script  setup lang="ts">
import { ref , onMounted , onUnmounted , watch} from 'vue';
import Axios from '../services';
import store from '../store';
// import router from '../router';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';


const emit = defineEmits(['refrr'])

const router = useRouter()

const refresh = () => {
    getFriend()
}
defineExpose({refresh})

const ID = ref()
const friend = ref([])
const clicking = ref(false)
const click = ref(0)

async function getFriend(){
  await Axios.get('auth/Me').then(res => {
      if (res.status == 200)
        ID.value = res.data.id
      
  })
  Axios.post('friend',{id : ID.value}).then((res) => {
      friend.value = res.data
  })
}

onMounted(() => {
  getFriend()
  active()
})

watch(()=> store.state.state , () => {
  active()
})

onUnmounted(() => {
  store.state.state?.off('ref')
})


function active(){
  store.state.state?.on('ref', () => {
     getFriend()
  })
}

function GotoProfile(id: number){
  router.push("/User/" + id)
}

function cancel(){
  clicking.value = false
  click.value = 0
}

function GAME(id : Number){
  if(store.state.gameInviteID == 0){
    store.dispatch("Inviteoff")
    store.dispatch("SocketGame")
    store.commit('setGameplay',true)
    store.commit("setGamename",store.state.user.username)
    store.commit("setGameID",id)
  }
  else{
      toast("You have already invite someone or invited",
      {
         type : "error"
      })
  }
  clicking.value = !clicking.value
  click.value = 0
}

function clicked(nbr : number){
    
    if(click.value == nbr)
    {
      clicking.value = !clicking.value
      click.value = 0
    }
    else
    {
      clicking.value = true
      click.value = nbr
    }
}

function GotoDM(friend: any) {
  store.commit('setFriendDM', friend)
  store.commit('setDM', true)
  router.push("/chat")
}

function blockFriend(id : Number){
  Axios.post('friend/blocked', { id:  ID.value,  blockid:  id }).then((res) => {
      emit("refrr")   
  })
  clicking.value = false
  click.value = 0
} 

</script>

<template>
    <div class="friend">
      <ul>
        <li class="lis" v-for="friends in friend"> 
          <div v-if="friends.user.state == 'Online'" class="UserdispON">
            <button class="Ubtn" @click="clicked(friends.user.id)"> {{ friends.user.name }}</button>  
          </div>
           <div v-else-if="friends.user.state == 'OnGame'" class="UserdispGame">
              <button class="UbtnG" @click="clicked(friends.user.id)"> {{ friends.user.name }}</button>  
            </div>
            <div v-else class="UserdispDis">
                <button class="UbtnDis" @click="clicked(friends.user.id)"> {{ friends.user.name }}</button>  
            </div>
            <div class="modal" v-if="clicking == true && friends.user.id == click">
              <button class="modal-btn" v-on:click="GotoProfile(friends.user.id)" >Profile</button>
              <button class="modal-btn" v-on:click="GotoDM(friends.user)">Send DM </button>
              <div v-if="friends.user.state == 'Online'">
                    <button class="modal-btn" v-on:click="GAME(friends.user.id)">Invite for Game</button>
              </div>
              <button class="modal-btn" v-on:click="blockFriend(friends.user.id)">Block Friend</button>
              <button class="modal-btn" v-on:click="cancel">Cancel</button>
            </div>
        </li>
      </ul>
    </div>
</template>

<style lang="scss" scoped>

ul {
  display: flex;
  justify-content: center;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  .lis {
    width: 100%;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: center;
}

.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background-color: rgba(74, 72, 72,0.7);
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  button .modal-btn {
    
    background-color: #bfc7cb;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 15px 32px;
    transition: 0.1s ease-in-out;

    &:hover {
      border: 2px solid #131719;
      background-color: #4ade80;;
    }

    }
    .modal-btn {
      background-color: #bfc7cb;
      color: #141d22;
      border: 1px solid #1a4258;
      border-radius: 8px;
      text-align: center;
      padding: 7px 22px;
      transition: 0.1s ease-in-out;

      &:hover {
        border: 2px solid #131719;
        background-color: #4ade80;;
      }
}
  
}

.UserdispDis{
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 80%;
  justify-content: center;
}

.UbtnDis{
    background-color: #bfc7cb;
    width: 100%;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 7px 0;
    width: 100%;
    transition: 0.1s ease-in-out;
    &:hover {
      border: 2px solid #131719;
      background-color: rgb(232, 29, 29);
    }
  }


.friend {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  height: 15rem;
}

.UserdispGame{
  
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 80%;
  justify-content: center;
  
}
.UbtnG{
    background-color: #bfc7cb;
    width: 100%;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 7px 0;
    width: 100%;
    transition: 0.1s ease-in-out;
    &:hover {
      border: 2px solid #131719;
      background-color: rgb(233, 180, 47);
    }
  }
.UserdispON{
  
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  width: 80%;
  justify-content: center;
 
} 
.Ubtn{
    background-color: #bfc7cb;
    color: #141d22;
    border: 1px solid #1a4258;
    border-radius: 8px;
    text-align: center;
    padding: 7px 0;
    width: 100%;
    transition: 0.1s ease-in-out;
    &:hover {
      border: 2px solid #131719;
      background-color: #4ade80;;
    }
  }
}

</style>