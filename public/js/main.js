$(document).on("click", ".navbar-right .dropdown-menu", function (e) {
  e.stopPropagation();
});

var mymap = L.map("map").setView([60.48638, 15.41533], 15);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  maxZoom: 16,
}).addTo(mymap);

L.control.scale().addTo(mymap);

// !! Gör Lat och Lng via inputs
let lat = "60.48638";
let lng = "15.41533";
$.getJSON(
  "https://api.resrobot.se/v2/location.nearbystops?key=4c20d6ff-2b49-4579-ab47-77dbd669b425&originCoordLat=" +
    lat +
    "&originCoordLong=" +
    lng +
    "&format=json",
  (data) => {
    $.each(data.StopLocation, function (idx, element) {
      let marker = L.marker([element.lat, element.lon]).addTo(mymap);
      marker.on("click", (e) => {
        let deptTime = "";
        $.getJSON(
          "https://api.resrobot.se/v2/departureBoard?key=4900478d-08d2-462d-bed0-19b6093c4782&id=" +
            element.id +
            "&maxJourneys=1&format=json",
          (data) => {
            deptTime = data.Departure[0].Stops.Stop[0].depTime;
            busstopName = data.Departure[0].Stops.Stop[0].name;
            document.getElementById("nextbus").innerHTML +=
              "<li>" + busstopName + " kl " + deptTime + "</li>";
          }
        );
      });
    });
  }
);
// function fuckyou(cunt1, cunt2) {
//   L.marker([cunt1, cunt2]).addTo(mymap);
// }
mymap.on("click", function (e) {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  //   fuckyou(lat, lng);
  $.getJSON(
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lng +
      "&appid=582e149fb362e1b98b83ade7442b13a2",
    (data) => {
      console.log(data);
    }
  );
});

//

// https://api.resrobot.se/v2/location.nearbystops?key=6a45c5f6-e1a6-4e62-b395-861cff7af1af&originCoordLat={60.48356}&originCoordLong={15.43845}&format=json

//
// http://dev.virtualearth.net/REST/v1/Routes/LocalInsights?waypoint={coordinate_or_query}&maxTime={MaxTime}&timeUnit=minutes&type={type_string_ids}&key=AmJA0CkI1piCN3h6JkEuiNRzZt_Jqqw_pvekGJd5GD15Aa6nZeLhDI5O9ydhB65I

// http://dev.virtualearth.net/REST/v1/Routes/LocalInsights?waypoint=60.48609,15.42952&maxTime=300&type=Shop&key=AmJA0CkI1piCN3h6JkEuiNRzZt_Jqqw_pvekGJd5GD15Aa6nZeLhDI5O9ydhB65I
