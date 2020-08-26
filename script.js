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
$("#currentLocation").on("click", function () {
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
function createAside (){
    
}
function renderTrails() {
    createAside();
    $.ajax({
        url: trailsURL,
        method: "GET"

    }).then(function (response) {
      
        $(".splash-container").empty();
        console.log(response)
        $(".splash-container").append(`<section id= "displayBox" class="container"></section>`)
        $("#displayBox").append(`<div id= "displayBox1"class="row"></div>`)
        let x = 1
        for (i = 0; i < response.trails.length - 1; i++) {
            if (i===3){
                $("#displayBox").append(`<div id= "displayBox2"class="row"></div>`)
                x=2
            }
            if (i===6){
                $("#displayBox").append(`<div id= "displayBox3"class="row"></div>`)
                x=3
            }

            $(`#displayBox${x}`).append(`<div id = "displayAll${i}"></div>`)
            $(`#displayAll${i}`).attr("class", "card col")
            $(`#displayAll${i}`).attr("data-position", i)
           // NAME 
           var trailname =  $("<h3> ")
            $(trailname).html(response.trails[i].name)
            $(`#displayAll${i}`).append(trailname)
            // IMG SM SQ
            var trailimage = $("<img>")     
            $(trailimage).attr("src", response.trails[i].imgSqSmall)
            $(trailimage).attr("class", "images")
            $(`#displayAll${i}`).append(trailimage)
            // LENGTH
            var trailLength =  $("<p> ")
            $(trailLength).html(response.trails[i].length + "miles")
            $(`#displayAll${i}`).append(trailLength)

          //  $(`#displayAll${i}`).append(`<p> Length:  ${response.trails[i].length} milles </p>`)
            // SUMMARY
            var trailsummary =  $("<i> ")
            $(trailsummary).html(response.trails[i].summary)
            $(`#displayAll${i}`).append(trailsummary)

          //$(`#displayAll${i}`).append(`<p> ${response.trails[i].summary} </p>`)

        }
    })
} 

function eachtrail() {

    $.ajax({
        url: trailsURL,
        method: "GET"

    }).then(function (response) {
        trailsLength = response.trails.length;
        $(".displayBox").empty();
        console.log(response)
        
            $(".displayBox").append(`<div id = 'display'></div>`)
            $('#display').attr("class", "card")
            // NAME
           var trailname =  $("<h4> ")
            $(trailname).html(response.trails[i].name)
            $(`#display`).append(trailname)
            //RATTINGS
            var trailratting  =  $("<p> ")
            $(trailratting).html(response.trails[i].difficulty)
            $(`#display`).append(trailratting)
            // IMG MED 
            var trailimage = $("<img>")     
            $(trailimage).attr("src", response.trails[i].imgMedium)
            $(trailimage).attr("class", "images")
            $(`#display`).append(trailimage)
            // DIFFICULTY
            var traildifficulty =  $("<p> ")
            $(traildifficulty).html(response.trails[i].difficulty)
            $(`#display`).append(traildifficulty)
            // ACSENDING
            var trailascending =  $("<p> ")
            $(trailascending).html(response.trails[i].ascent)
            $(`#display`).append(trailascending)
            // DESCENDING
            var traildescending =  $("<p> ")
            $(traildescending).html(response.trails[i].descent)
            $(`#display`).append(traildescending)
            // LENGTH
            var trailLength =  $("<p> ")
            $(trailLength).html(response.trails[i].length + "miles")
            $(`#display`).append(trailLength)
            // SUMMARY
            var trailsummary =  $("<i> ")
            $(trailsummary).html(response.trails[i].summary)
            $(`#display`).append(trailsummary)

    })
}