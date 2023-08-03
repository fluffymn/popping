import router from "@/router";
// import { kakaologin } from "@/api/user";
import { deleteuser, gettoken, readmessages, getshareidmessages, getshareid, getUserInfo, kakaologin, sentUserMessage, receivedUserMessage, logout } from "@/api/user";


const userStore = {
  namespaced: true,
  state: {
    isLogin: false,
    isLoginError: false,
    userInfo: null,
    isValidToken: false,
    sentmessages: null,
    receivedmessages: null,
    shareid: null,
    othermessages: null,
  },
  getters: {
    checkUserInfo: function (state) {
      return state.userInfo;
    },
    checkSentMessages: function (state) {
      return state.sentmessages;
    },
    checkShareId: function (state) {
      return state.shareid;
    },
    checkReceivedMessages: function (state) {
      return state.receivedmessages;
    },
    checkToken: function (state) {
      return state.isValidToken;
    },
    checkOthermessages: function (state) {
      return state.othermessages;
    },
    isLoggedIn: state => state.isLoggedIn,
  },
  mutations: {
    SET_IS_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin;
    },
    SET_IS_LOGIN_ERROR: (state, isLoginError) => {
      state.isLoginError = isLoginError;
    },
    SET_IS_VALID_TOKEN: (state, isValidToken) => {
      state.isValidToken = isValidToken;
    },
    SET_USER_INFO: (state, userInfo) => {
      state.isLogin = true;
      state.userInfo = userInfo;
    },
    SET_SENT_MESSAGES: (state, sentmessages) => {
      state.sentmessages = sentmessages;
    },
    SET_RECEIVED_MESSAGES: (state, receivedmessages) => {
      state.receivedmessages = receivedmessages;
    },
    SET_SHAREID: (state, shareid) => {
      state.shareid = shareid;
    },
    SET_OTHERMESSAGES: (state, othermessages) => {
      state.othermessages = othermessages;
    },
  },
  actions: {
    // 로그인 시 유저 정보 불러오기
    async kakao({ commit }, code) {
      await kakaologin(
        code,
        (response) => {
          if (response.status === 200) {
            console.log(response)
            let accessToken = response.data["accessToken"];
            let refreshToken = response.data["refreshToken"];
            // console.log(accessToken)
            // console.log(refreshToken)
            commit("SET_IS_LOGIN", true);
            commit("SET_IS_LOGIN_ERROR", false);
            commit("SET_IS_VALID_TOKEN", true);
            console.log(this.state)
            localStorage.setItem("access-token", accessToken);
            localStorage.setItem("refresh-token", refreshToken);
            // console.log(localStorage.getItem("access-token"))
            getUserInfo(
              (response) => {
                if (response.status == 200) {
                  commit("SET_USER_INFO", response.data);
                  localStorage.setItem("userinfo", JSON.stringify(response.data));
                  // router.push({ name: "MainView", params: { pageid: this.state.userStore.shareid.share_id } });
                } else {
                  console.log("유저 정보 없음");
                }
              },
              async (error) => {
                console.log(error);
                // console.log(
                //   "getUserInfo() error code [토큰 만료되어 사용 불가] ::: ",
                //   error.response.status
                // );
                commit("SET_IS_VALID_TOKEN", false);
                router.push({ name: "LoginView" });
              }
            );
            getshareid(
              (response) => {
                if (response.status == 200) {
                  commit("SET_SHAREID", response.data);
                  localStorage.setItem("shareid", JSON.stringify(response.data));
                  // console.log(userStore.state.userInfo.nickname);
                  // console.log(this.state.userStore.shareid.share_id)
                } else {
                  console.log("shareid 없음");
                }
              },
              async (error) => {
                console.log(error);
                // commit("SET_SHAREID", null);
                router.push({ name: "LoginView" });
              }
            );
            sentUserMessage(
              (response) => {
                if (response.status == 200) {
                  commit("SET_SENT_MESSAGES", response.data)
                  localStorage.setItem("sentmessages", JSON.stringify(response.data));
                  // console.log(userStore.state.sentmessages);
                } else {
                  console.log("보낸 메세지 없음");
                }
              },
              async (error) => {
                console.log(error);
                console.log('보낸ap세지 받아오기 에러');
              }
            )
            receivedUserMessage(
              (response) => {
                if (response.status == 200) {
                  commit("SET_RECEIVED_MESSAGES", response.data)
                  localStorage.setItem("receivedmessages", JSON.stringify(response.data));
                  // console.log(userStore.state.receivedmessages);
                  router.push({ name: "MainView", params: { pageid: this.state.userStore.shareid.share_id } });
                } else {
                  console.log("받은 메세지 없음");
                }
              },
              async (error) => {
                console.log(error);
                console.log('받은메세지 받아오기 에러');
              }
            )
          } else {
            commit("SET_IS_LOGIN", false);
            commit("SET_IS_LOGIN_ERROR", true);
            commit("SET_IS_VALID_TOKEN", false);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //여기까지 로그인 시 받아오는 정보

    // 로그아웃
    async logoutUser({ commit }) {
      await logout((response) => {
        if (response.status == 200) {
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_LOGIN_ERROR", true);
          commit("SET_IS_VALID_TOKEN", false);
          localStorage.clear();
          router.push({ name: "LoginView" });

        } else {
          console.log("잘못된 access token임. 로그아웃 처리.");
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_LOGIN_ERROR", true);
          commit("SET_IS_VALID_TOKEN", false);
          localStorage.clear();
        }
      },
        (error) => {
        console.log(error);
        console.log('이건가');
      })
    },
    //탈퇴
    async userdelete({ commit }) {
      await deleteuser((response) => {
        if (response.status == 200) {
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_LOGIN_ERROR", true);
          commit("SET_IS_VALID_TOKEN", false);
          localStorage.clear();
          router.push({ name: "LoginView" });
          console.log('탈퇴완료')

        } else {
          console.log("잘못된 access token임. 로그아웃 처리.");
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_LOGIN_ERROR", true);
          commit("SET_IS_VALID_TOKEN", false);
          localStorage.clear();
        }
      },
        (error) => {
        console.log(error);
        console.log('이건가');
      })
    },
    // 다른 유저 메인페이지에 메세지, 닉네임 띄우기
    async shareidmessage({ commit }, page) {
      await getshareidmessages(
        page, 
        (response) => {
        if (response.status == 200) {
          commit("SET_OTHERMESSAGES", response.data);
        } else {
          console.log("잘못");
        }
      },
        (error) => {
        console.log(error);
      })
    },
    // 메세지 읽음
    async changeread( {commit}, messageid ) {
      await readmessages(
        messageid, 
        (response) => {
        if (response.status == 200) {
          commit("SET_RECEIVED_MESSAGES", response.data)
          localStorage.setItem("receivedmessages", JSON.stringify(response.data));
          console.log('메세지 지워짐')
        } else {
          console.log("잘못");
        }
      },
        (error) => {
        console.log(error);
        console.log(messageid)
      })
    },

    // 새로고침 or 페이지 넘어갈때 데이터 업데이트
    async updateUserData({ commit }) {
      getUserInfo(
        (response) => {
          if (response.status == 200) {
            commit("SET_USER_INFO", response.data);
            localStorage.setItem("userinfo", JSON.stringify(response.data));
            // router.push({ name: "MainView", params: { pageid: this.state.userStore.shareid.share_id } });
          } else {
            console.log("유저 정보 없음");
          }
        },
        async (error) => {
          console.log(error);
          commit("SET_IS_VALID_TOKEN", false);
          router.push({ name: "LoginView" });
        }
      );
      sentUserMessage(
        (response) => {
          if (response.status == 200) {
            commit("SET_SENT_MESSAGES", response.data)
            localStorage.setItem("sentmessages", JSON.stringify(response.data));
            // console.log(userStore.state.sentmessages);
          } else {
            console.log("보낸 메세지 없음");
          }
        },
        async (error) => {
          console.log(error);
          console.log('보낸메세지 받아오기 에러');
        }
      )
      receivedUserMessage(
        (response) => {
          if (response.status == 200) {
            commit("SET_RECEIVED_MESSAGES", response.data)
            localStorage.setItem("receivedmessages", JSON.stringify(response.data));
            // console.log(userStore.state.receivedmessages);
          } else {
            console.log("받은 메세지 없음");
          }
        },
        async (error) => {
          console.log(error);
          console.log('받은메세지 받아오기 에러');
        }
      )
    },

    // 새로운 access Token 발급
    async getnewaccesstoken({ commit }) {
      gettoken(
        (response) => {
          if (response.status == 200) {
            console.log(response)
            let accessToken = response.data["accessToken"];
            let refreshToken = response.data["refreshToken"];
            commit("SET_IS_LOGIN", true);
            commit("SET_IS_LOGIN_ERROR", false);
            commit("SET_IS_VALID_TOKEN", true);
            localStorage.setItem("access-token", accessToken);
            localStorage.setItem("refresh-token", refreshToken);
            console.log(accessToken);
            console.log(this.state.userStore.isValidToken)
            router.go(0)
          } else {
            console.log("토큰 받아오기 오류");
          }
        },
        async (error) => {
          console.log(error);
          console.log(accessToken);
          console.log(refreshToken);
          localStorage.clear();
          router.push({ name: "LoginView" });
        }
      )
    }
  },
  
}
const accessToken = localStorage.getItem("access-token");
const refreshToken = localStorage.getItem("refresh-token");
const userinfo = JSON.parse(localStorage.getItem("userinfo"));
const sentmessages = JSON.parse(localStorage.getItem("sentmessages"));
const receivedmessages = JSON.parse(localStorage.getItem("receivedmessages"));
const shareid = JSON.parse(localStorage.getItem("shareid"));

if (accessToken && refreshToken) {
  userStore.state.isLogin = true;
  userStore.state.isValidToken = true;
}
if (userinfo) {
  userStore.state.userInfo = userinfo;
}
if (sentmessages) {
  userStore.state.sentmessages = sentmessages;
}
if (receivedmessages) {
  userStore.state.receivedmessages = receivedmessages;
}
if (shareid) {
  userStore.state.shareid = shareid;
}


export default userStore;

