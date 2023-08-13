async function GetAccountInfo(){
  email = document.getElementById("email").value
  const password_input = document.getElementById("password_input").value
  password = sha256(password_input)
  account_id = document.getElementById("account_id").value
  Get_Token()
}

async function Login() {
  var login_Headers = new Headers();
  login_Headers.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    "email": email,
    "password": password,
    "longer": true
  });

  var login_requestOptions = {
    method: 'POST',
    headers: login_Headers,
    body: raw,
    redirect: 'follow'
  };

  const login_Response = await fetch('https://aliyundrive.pro/api/v1/auth/login',login_requestOptions)
  const data = await login_Response.json()
  return data
}

async function Get_Token(){
  await Login().then(data => {
    login_Token = data.data.session.access_token
  });
  await Singn(login_Token)
}

async function Singn(login_token){
  var Singn_Headers = new Headers();
  Singn_Headers.append("Authorization", login_token);

  var raw = "";

  var Singn_requestOptions = {
    method: 'POST',
    headers: Singn_Headers,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://aliyundrive.pro/api/v2/accounts/"+ account_id +"/signin", Singn_requestOptions)
  .then(function(response) {
    if(response.status == 200){
      alert(response.status + " Succeed");
   }
    else{
      fetch("https://aliyundrive.pro/api/v1/accounts/"+ account_id +"/signin", Singn_requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        alert(" Failed, please check the DevTools")
      })
    }
    })
}
