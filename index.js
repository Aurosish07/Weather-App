import express from "express"
import axios from "axios"
import bodyParser from "body-parser";

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 1 }));

app.get("/", (req, res) => {

  res.sendFile("public/index.html");

})

let lat;
let long;
app.post("/loc", (req, res) => {
  lat = req.body.latitude;
  long = req.body.longitude;
  res.redirect("/loc");

});


app.get("/loc", async (req, res) => {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=577a56ab41c4d905ee1fd19fcc68945b`);

  //{
  //all days at 0 , 2 , 10 , 18 , 26

  //   const day1 = response.data.list[0];
  //   const day2 = response.data.list[2];
  //   const day3 = response.data.list[10];
  //   const day4 = response.data.list[3];

  //   const cityname = response.data.city.name;
  //   const country = response.data.city.country;

  //   const temp1 = Math.round(day1.main.temp - 271.13);
  //   const pressure1 = day1.main.pressure;
  //   const humidity1 = day1.main.humidity;
  //   const desc1 = day1.weather[0].description;
  //  const wind = day1.wind.speed * 3.6;
  //  }

  const temp = Math.round(response.data.main.temp - 271.13);
  const desc = response.data.weather[0].description;
  const pressure = response.data.main.pressure;
  const humidity = response.data.main.humidity;
  const visibility = response.data.visibility / 1000;
  const wind = Math.round(response.data.wind.speed * 3.6);
  const country = response.data.sys.country;
  const name = response.data.name;
  const sunset = new Date(response.data.sys.sunset * 1000);
  const sunrise = new Date(response.data.sys.sunrise * 1000);
  const icon = response.data.weather[0].icon;
  const lastChar = icon.charAt(icon.length - 1);

  const set = sunset.toLocaleTimeString("en-US");
  const rise = sunrise.toLocaleTimeString("en-US");


  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let week = days[date.getDay()];

  // Format the month to be 2 digits
  if (month < 10) {
    month = '0' + month;
  }
  // Format the day to be 2 digits
  if (day < 10) {
    day = '0' + day;
  }

  let fullDate = `${day} ${month} ${year}`;

  console.log(fullDate);
  console.log(rise);
  console.log(set);
  console.log(lastChar)
  // console.log(temp1);                                 
  // console.log(humidity1);                  
  // console.log(desc1);             
  // console.log(cityname);            
  // console.log(country);
  // console.log(pressure1);       
  //for ejs :- {temp1:temp1  , humi1:humidity1 , desc1:desc1 , press1:pressure1 , wind:wind }       


  res.render("index.ejs", { Full: fullDate, week: week, city: name, coun: country, temp1: temp, humi1: humidity, desc1: desc, press1: pressure, wind: wind, visiable: visibility, set: set, rise: rise, last: lastChar });
});


app.post("/manual", async (req, res) => {
  console.log(req.body);
  const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${req.body.city}&limit=1&appid=577a56ab41c4d905ee1fd19fcc68945b`);
  if (response.data.length == 0) {
    res.send("city not found plz enter locally known citys");

  } else {
    console.log(response.data[0].name);
    console.log(response.data[0].lon);
    console.log(response.data[0].lat);

    lat = response.data[0].lat;
    long = response.data[0].lon;
    res.redirect("/loc");


  }
})

app.listen(port, () => {
  console.log("app is listening on the port ", port);
})


//api request :- https://api.openweathermap.org/data/2.5/weather?lat=20.212469698144766&lon=86.01421937049788&appid=577a56ab41c4d905ee1fd19fcc68945b