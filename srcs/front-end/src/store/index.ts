import { createStore} from "vuex";
import { Socket , io} from "socket.io-client";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Btn from "../components/Invite.vue"
import router from "../router";


const store = createStore(
    {
        state:{
            user:{
                id: 0,
                username: '',
                profileCompleted: false,
                blocked: [],
                friend: [],
                Twofa : false,
                Twofavalid : true,
                online : false
            }, 
            chandisp :{
                idch: 0,
                channame: '',
                messages: [],
                user: [],
                oldChatId: 0,
                ownerId: 0,
                is_private: false,
                banned: [],
                admin: [],
                muted: [],
            }, 
            chatsock: <Socket | undefined>null,

            gamesock:<Socket | undefined>null,
            gamename:<string> '',
            gameplay:false,
            gameTheme : false,
            gameInviteID : 0,
            DM: false,
            friend: {},
            
            state: <Socket | undefined>null,
        },
        getters:{
            getuser : state => state.user,
            getGamesocket : state => state.gamesock,
            getChandisp : state => state.chandisp,
            getChansocket: state => state.chatsock,
            getGamename : state => state.gamename,
            getGameplay : state => state.gameplay,
            getState : state => state,

            getStatesock : state => state.state,
            getDM : state => state.DM,
            getFriend : state => state.friend

        },
        mutations:{
            setUser(state , User){ state.user = User},
            setUserId(state , id :number){ state.user.id = id },
            setUsername(state , name : string){state.user.username = name},
            setBlocked(state , listblock){ state.user.blocked = listblock},
            setProfileC(state , bool){ state.user.profileCompleted = bool},
            setFriend(state , friend){ state.user.friend = friend},
            setGamesocket(state, socket){ state.gamesock = socket},
            setChatsocket(state, socket){state.chatsock = socket},
            setChandisp(state, chandisp) {
                state.chandisp.idch = chandisp.idch,
                state.chandisp.channame = chandisp.channame,
                state.chandisp.messages = chandisp.messages,
                state.chandisp.user = chandisp.user,
                state.chandisp.oldChatId = chandisp.oldChatId,
                state.chandisp.ownerId = chandisp.ownerId,
                state.chandisp.is_private = chandisp.is_private
                state.chandisp.banned = chandisp.banned
                state.chandisp.muted = chandisp.muted
                state.chandisp.admin = chandisp.admin
            },
            setChanid(state, id: number){state.chandisp.idch = id},
            setTwofa(state, bool){ state.user.Twofa = bool},
            setTwofavalid(state, bool){ state.user.Twofavalid = bool},
            setGamename(state, name){ state.gamename = name},
            setGameplay(state, play){ state.gameplay = play},
            setState(state, sock){ state.state = sock},
            setOnline(state, bool){state.user.online = bool},
            setTheme(state , bool){ state.gameTheme = bool},
            setGameID(state, int){ state.gameInviteID = int},
            setFriendDM(state , friend){ state.friend = friend},
            setDM(state, bool){state.DM = bool}
        },
        actions :{
            reset()
            {
                this.state.chandisp.channame = ""
                this.state.chandisp.idch = 0                
                this.state.chandisp.messages = []
                this.state.chandisp.user = []
                this.state.user.Twofavalid = true
                this.state.gamename = ""
                this.state.user.id = 0,
                this.state.user.username = '',
                this.state.user.profileCompleted =false,
                this.state.user.blocked = [],
                this.state.user.friend =[],
                this.state.user.Twofa = false,
                this.state.user.online = false
                this.state.state?.disconnect()
                this.state.gamesock?.disconnect()
                this.state.chatsock?.disconnect() 
    
            },
            Inviteoff(){
                this.state.state?.off('invited')
            },
            Inviteon(){
                    this.state.state?.on('invited',(arg1,arg2) => {
                    this.state.gamename = arg1
                    this.state.gameInviteID = arg2
                    toast(Btn, {
                        autoClose: false,
                        closeOnClick: false,
                        closeButton : false,
                        toastId: 1,
                    })
                    this.dispatch("Inviteoff")
                    })
                this.state.gamename = ""
                this.state.gameInviteID = 0
            },
            refused(){
                this.state.gamesock?.emit("Delete",{name : this.state.user.username})
                this.state.gamename = ""
                this.state.gameInviteID = 0
                this.state.gamesock?.disconnect()
            },
            SocketGame(){
                store.commit('setGamesocket',io('http://localhost:3000/game'))
                this.state.gamesock?.emit("Invite",{id : this.state.user.id , name : this.state.user.username} , rep =>{
                    this.state.state?.emit("Invite",this.state.gameInviteID)
                })
            },
            gotogame(){
                router.push("/Matchmaking")
            },
            accepted(){ 
                this.state.state?.emit("accepted" , this.state.gameInviteID)
            },
            Gameinvite()
            {
                this.dispatch("Inviteon")
                this.state.state?.on('refused',() => {
                    this.dispatch("Inviteon")
                    this.dispatch("refused")
                })
                this.state.state?.on('accepted',() => {
                    this.dispatch("gotogame")
                })
                this.state.state?.on("AlreadyInvite",() => {
                    this.dispatch("Inviteon")
                    toast("This friend is already Invited or in Game", {
                        type: "error",
                        autoClose: true,
                        closeOnClick: true,
                        closeButton : false,
                    })
                })
                this.state.state?.on("Disco",() => {
                    this.dispatch("Inviteon")
                    toast("This user is disconected", {
                        type: "error",
                        autoClose: true,
                        closeOnClick: true,
                        closeButton : false,
                    })
                })
                this.state.state?.on("Bloqued",() => {
                    this.dispatch("Inviteon")
                    toast("This user blocked YOU", {
                        type: "error",
                        autoClose: true,
                        closeOnClick: true,
                        closeButton : false,
                    })
                })
            }
        }
    }
)

export default store