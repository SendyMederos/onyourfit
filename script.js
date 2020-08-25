// jQuery.ajaxPrefilter(function(options) {
//     if (options.crossDomain && jQuery.support.cors) {
//         options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
//     }
// });

var lon;
var lat;
var city;

// $(".currentLocation").on("click", function () {
//     event.stopPropagation();

//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(position);
//         lat = position.coords.latitude;
//         lon = position.coords.longitude;
//     } else {
//         alert("Geolocation is not supported by this browser.");
//     }
//     console.log(lat)
//     console.log(lon)
//     console.log("llllllll")
//     var trailsURL = "https://www.hikingproject.com/data/get-trails?lat="+ lat + "&" + lon + "&maxDistance=10&key=200880336-4b1739fed679fe7233ad0872e74e7fcd"
//     $.ajax({
//         url: trailsURL,
//         method: "getTrails"
//       }).then(function(response) {
//         console.log(response)

//       }) 

// })

$('#submit').click(function () {
    city = $("#search-bar").val();
    console.log(city);
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=420fa54141903a76b9ac423622e9920d`
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        lat = response.coord.lat
        lon = response.coord.lon
        console.log(lat)
        console.log(lon)

        var trailsURL = `https://www.hikingproject.com:443/data/get-trails?lat=${lat}&lon=${lon}&key=200880336-4b1739fed679fe7233ad0872e74e7fcd`
        console.log(trailsURL)
        $.ajax({
            url:  trailsURL,
            method: "GET"
            
        }).then(function (response) {
            console.log(response) 
            for (i = 0; i < response.trails.length; i++ ){
                $(".displayBox").append(`<div id = "displayAll${i}" class="card"></div>`)
                $(`#displayAll${i}`).append(`<h4> ${response.trails[i].name} </h4>`)
                $(`#displayAll${i}`).append(`<img src="${response.trails[i].imgSqSmall}" class="images">`)
                $(`#displayAll${i}`).append(`<p> Length:  ${response.trails[i].length} milles </p>`)
                $(`#displayAll${i}`).append(`<p> ${response.trails[i].summary} </p>`)

            }

        })
    })
})




