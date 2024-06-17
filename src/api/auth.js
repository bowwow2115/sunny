import store from "@/store";
import Utils from "@/utils/utils";
import * as api from "@/api/api";

function parseToken(result, reset = false) {
  if (result.data[0]) {
    let ticketId = result.data[0].accessToken;
    let lang = "ko";
    if (ticketId) {
      Utils.setCookie("auth", ticketId, 3600, "/");
      Utils.setCookie("lang", lang);
      Utils.setCookie("refreshToken", result.data[0].refreshToken);
      Utils.setCookie(
        "loginedUserAuthCode",
        result.data[0].loginedUserAuthCode
      );

      const user = result.data[0];

      store.commit("setUser", user);
      store.commit("setTicket", ticketId);
    }
  }
}

function loggedIn() {
  return new Promise((resolve, reject) => {
    let url = "";
    const sid = Utils.getCookie(constants.TOKEN);
    if (sid != null && sid !== "") url = `/sunny/auth/validation?sid=${sid}`;
    if (url !== "") {
      api
        .ax()
        .get(url)
        .then((response) => {
          //console.log("loggedIn Check : ", response);
          //parseToken(response.data, true);
          if (response.data.code == "0") {
            resolve();
          } else if (response.data.code == "EXPIRED-TOKEN") {
            Utils.deleteCookie("auth", "/");
            Utils.deleteCookie("lang");

            router.push({
              path: "/login",
              query: { redirect: vue.$route.fullPath },
            });
            if (window.validateHandle) {
              clearInterval(window.validateHandle);
              window.validateHandle = null;
            }
          } else {
            reject(new Error("validation failure"));
          }
        })
        .catch((error) => {
          if (error.response) reject(new Error(error.response.data));
          else reject(new Error("validation failure"));
        });
    } else {
      reject(new Error("No cookie"));
    }
  });
}

function renewJWT() {
  return new Promise((resolve, reject) => {
    let url = "";
    url = "/auth/json/jwt/renew";
    if (url !== "") {
      api
        .ax()
        .get(url)
        .then((response) => {
          parseToken(response.data, true);
          resolve();
        })
        .catch((error) => {
          reject(new Error("renew failure"));
        });
    } else {
      reject(new Error("No cookie"));
    }
  });
}

function login(user, password) {
  let data = null;

    data = {
      userId: Utils.tripleDESenc(user),
      password: Utils.tripleDESenc(password),
    };


  return new Promise((resolve, reject) => {
    api
      .postUrl(`/sunny/login`, jQuery.param(data), false)
      .then((r) => {
        //console.log("login call : ", r);
        if (r.code != "0") {
          reject(r.code);
          return;
        } else if (r.code == "0" && r.data[0].errcode != null) {
          reject(r.data[0]);
        } else {
          parseToken(r);
          resolve(r.data[0]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function logout(user) {
  let data = {
    refreshToken: Utils.getCookie("refreshToken"),
    userId: user,
  };

  api
    .postUrl("/sunny/logout", jQuery.param(data), false)
    .then((response) => {
      if (response.data) console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

  // clear store
  store.dispatch("resetState");

  Utils.deleteCookie("auth", "/");
  Utils.deleteCookie("JSESSIONID", "/");
  Utils.deleteCookie("refreshToken", "/");

  Utils.deleteCookie("lang");

  location.href = Utils.checkEnv(process.env.NODE_ENV);
  window.location.reload();
}

function resetPwdate(user) {
  let data = {
    userId: user,
  };

  return new Promise((resolve, reject) => {
    api
      .postUrl(`/sunny/resetPwdate`, jQuery.param(data), false)
      .then((r) => {
        resolve(r);
      })
      .catch((error) => {
        alert(error.response);
        reject(error);
      });
  });
}

function changePassword(passwordForm) {
  const key = "exAdm1111"; // Utils.featuresDefault('security.key', '');
  let data = null;

  if (key) {
    data = {
      method: "AES",
      userId: Utils.tripleDESenc(passwordForm.userId),
      currentPwd: Utils.tripleDESenc(passwordForm.currentPwd),
      newPwd: Utils.tripleDESenc(passwordForm.newPwd),
    };
  } else {
    data = {
      userId: passwordForm.userId,
      currentPwd: passwordForm.currentPwd,
      newPwd: passwordForm.newPwd,
    };
  }

  return new Promise((resolve, reject) => {
    api
      .postUrl(`/sunny/changePw`, jQuery.param(data), false)
      .then((r) => {
        resolve(r);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default {
  loggedIn,
  login,
  logout,
  renewJWT,
  resetPwdate,
  changePassword,
};
