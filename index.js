const token = localStorage.getItem("token");

// Redirect if no token (not logged in)
if (!token) {
  window.location.href = "index.html";
}

function createGreenSlot(data) {
  slotsContainer = document.getElementById("slotsContainer");
  toAppend = document.createElement("div");
  toAppend.classList.add("is-one-third");
  toAppend.classList.add("m-2");
  toAppend.classList.add("p-3");
  toAppend.innerHTML = `
    <article class="message is-success">
          <div class="message-header is-size-5">
            <p>Time Slot</p>
          </div>
          <div class="message-body has-text-centered  ">
            <p class="is-size-4">
                ${data["timings"]}
            </p>
            <div class="my-2">
                <div class="columns">
                    <div class="column">
                        <button class="button is-success is-fullwidth" onclick='bookSlotModal("${data["timings"]}")'>Book Appointment</button>
                    </div>
                </div>
            </div>
          </div>
        </article>
    `;
  slotsContainer.appendChild(toAppend);
}

function createRedSlot(data) {
  slotsContainer = document.getElementById("slotsContainer");
  toAppend = document.createElement("div");
  toAppend.classList.add("is-one-third");
  toAppend.classList.add("m-2");
  toAppend.classList.add("p-3");

  if (data["booked"] == localStorage.getItem("userName")) {
    toAppend.innerHTML = `
    <article class="message is-danger">
          <div class="message-header is-size-5">
            <p>Time Slot</p>
          </div>
          <div class="message-body has-text-centered  ">
            <p class="is-size-4">
                ${data["timings"]}
            </p>
            <div class="my-2">
                <div class="columns">
                    <div class="column">
                        <button class="button is-danger is-fullwidth " onclick='cancelSlotModal("${data["timings"]}")'>Cancel Appointment</button>
                    </div>
                </div>
            </div>
          </div>
        </article>
    `;
  } else {
    toAppend.innerHTML = `
    <article class="message is-danger">
          <div class="message-header is-size-5">
            <p>Time Slot</p>
          </div>
          <div class="message-body has-text-centered  ">
            <p class="is-size-4">
                ${data["timings"]}
            </p>
            <div class="my-2">
                <div class="columns">
                    <div class="column">
                        <button class="button is-danger is-fullwidth is-disabled is-dark" >Slot Booked By Another User</button>
                    </div>
                </div>
            </div>
          </div>
        </article>
    `;
  }

  slotsContainer.appendChild(toAppend);
}

fetch("http://localhost:5000/slots")
  .then((res) => res.json())
  .then((data) => {
    for (index in data) {
      if (data[index]["booked"] == null) {
        createGreenSlot(data[index]);
      } else {
        createRedSlot(data[index]);
      }
    }
  });

function bookSlotModal(slot) {
  document.getElementById("bookConfirmBody").innerHTML = `
          
          <button class="button is-success is-fullwidth m-2 " onclick="bookSlot('${slot}')" id="modalBookBtn">Book Appointment</button>

          `;
  document.getElementById("modalBook").classList.add("is-active");
}

function cancelSlotModal(slot) {
  document.getElementById("cancelConfirmBody").innerHTML = `
    
          
          <button class="button is-danger is-fullwidth m-2 " onclick="cancelSlot('${slot}')" id="modalCancelBtn">Cancel Appointment</button>

          `;
  document.getElementById("modalCancel").classList.add("is-active");
}

function bookSlot(slot) {
  fetch("http://localhost:5000/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      timeSlot: slot,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data[0] == 200) {
        document.getElementById("modalBookSuccess").classList.add("is-active");
        setTimeout(() => {
          window.location.href = "/slots.html";
        }, 3000);
      } else {
        document.getElementById("modalBookFail").classList.add("is-active");
      }
    });
}

function cancelSlot(slot) {
  fetch("http://localhost:5000/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      timeSlot: slot,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data[0] == 200) {
        document
          .getElementById("modalCancelSuccess")
          .classList.add("is-active");
        setTimeout(() => {
          window.location.href = "/slots.html";
        }, 3000);
      } else {
        if (data[0] == 401) {
          document.getElementById("cancelFailBody").innerText =
            "You Are Not Authorized to Perfom This Action! Appointment NOT Cancelled.";
          document.getElementById("modalCancelFail").classList.add("is-active");
        } else {
          document.getElementById("cancelFailBody").innerText =
            "Authentication Error, Try Logging In Again !";
          document.getElementById("modalCancelFail").classList.add("is-active");
        }
      }
    });
}
