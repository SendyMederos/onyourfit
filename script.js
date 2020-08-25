// jQuery.ajaxPrefilter(function(options) {
//     if (options.crossDomain && jQuery.support.cors) {
//         options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
//     }
// });
//global scope variables
var trailsURL;
var lon;
var lat;
var city;
var trailsLength;
/// geolocation access
$(".currentLocation").on("click", function () {
    event.stopPropagation();
    //if they accept to share their location then run showPosition
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        alert("Geolocation is not supported by this browser.");
    }
})
// once permited we can access to the location to get the lat and lon
// pass this parameters to trailsURL 
function showPosition(position) {
    lat = position.coords.latitude.toFixed(4);
    lon = position.coords.longitude.toFixed(4);
    trailsURL = `https://www.hikingproject.com:443/data/get-trails?lat=${lat}&lon=${lon}&key=200880336-4b1739fed679fe7233ad0872e74e7fcd`
    console.log(trailsURL)
    renderTrails();

}
// 
$('#submit').click(function () {
    city = $("#search-bar").val();
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
        trailsURL = `https://www.hikingproject.com:443/data/get-trails?lat=${lat}&lon=${lon}&key=200880336-4b1739fed679fe7233ad0872e74e7fcd`
        console.log(trailsURL)
        renderTrails();

    })
})
//})

function renderTrails() {

    $.ajax({
        url: trailsURL,
        method: "GET"

    }).then(function (response) {
        trailsLength = response.trails.length;
        $(".displayBox").empty();
        console.log(response)
        for (i = 0; i < trailsLength; i++) {
            $(".displayBox").append(`<div id = "displayAll${i}"></div>`)
            $(`#displayAll${i}`).attr("class", "card")
            
           var trailname =  $("<h4> ")
            $(trailname).html(response.trails[i].name)
            $(`#displayAll${i}`).append(trailname)

            var trailimage = $("<img>")     
            $(trailimage).attr("src", response.trails[i].imgSqSmall)
            $(trailimage).attr("class", "images")
            $(`#displayAll${i}`).append(trailimage)

            var trailLength =  $("<p> ")
            $(trailLength).html(response.trails[i].length + "miles")
            $(`#displayAll${i}`).append(trailLength)

          //  $(`#displayAll${i}`).append(`<p> Length:  ${response.trails[i].length} milles </p>`)
          
            var trailsummary =  $("<i> ")
            $(trailsummary).html(response.trails[i].summary)
            $(`#displayAll${i}`).append(trailsummary)

          //$(`#displayAll${i}`).append(`<p> ${response.trails[i].summary} </p>`)

        }
    })
} 

