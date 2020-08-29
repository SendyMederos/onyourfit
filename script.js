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


/// Get geolocation access 
$("#currentLocation").on("click", function () {
    event.stopPropagation();
    //if they accept to share their location then run getPosition
    if (navigator.geolocation) {
        //renderTrails()
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
})

//Gathers coordinates of user's current location to render the trails
function getPosition(position) {
    console.log(position)
    lat = position.coords.latitude.toFixed(4);
    lon = position.coords.longitude.toFixed(4);
    trailsURL = `https://www.hikingproject.com:443/data/get-trails?lat=${lat}&lon=${lon}&key=200880336-4b1739fed679fe7233ad0872e74e7fcd`
    renderTrails()
}

// once permited we can access to the location to get the lat and lon
// pass this parameters to trailsURL 
function showPosition(lat, lon, name) {

    console.log(trailsURL)

    // Used mapbox and leaflet javascript library to get map and marker
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
    marker.bindPopup(`<b>${name}</b>`).openPopup();

    // renderTrails();
}

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

//This function renders an array of trails based on the users current location or a city of their choice
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
            $(`#displayAll${i}`).attr("class", "card col trailCard")
            // $(`#displayAll${i}`).attr("data-position", i)
            $(`#displayAll${i}`).attr("data-trailId", response.trails[i].id)
            // NAME 
            var trailname = $("<h4> ")
            $(trailname).html(response.trails[i].name)
            $(trailname).attr("id", i)
            $(`#displayAll${i}`).append(trailname)
            // IMG SM SQ
            var trailimage = $("<img>")
            $(trailimage).attr("src", response.trails[i].imgSqSmall)
            $(trailimage).attr("class", "images")
            // $(trailimage).attr("id", i)
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

    })

}


//When a specific "trailCard" is clicked inside of the splash-container,  render the ID of that specific trail.
$(".splash-container").on("click", ".trailCard", function (event) {
    event.stopPropagation()
    event.preventDefault()
    console.log($(this).attr('data-trailId'))
    whatTrail = $(this).attr('data-trailId');
    eachtrail(whatTrail);
})


//This function passes in the specific clicked trailID and returns info on the specified trail
//Used Pure CSS framework for grid layout for map 
function eachtrail(trailID) {

    $.ajax({
        url: `https://www.hikingproject.com/data/get-trails-by-id?ids=${trailID}&key=200880336-4b1739fed679fe7233ad0872e74e7fcd`,
        method: "GET"

    }).then(function (response) {
        trailsLength = response.trails.length;
        $("#displayBox").empty();
        console.log(response, "<====")
        console.log(response.trails[0].latitude)
        $("#displayBox").append(`<div id = 'display'></div>`)
        $('#display').attr("class", "uniquecard")
        // NAME
        var trailname = $("<h4> ")
        $(trailname).html(response.trails[0].name)
        $(`#display`).append(trailname)
        //RATTINGS
        var trailratting = $("<p> ")
        $(trailratting).html("Rating: " + response.trails[0].stars)
        $(`#display`).append(trailratting)
        // IMG MED 
        var topGrid = $("<div class='pure-g'>")
        var trailimage = $("<img class='pure-u-md-1-2 images'>")
        $(trailimage).attr("src", response.trails[0].imgSmallMed)

        ///MAP
        var mapSpan = $("<div class='map pure-u-md-1-2' id='mapid'>")
        $(topGrid).append(trailimage, mapSpan)
        $('#display').append(topGrid)

        //WEATHER
        $("#display").append(`<div id = "allweather" class = "mainweather " > </div>`);

        // DIFFICULTY
        var traildifficulty = $("<p> ")
        $(traildifficulty).html(response.trails[0].difficulty)
        $(`#display`).append(traildifficulty)
        // ACSENDING
        var trailascending = $("<p> ")
        $(trailascending).html("Ascending: " + response.trails[0].ascent + "feet")
        $(`#display`).append(trailascending)
        // DESCENDING
        var traildescending = $("<p> ")
        $(traildescending).html("Descending: " + response.trails[0].descent + "feet")
        $(`#display`).append(traildescending)
        // LENGTH
        var trailLength = $("<p> ")
        $(trailLength).html("Trail length: " + response.trails[0].length + "miles")
        $(`#display`).append(trailLength)
        // SUMMARY
        var trailsummary = $("<i> ")
        $(trailsummary).html(response.trails[0].summary)
        $(`#display`).append(trailsummary)
        showPosition(response.trails[0].latitude, response.trails[0].longitude, response.trails[0].name)


        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&" + "lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=420fa54141903a76b9ac423622e9920d"

        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then(function (response1) {
            console.log(response1)


            var nextdays = ["Today", "Tomorrow", "After_Tomorrow"]
            for (i = 0; i <= 2; i++) {
                iconCode = response1.daily[i].weather[0].icon;
                iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
                $("#allweather").append(`<div id = "${nextdays[i]}" class = "weather card1" > </div>`);
                $(`#${nextdays[i]}`).append(`<h5> ${nextdays[i]} <img src = "${iconUrl}" class="icon">  </h5>`)
                $(`#${nextdays[i]}`).append(`<h6><i>${moment(response1.daily[i].dt * 1000).format("ddd,  MMMM DD")}<i></h6>`);
                $(`#${nextdays[i]}`).append(`<p>Temp: ${response1.daily[i].temp.day}°F</p>`);
                $(`#${nextdays[i]}`).append(`<p>Humidity: ${response1.daily[i].humidity}%</p>`);
            }
        })
    })
}

