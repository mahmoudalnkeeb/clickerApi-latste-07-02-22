'use strict'

window.addEventListener('load', () => {
  let selectCities = document.getElementById('cities'); 
  let clicks = 0;
  let cityHasBeenSelected = false;
  let citiesOfTheCountry = [];
    //Get info about visitor
     fetch("https://ipinfo.io/json?token=c3376073e3f554").then(
        (response) => response.json()
      ).then(
        (jsonResponse) => {
          sessionStorage.setItem("ip", jsonResponse.ip);
          sessionStorage.setItem("country", jsonResponse.country);
          sessionStorage.setItem("city", 0);
          sessionStorage.setItem("clicks", 0);
          document.querySelector('.Group_6').style.display = "none";
          document.querySelector('.city').style.display = "none";
          document.querySelector('.Topcity').style.display = "none";
        } 
      )  


      
      setInterval(() => {
        //Get info about visitor Country and statistics
      let GetCountryAPI = 'http://api.webuzy.com/api/country/' + sessionStorage.getItem('country'); 
      fetch(GetCountryAPI)
      .then((response) => response.json())
      .then((data) => {
          document.getElementById('country_details').innerText = data.clicks + " : " + data.name;
      })
    //Get info about Total
    let GetAllAPI = 'http://api.webuzy.com/api/all'; 
    fetch(GetAllAPI)
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('TotalClicks').innerText = data.clicks;
    })
    //Get info about all Country and statistics
    let GetAll = 'http://api.webuzy.com/api/top'; 
    fetch(GetAll)
    .then((response) => response.json())
    .then((data) => {
        let top = data.sort((a,b) => {
            return b.country_clicks - a.country_clicks;
        });
        document.getElementById('top').innerText = top[0].country_clicks + " : " + top[0].country_name;
        
        let ul = document.getElementById('mobile-ul');
        while(ul.firstChild){
          ul.firstChild.remove();
        }
        for (let index = 0; index < 3; index++) {
          let li = document.createElement('li');
          li.id = top[index].country_code;
          if (index === 0) {
            li.innerHTML = top[index].country_name + '  : ' + top[index].country_clicks + '  <i class="fas fa-crown gold"></i>' ;
            }          
            if (index === 1) {
              li.innerHTML = top[index].country_name + '  : ' + top[index].country_clicks  + '  <i class="fas fa-crown silver"></i>';
              }          
              if (index === 2) {
                li.innerHTML = top[index].country_name + '  : ' + top[index].country_clicks  + '  <i class="fas fa-crown bronze"></i>';
                }
          li.className = " list-item";
          ul.appendChild(li);
        }
        for (let index = 3; index < 20; index++) {
          if (top[index].country_code !== null) {
            let li = document.createElement('li');
            li.id = top[index].country_code;
            li.innerHTML = top[index].country_name + '  : ' + top[index].country_clicks;
            li.className = " list-item";
            ul.appendChild(li);
          }
        }
      });
    //Get info about city and statistics
    if (cityHasBeenSelected) {
      let citySelected = selectCities.options[selectCities.selectedIndex].id;
      let GetCityAPI = 'http://api.webuzy.com/api/visitorCity/' + citySelected; 
      fetch(GetCityAPI)
      .then((response) => response.json())
      .then((data) => {
          document.getElementById('state').innerText = data.city_clicks + " : " + data.city_name;
      })


      let GetAllAPI = 'http://api.webuzy.com/api/country-cities/' + sessionStorage.getItem('country'); 
      fetch(GetAllAPI)
      .then((response) => response.json())
      .then((data) => {
        let top = data.sort((a,b) => {
          return b.city_clicks - a.city_clicks;
      });
      
      let ul = document.getElementById('mobile-ul-cities');
      while(ul.firstChild){
        ul.firstChild.remove();
      }
      for (let index = 0; index < 3; index++) {
        let li = document.createElement('li');
        li.id = top[index].city_clicks;
        if (index === 0) {
          li.innerHTML = top[index].city_name + '  : ' + top[index].city_clicks + '  <i class="fas fa-crown gold"></i>' ;
          }          
          if (index === 1) {
            li.innerHTML = top[index].city_name + '  : ' + top[index].city_clicks  + '  <i class="fas fa-crown silver"></i>';
            }          
            if (index === 2) {
              li.innerHTML = top[index].city_name + '  : ' + top[index].city_clicks  + '  <i class="fas fa-crown bronze"></i>';
              }
        li.className = " list-item";
        ul.appendChild(li);
      }
      for (let index = 3; index < 20; index++) {
        if (top[index].city_name !== null) {
          let li = document.createElement('li');
          li.id = top[index]._id;
          li.innerHTML = top[index].city_name + '  : ' + top[index].city_clicks;
          li.className = " list-item";
          ul.appendChild(li);
        }
      }
      });
   
    }
      }, 1000);

      let GetAllAPI = 'http://api.webuzy.com/api/country-cities/' + sessionStorage.getItem('country'); 
      fetch(GetAllAPI)
      .then((response) => response.json())
      .then((data) => {
          data.forEach(element => {
            let option = document.createElement('option');
            option.id = element._id;
            option.value = element.city_name;
            option.innerText = element.city_name;
            selectCities.appendChild(option);
            citiesOfTheCountry = data;
            if (citiesOfTheCountry.length > 0) {
              document.querySelector('.Group_6').style.display = "block";
              document.querySelector('.city').style.display = "flex";
              document.querySelector('.Topcity').style.display = "flex";
          }
          });
      })
      

    selectCities.addEventListener('change', () => {
      let citySelected = selectCities.options[selectCities.selectedIndex].id;
      let GetCityAPI = 'http://api.webuzy.com/api/visitorCity/' + citySelected; 
      fetch(GetCityAPI)
      .then((response) => response.json())
      .then((data) => {
          sessionStorage.setItem('city', data._id);
          cityHasBeenSelected = true;
          document.getElementById('state').innerText = data.city_clicks + " : " + data.city_name;
      })
    });

      //Start for new visitor
      let StartAPI = 'http://api.webuzy.com/api/start';
                  fetch(StartAPI,
                      {
                          method: "POST",
                          body: JSON.stringify({
                                  "ip": sessionStorage.getItem('ip'),
                                  "country": sessionStorage.getItem('country'),
                                  "city": sessionStorage.getItem('city'),
                                  "clicks": 1
                                }),
                          headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json'
                          }
                      })
                      .then(((response) => response.json()))
                      .then((data) => {
                        document.getElementById('clicks').innerText = 0;
                    })

      //Get Ahadith from Api and set it into a variable
      let Ahadith; 
      fetch("https://hadeethenc.com/api/v1/hadeeths/list/?language=ar&category_id=313&page=1&per_page=30", 
      {method: "GET"})
      .then(((response) => response.json()))
      .then((data) => {
        Ahadith = data;
    })             
    



      //Add one Click evry time visitor clicks
      let counterForChangeHadith = 0;
      document.getElementById('click').addEventListener('click', () => {
      clicks++;
      let before = sessionStorage.getItem('clicks');
      let after = parseInt(before) + 1;
      sessionStorage.setItem('clicks', after);
      document.getElementById('clicks').innerText = after;
      
      if (sessionStorage.getItem('clicks') % 100 == 0) {
        var playPromise = document.querySelector('#audio100').play();
        document.getElementById('hadit').classList.add('animation');
        // In browsers that don’t yet support this functionality,
        // playPromise won’t be defined.
        if (playPromise !== undefined) {
          playPromise.then(function() {
            // Automatic playback started!
          }).catch(function(error) {
            // Automatic playback failed.
            // Show a UI element to let the user manually start playback.
          });
        }
      }else if (sessionStorage.getItem('clicks') % 20 == 0) {
        document.getElementById('hadit').innerText = Ahadith.data[counterForChangeHadith].title
        document.getElementById('hadit').classList.add('animation');
        if (counterForChangeHadith === 29) {
          counterForChangeHadith =0;
        }
        counterForChangeHadith++;
      }  
        
      let clickBtn =  document.getElementById("click");
      clickBtn.disabled = true;
      clickBtn.style.backgroundColor = "#b5b3b3";
      clickBtn.style.cursor = "not-allowed";

      setTimeout(function(){
        clickBtn.disabled = false;
        clickBtn.style.backgroundColor = "hsl(353, 100%, 73%)";
        clickBtn.style.cursor = "pointer";
    },500);
        
      });


      let open = false;
      document.querySelector('.Topcountry').addEventListener('click', () => {

        let ulMobile = document.getElementById('mobile-ul');
                if (open) {
                  ulMobile.style.transform  = "translateY(-100%)";
                  if (citiesOfTheCountry.length > 0) {
                    document.querySelector('#Topcities').style.display = 'flex'
                  }
                  document.querySelector('.DarkMode').style.display = 'block'
                  open = false;
                }else{
                  document.querySelector('#Topcities').style.display = 'none';
                  ulMobile.style.transform  = "translateY(0)";
                  document.querySelector('.DarkMode').style.display = 'none';
                    open = true;
                }
          });

          document.querySelector('#Topcities').addEventListener('click', () => {
            if (cityHasBeenSelected) {
              let ulMobile = document.getElementById('mobile-ul-cities');
              if (open) {
                ulMobile.style.transform  = "translateY(-100%)";
                if (citiesOfTheCountry.length > 0) {
                  document.querySelector('.Topcountry').style.display = 'flex'
                }
                open = false;

              }else{
                 if (citiesOfTheCountry.length > 0) {
                  document.querySelector('.Topcountry').style.display = 'none'
                }
                ulMobile.style.transform  = "translateY(0)";
                  open = true;
              }
            }else{
              window.alert('اختر محافضك او اقليمك لمشاهدة الاحصائيات')
            }
        });



        setInterval(() => {
          let ClickAPI = 'http://api.webuzy.com/api/click';

  async function postData() {
    // Default options are marked with *
    const response = await fetch(ClickAPI, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://api.webuzy.com'
      },
      body: JSON.stringify({
        "ip": sessionStorage.getItem('ip'),
        "country": sessionStorage.getItem('country'),
        "city": sessionStorage.getItem('city'),
        "clicks": clicks
      }), // body data type must match "Content-Type" header
    });
  }

  postData();
  clicks = 0;
        }, 5000);



        let isDark = false;
        document.querySelector('.DarkMode').addEventListener('click', () => {
          let container = document.getElementsByTagName("BODY")[0];
          let Topcountry = document.querySelector('.Topcountry'); 
          let block = document.querySelector('.block'); 
          let topic = document.querySelector('.n__200000_t'); 
          let click = document.querySelector('#click'); 
          let bg1 = document.querySelector('.bg1'); 
          let root = document.querySelector(':root');

          if (isDark) {
            container.classList.remove('Maindark');
            Topcountry.classList.remove("iconDark");
            block.classList.remove("SecondDark");
            topic.classList.remove("SecondDark");
            click.classList.remove("buttonDark");
            document.querySelector('.DarkMode').classList.remove("SecondDark");
            root.style.setProperty('--mainBackground', '#c8ee87');
            bg1.src = "imgs/bg.webp";
            isDark = false;
          }else{
            container.className += " Maindark";
            Topcountry.className += " iconDark";
            block.className += " SecondDark";
            topic.className += " SecondDark";
            click.className += " buttonDark";
            root.style.setProperty('--mainBackground', '#1f1d36');
            document.querySelector('.DarkMode').className += " SecondDark";
            bg1.src = "imgs/01.webp";
            isDark = true;
          }

        });
});

