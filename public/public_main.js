const we = [];
var week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const week_temp = [];
var city_input = document.getElementById("city_input_field");
var searchbtn = document.getElementById("button-addon2");

//left-box
var todaytemptop = document.getElementById("temp_orig_val");
var todayicontop = document.getElementById("weather_icon");
var citynameleft = document.getElementById("city_orig_val");
var todayweatherstatustop = document.getElementById("weather_orig_status");

var weather_icon_list = {
  Cloudy: "images/weather_pngs/cloudy_64.png",
  Clear: "images/weather_pngs/clear_64.png",
  Sunny: "images/weather_pngs/sun_64.png",
  Rainy: "images/weather_pngs/rainy_64.png",
};

var setLeft = (a, b, c, d) => {
  console.log(a + "," + b + "," + c + "," + d);
  todaytemptop.innerText = `${a}`;
  if (b == "Clouds") todayicontop.src = `${weather_icon_list.Cloudy}`;
  else if (b == "Clear") todayicontop.src = `${weather_icon_list.Clear}`;
  else if (b == "Rain") todayicontop.src = `${weather_icon_list.Rainy}`;
  else todayicontop.src = `${weather_icon_list.Sunny}`;

  citynameleft.innerText = `${c}`;
  todayweatherstatustop.innerText = `${d}`;
};

//right-box
var citynameright = document.getElementById("city_orig_right_info");
var datetop = document.getElementById("date_orig_info");
var daytop = document.getElementById("day_orig_val");
var timetop = document.getElementById("time_orig_val");

var precip = document.getElementById("precip");
var humid = document.getElementById("humid");
var wind = document.getElementById("wind");
var feelslike = document.getElementById("feelslike");

//card variables
var card_weather_icons = document.getElementsByClassName('weather_card_image');
var card_weather_status = document.getElementsByClassName('weather_card_orig_status');
var card_weather_days = document.getElementsByClassName('day_card_orig_status');
var card_temp_vals = document.getElementsByClassName('temp_card_orig_status');


var setRight = (a, b, c, d, e, f, g, h) => {
  citynameright.innerText = `${a}`;
  datetop.innerText = `${b}`;
  daytop.innerText = `${c}`;
  timetop.innerText = `${d}`;

  precip.innerText = `${e}`;
  humid.innerText = `${f}`;
  wind.innerText = `${g}`;
  feelslike.innerText = `${h}`;
};
var getCurrDay = ()=>{
  var today = new Date();
  var dd = today.getDate();
  if(dd<10) dd='0'+dd;
  var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  var mm = month[today.getMonth()]; 
  var yyyy = today.getFullYear();
  return yyyy+"-"+mm+"-"+dd;
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

 var makePage= async (city_name)=>{
  console.log("Entered fn");
  var url = `http://api.openweathermap.org/data/2.5/forecast?q=${city_name}&units=metric&appid=c37b2e28e4ba848436ebd3c55e6ebb80`;
  const response = await fetch(url);
  const data = await response.json();

  console.log(data);
  //getting array of weather data of continous six days
  var dt_val = "0000-0";
  we.splice(0, we.length);
  data.list.map((obj) => {
    var first_of_date_txt = obj.dt_txt.split(" ");
    if (!(first_of_date_txt[0].localeCompare(dt_val) == 0)) {
      dt_val = first_of_date_txt[0];
      we.push(obj);
    }
  });
  const city_orig_details = data.city.name + "," + data.city.country;

  console.log(we);
  // console.log(we);

  //setting left-box values
  setLeft(
    we[0].main.temp,
    we[0].weather[0].main,
    city_orig_details,
    we[0].weather[0].main
  );

  //setting right-box values
  var d = new Date();
  
  var n = week[d.getDay()]
  
  setRight( city_orig_details,getCurrDay(),n,formatAMPM(d),we[0].main.pressure,we[0].main.humidity,we[0].wind.speed,we[0].main.feels_like);

  for(var i=0 ; i<we.length ; i++){
    if (we[i].weather[0].main == "Clouds") card_weather_icons[i].src = `${weather_icon_list.Cloudy}`;
    else if (we[i].weather[0].main == "Clear") card_weather_icons[i].src = `${weather_icon_list.Clear}`;
    else if (we[i].weather[0].main == "Rain") card_weather_icons[i].src = `${weather_icon_list.Rainy}`;
    else card_weather_icons[i].src = `${weather_icon_list.Sunny}`;

    card_weather_status[i].innerText = `${we[i].weather[0].main}`;

    card_weather_days[i].innerText =  `${week[(d.getDay()+i)%7]}`;

    card_temp_vals[i].innerText = `${we[i].main.temp}`
  }
  
  //-------------------get max-temp and min-temp from the API--------------------------//
  var index = -1;
  var dt_tracer = '0000'
  week_temp.splice(0, we.length);
  data.list.map((obj) => {
    if(obj.dt_txt.split(" ")[0]!=dt_tracer){
      index+=1;
      dt_tracer = obj.dt_txt.split(" ")[0];
      var min_temp = obj.main.temp_min;
      var max_temp = obj.main.temp_max;
      week_temp.push([min_temp,max_temp]);
    }
    else{
      if(obj.main.temp_min<=week_temp[index][0]){
        week_temp[index][0] = obj.main.temp_min;
      }
      else{
        week_temp[index][1] = obj.main.temp_max;
      }
    }
  });
  console.log(week_temp);


  //------------chart work---------------------//
  broken_array= [].concat(...week_temp);
  max_temp_in_whole_array = Math.max.apply(null, broken_array);
  console.log(max_temp_in_whole_array);
  var chart = new CanvasJS.Chart("chartContainer", {            
    title:{
      text: "Weekly Weather Forecast"              
    },
    axisY: {
      suffix: " °C",
      maximum: max_temp_in_whole_array+3,
      gridThickness: 0
    },
    toolTip:{
      shared: true,
      content: "{name} </br> <strong>Temperature: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
    },
    data: [{
      type: "rangeSplineArea",
      fillOpacity: 0.1,
      color: "#91AAB1",
      indexLabelFormatter: formatter,
      dataPoints: [
        { label: `${week[(d.getDay()+0)%7]}`, y: [week_temp[0][0],week_temp[0][1]], name: `${we[0].weather[0].main}`},
        { label: `${week[(d.getDay()+1)%7]}`, y: [week_temp[1][0],week_temp[1][1]], name: `${we[1].weather[0].main}`},
        { label: `${week[(d.getDay()+2)%7]}`, y: [week_temp[2][0],week_temp[2][1]], name: `${we[2].weather[0].main}`},
        { label: `${week[(d.getDay()+3)%7]}`, y: [week_temp[3][0],week_temp[3][1]], name: `${we[3].weather[0].main}`},
        { label: `${week[(d.getDay()+4)%7]}`, y: [week_temp[4][0],week_temp[4][1]], name: `${we[4].weather[0].main}`},
        { label: `${week[(d.getDay()+5)%7]}`, y: [week_temp[5][0],week_temp[5][1]], name: `${we[5].weather[0].main}`}
      ]
    }]
  });
  chart.render();
  
  var images = [];    
  
  addImages(chart);
  
  function addImages(chart) {
    for(var i = 0; i < chart.data[0].dataPoints.length; i++){
      var dpsName = chart.data[0].dataPoints[i].name;
      if(dpsName == "Clouds"){
        images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png"));
      } else if(dpsName == "Rain"){
      images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png"));
      } else{
        images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png"));
      }

    images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
    positionImage(images[i], i);
    }
  }
  
  function positionImage(image, index) {
    var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
    var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
  
    image.width("40px")
    .css({ "left": imageCenter - 20 + "px",
    "position": "absolute","top":imageTop + "px",
    "position": "absolute"});
  }
  
  $( window ).resize(function() {
    var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
    var imageCenter = 0;
    for(var i=0;i<chart.data[0].dataPoints.length;i++) {
      imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
      if(chart.data[0].dataPoints[i].name == "Clouds") {					
        $(".Clouds").eq(cloudyCounter++).css({ "left": imageCenter});
      } else if(chart.data[0].dataPoints[i].name == "Rain") {
        $(".Rain").eq(rainyCounter++).css({ "left": imageCenter});  
      } else {
        $(".Clear").eq(sunnyCounter++).css({ "left": imageCenter});  
      }                
    }
  });
  
  function formatter(e) { 
    if(e.index === 0 && e.dataPoint.x === 0) {
      return " Min " + e.dataPoint.y[e.index] + "°";
    } else if(e.index == 1 && e.dataPoint.x === 0) {
      return " Max " + e.dataPoint.y[e.index] + "°";
    } else{
      return e.dataPoint.y[e.index] + "°";
    }
  } 
  


}



// ----------------------when search button clicked------------------------//
searchbtn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (city_input.value === "") {
    alert("Enter complete details of city");
  } else {
    try {
      var url = `http://api.openweathermap.org/data/2.5/forecast?q=${city_input.value}&units=metric&appid=c37b2e28e4ba848436ebd3c55e6ebb80`;
      const response = await fetch(url);
      const data = await response.json();

      //getting array of weather data of continous six days
      var dt_val = "0000-0";
      we.splice(0, we.length);
      data.list.map((obj) => {
        var first_of_date_txt = obj.dt_txt.split(" ");
        if (!(first_of_date_txt[0].localeCompare(dt_val) == 0)) {
          dt_val = first_of_date_txt[0];
          we.push(obj);
        }
      });
      const city_orig_details = data.city.name + "," + data.city.country;

      console.log(we);
      // console.log(we);

      //setting left-box values
      setLeft(
        we[0].main.temp,
        we[0].weather[0].main,
        city_orig_details,
        we[0].weather[0].main
      );

      //setting right-box values
      var d = new Date();
      
      var n = week[d.getDay()]
      
      setRight( city_orig_details,getCurrDay(),n,formatAMPM(d),we[0].main.pressure,we[0].main.humidity,we[0].wind.speed,we[0].main.feels_like);

      for(var i=0 ; i<we.length ; i++){
        if (we[i].weather[0].main == "Clouds") card_weather_icons[i].src = `${weather_icon_list.Cloudy}`;
        else if (we[i].weather[0].main == "Clear") card_weather_icons[i].src = `${weather_icon_list.Clear}`;
        else if (we[i].weather[0].main == "Rain") card_weather_icons[i].src = `${weather_icon_list.Rainy}`;
        else card_weather_icons[i].src = `${weather_icon_list.Sunny}`;

        card_weather_status[i].innerText = `${we[i].weather[0].main}`;

        card_weather_days[i].innerText =  `${week[(d.getDay()+i)%7]}`;

        card_temp_vals[i].innerText = `${we[i].main.temp}`
      }
      
      //-------------------get max-temp and min-temp from the API--------------------------//
      var index = -1;
      var dt_tracer = '0000'
      week_temp.splice(0, we.length);
      data.list.map((obj) => {
        if(obj.dt_txt.split(" ")[0]!=dt_tracer){
          index+=1;
          dt_tracer = obj.dt_txt.split(" ")[0];
          var min_temp = obj.main.temp_min;
          var max_temp = obj.main.temp_max;
          week_temp.push([min_temp,max_temp]);
        }
        else{
          if(obj.main.temp_min<=week_temp[index][0]){
            week_temp[index][0] = obj.main.temp_min;
          }
          else{
            week_temp[index][1] = obj.main.temp_max;
          }
        }
      });
      console.log(week_temp);


      //------------chart work---------------------//
      broken_array= [].concat(...week_temp);
      max_temp_in_whole_array = Math.max.apply(null, broken_array);
      console.log(max_temp_in_whole_array);
      var chart = new CanvasJS.Chart("chartContainer", {            
        title:{
          text: "Weekly Weather Forecast"              
        },
        axisY: {
          suffix: " °C",
          maximum: max_temp_in_whole_array+3,
          gridThickness: 0
        },
        toolTip:{
          shared: true,
          content: "{name} </br> <strong>Temperature: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
        },
        data: [{
          type: "rangeSplineArea",
          fillOpacity: 0.1,
          color: "#91AAB1",
          indexLabelFormatter: formatter,
          dataPoints: [
            { label: `${week[(d.getDay()+0)%7]}`, y: [week_temp[0][0],week_temp[0][1]], name: `${we[0].weather[0].main}`},
            { label: `${week[(d.getDay()+1)%7]}`, y: [week_temp[1][0],week_temp[1][1]], name: `${we[1].weather[0].main}`},
            { label: `${week[(d.getDay()+2)%7]}`, y: [week_temp[2][0],week_temp[2][1]], name: `${we[2].weather[0].main}`},
            { label: `${week[(d.getDay()+3)%7]}`, y: [week_temp[3][0],week_temp[3][1]], name: `${we[3].weather[0].main}`},
            { label: `${week[(d.getDay()+4)%7]}`, y: [week_temp[4][0],week_temp[4][1]], name: `${we[4].weather[0].main}`},
            { label: `${week[(d.getDay()+5)%7]}`, y: [week_temp[5][0],week_temp[5][1]], name: `${we[5].weather[0].main}`}
          ]
        }]
      });
      chart.render();
      
      var images = [];    
      
      addImages(chart);
      
      function addImages(chart) {
        for(var i = 0; i < chart.data[0].dataPoints.length; i++){
          var dpsName = chart.data[0].dataPoints[i].name;
          if(dpsName == "Clouds"){
            images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png"));
          } else if(dpsName == "Rain"){
          images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png"));
          } else{
            images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png"));
          }

        images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
        positionImage(images[i], i);
        }
      }
      
      function positionImage(image, index) {
        var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
        var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
      
        image.width("40px")
        .css({ "left": imageCenter - 20 + "px",
        "position": "absolute","top":imageTop + "px",
        "position": "absolute"});
      }
      function  func() {
        var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
        var imageCenter = 0;
        for(var i=0;i<chart.data[0].dataPoints.length;i++) {
          imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
          if(chart.data[0].dataPoints[i].name == "Clouds") {					
            $(".Clouds").eq(cloudyCounter++).css({ "left": imageCenter});
          } else if(chart.data[0].dataPoints[i].name == "Rain") {
            $(".Rain").eq(rainyCounter++).css({ "left": imageCenter});  
          } else {
            $(".Clear").eq(sunnyCounter++).css({ "left": imageCenter});  
          }                
        }
      }
      $( window ).resize(func());
      setInterval(func,10)
      function formatter(e) { 
        if(e.index === 0 && e.dataPoint.x === 0) {
          return " Min " + e.dataPoint.y[e.index] + "°";
        } else if(e.index == 1 && e.dataPoint.x === 0) {
          return " Max " + e.dataPoint.y[e.index] + "°";
        } else{
          return e.dataPoint.y[e.index] + "°";
        }
      } 
    } catch {
      alert("city not exist");
    }
  }
});
