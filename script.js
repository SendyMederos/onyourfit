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
var whatTrail;
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

    //  THIS IS MAP
    var map = L.map('mapid')
    map.setView([lat, lon], 13)
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic2ZvcmQ0MTg2IiwiYSI6ImNrZWJsYmR2aTAwOWgycXF0Z2luYW5yYWYifQ.8ySHyDgtKaAj9wJU_AZV4A'
    }).addTo(map);
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup("<b>You Are Here</b>").openPopup();
    // var marker5 = L.marker([response.trails[1].latitude, response.trails[1].longitude]).addTo(map);
    // marker5.bindPopup(response.trails[1].name).openPopup();
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
// function createAside (){

//     $("#main-row").append(`<aside id= "aside" class="grid-col-4"></aside>`)
//     $("#aside").append("<h3> Find more Trails: <h3>")
//     $("#aside").append('<input type="text" id="search-bar" placeholder="By City Name"> ')   
//     $("#aside").append('<a class="pure-button pure-button-primary" id = "submit"><i class="fa fa-search"></i>Search by City</a><br>')
//     $("#aside").append('<a class="pure-button pure-button-primary" id = "currentLocation">NEAR YOU </a>')
//     $("#aside").append('<ul class="list" id = "list"> </ul>')
//     $("#list").append('<li></li>')
//     $("#list").append('<li></li>')
//     $("#list").append('<li></li>')
//     $("#list").append('<li></li>')
//     $("#list").append('<li></li>')
//     $("#list").append('<li></li>')
//     $("#list").append('<li></li>')
//     $("#list").append('<li></li>')
// }



function renderTrails() {
    $(".splash-container").empty();
    $(".splash-container").append(`<div id= "main-row"class="grid-row"></div>`)
    //createAside ();
    $.ajax({
        url: trailsURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        $("#main-row").append(`<div id= "main-col"class="grid-col-8"></div>`)
        $("#main-col").append(`<section id= "displayBox"></section>`)
        $("#displayBox").append(`<div id= "displayBox1"class="row card-row"></div>`)
        let x = 1
        for (i = 0; i < response.trails.length - 1; i++) {
            if (i === 3) {
                $("#displayBox").append(`<div id= "displayBox2"class="row card-row"></div>`)
                x = 2
            }
            if (i === 6) {
                $("#displayBox").append(`<div id= "displayBox3"class="row card-row"></div>`)
                x = 3
            }

            $(`#displayBox${x}`).append(`<div id = "displayAll${i}"></div>`)
            $(`#displayAll${i}`).attr("class", "card col")
            $(`#displayAll${i}`).attr("data-position", i)
            // NAME 
            var trailname = $("<h4> ")
            $(trailname).html(response.trails[i].name)
            $(trailname).attr("id", i)
            $(`#displayAll${i}`).append(trailname)
            // IMG SM SQ
            var trailimage = $("<img>")
            $(trailimage).attr("src", response.trails[i].imgSqSmall)
            $(trailimage).attr("class", "images")
            $(trailimage).attr("id", i)
            $(`#displayAll${i}`).append(trailimage)
            // LENGTH
            var trailLength = $("<p> ")
            $(trailLength).html(response.trails[i].length + "miles")
            $(`#displayAll${i}`).append(trailLength)

            //  $(`#displayAll${i}`).append(`<p> Length:  ${response.trails[i].length} milles </p>`)
            // SUMMARY
            var trailsummary = $("<i> ")
            $(trailsummary).html(response.trails[i].summary)
            $(`#displayAll${i}`).append(trailsummary)

            //$(`#displayAll${i}`).append(`<p> ${response.trails[i].summary} </p>`)

        }
        $(".images").click(function (event) {
            event.stopPropagation()
            event.preventDefault()
            whatTrail = event.target.id;
            eachtrail();
        })

    })

}



function eachtrail() {

    $.ajax({
        url: trailsURL,
        method: "GET"

    }).then(function (response) {
        trailsLength = response.trails.length;
        $("#displayBox").empty();
        console.log(response)

        $("#displayBox").append(`<div id = 'display'></div>`)
        $('#display').attr("class", "uniquecard")
        // NAME
        var trailname = $("<h4> ")
        $(trailname).html(response.trails[whatTrail].name)
        $(`#display`).append(trailname)
        //RATTINGS
        var trailratting = $("<p> ")
        $(trailratting).html("Rating: " + response.trails[whatTrail].stars)
        $(`#display`).append(trailratting)
        // IMG MED 
        var trailimage = $("<img>")
        $(trailimage).attr("src", response.trails[whatTrail].imgSmallMed)
        $(trailimage).attr("class", "images")
        $(`#display`).append(trailimage)
        // DIFFICULTY
        var traildifficulty = $("<p> ")
        $(traildifficulty).html(response.trails[whatTrail].difficulty)
        $(`#display`).append(traildifficulty)
        // ACSENDING
        var trailascending = $("<p> ")
        $(trailascending).html("Ascending: " + response.trails[whatTrail].ascent + "feet")
        $(`#display`).append(trailascending)
        // DESCENDING
        var traildescending = $("<p> ")
        $(traildescending).html("Descending: " + response.trails[whatTrail].descent + "feet")
        $(`#display`).append(traildescending)
        // LENGTH
        var trailLength = $("<p> ")
        $(trailLength).html("Trail length: " + response.trails[whatTrail].length + "miles")
        $(`#display`).append(trailLength)
        // SUMMARY
        var trailsummary = $("<i> ")
        $(trailsummary).html(response.trails[whatTrail].summary)
        $(`#display`).append(trailsummary)

    })
}