function loginFunc() {
  let userName = document.getElementById("userNameInput").value;
  let passwd = document.getElementById("passwdInput").value;

  if (userName != "" || passwd != "") {

      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          passwd: passwd
        }),
      })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
          if (data[0] != 500) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', userName);

                document.getElementById("modalAuthPass").classList.add("is-active");
                setTimeout(() => {
                    window.location.href = "/slots.html"
                }, 3000)

          }else{
                document.getElementById("modalAuthFail").classList.add("is-active");
          }
        });
    
  } else {
    document.getElementById("userNameInput").classList.add("is-danger");
    document.getElementById("passwdInput").classList.add("is-danger");
    document.getElementById("error").classList.remove("is-hidden");
  }
}
