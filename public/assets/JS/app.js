'use strict'

window.addEventListener('load',() => {
  //let ws = new WebSocket('https://thepraise.onrender.com:5000');
  let socket = io.connect("localhost:3000");

  const showRank = document.querySelector(".show_rank");
  const rankList = document.querySelector(".rank");
  const modeToggler = document.querySelector(".toggle_mode");
  const body = document.querySelector("body");
  const container = document.querySelector(".container");
  let clicks = 0;
  let darkMode = false;
  let info;

      //Get info about visitor
      fetch("https://ipinfo.io/json?token=c3376073e3f554").then(
        (response) => response.json()
      ).then(
        (jsonResponse) => {
          sessionStorage.setItem("ip", jsonResponse.ip);
          sessionStorage.setItem("country", jsonResponse.country);
          sessionStorage.setItem("city", 0);
          sessionStorage.setItem("clicks", 0);
        } 
        
      );
    
      //Add one Click evry time visitor clicks
      document.getElementById('click').addEventListener('click', () => {
      clicks++;
      let before = sessionStorage.getItem('clicks');
      let after = parseInt(before) + 1;
      sessionStorage.setItem('clicks', after);
      document.getElementById('clicks').innerText = after;
        
      let clickBtn =  document.getElementById("click");
      clickBtn.disabled = true;
      clickBtn.style.backgroundColor = "#b5b3b3";
      clickBtn.style.cursor = "not-allowed";

      setTimeout(function(){
        clickBtn.disabled = false;
        clickBtn.style.cursor = "pointer";
        if (darkMode) {
          clickBtn.style.backgroundColor = "rgba(14, 14, 14, 0.7)";
        }else{
          clickBtn.style.backgroundColor = "#2d4a3f";
        }
    },500);
        
      });
  
  showRank.addEventListener("click", () => {
    rankList.classList.toggle("show");
    
  });

  modeToggler.addEventListener("click", () => {
    body.classList.toggle("dark");
    container.classList.toggle("cover");
    if (modeToggler.innerHTML != `<i class="fas fa-toggle-on fa-lg"></i>`) {
      modeToggler.innerHTML = `<i class="fas fa-toggle-on fa-lg"></i>`;
      darkMode = true;
    } else {
      modeToggler.innerHTML = `<i class="fas fa-toggle-off fa-lg"></i>`;
      darkMode = false;
    }
  });


  function init() {
    info = {
      type: "start",
      user_ip: sessionStorage.getItem('ip'),
      user_country: sessionStorage.getItem('country'),
      user_clicks:  0,
      user_city: sessionStorage.getItem('city'),
    }

    document.querySelector('.counter').innerText = 0;
    socket.emit("start", JSON.stringify(info));
  }
  init();

  

  click.addEventListener('click', () => {
    info = {
      type: "click",
      user_ip: sessionStorage.getItem('ip'),
      user_country: sessionStorage.getItem('country'),
      user_clicks:  1,
      user_city: sessionStorage.getItem('city'),
    }
    socket.emit("click", JSON.stringify(info));
  })



  //Get info about Total Clicks
  socket.on("TotalClicks", (information) => {
    document.getElementById('TotalClicks').innerText = JSON.parse(information).clicks;
  });

  //Get info about User country and user country clicks
  socket.on("UserCountry", (information) => {
    document.querySelector('.country').innerText = JSON.parse(information).name;
    document.getElementById('country_clicks').innerText = JSON.parse(information).clicks;
  });

  socket.on("Countries", (information) => {
    let ul = document.querySelector('.top_list');
    let top = JSON.parse(information).Countries;
    while(ul.firstChild){
      ul.firstChild.remove();
    }

    top.forEach(item => {
      if (item.country_name != undefined || item.country_name != null) {
        let li = document.createElement('li');
        li.id = item.country_code;
        li.innerHTML = item.country_name + '  : ' + item.country_clicks;
        li.className = " list-item";
        ul.appendChild(li);
      }
    });
  });


    setInterval(() => {
      socket.send(JSON.stringify({type: "update", user_country: sessionStorage.getItem('country')}));
    }, 1000);




// client-side
socket.on("info", (arg) => {
  console.log(arg); // world
});



});




