$(document).ready(async function () {
  const locations = await getLocations();
  addMarkers(locations);
});

$(document).on("click", ".navbar-right .dropdown-menu", function (e) {
  e.stopPropagation();
});

async function addLocation() {
  try {
    const data = {
      name: document.getElementById("name").value,
      photo: document.getElementById("photo").value,
      openHours: document.getElementById("openHours").value,
      storeUrl: document.getElementById("storeUrl").value,
      location: {
        coordinates: [
          document.getElementById("longitud").value,
          document.getElementById("latitud").value,
        ],
      },
    };

    document.getElementById("name").value = "";
    document.getElementById("photo").value = "";
    document.getElementById("openHours").value = "";
    document.getElementById("longitud").value = "";
    document.getElementById("latitud").value = "";
    document.getElementById("storeUrl").value = "";

    const res = await axios({
      method: "POST",
      url: "/api/v1/geodata",
      data: data,
    });
    if (res.data.status === "success") {
      document.getElementById("success").innerHTML =
        "Sucessfully added location ";
      location.reload();
    }
  } catch (e) {
    console.log(e);
  }
}

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      window.setTimeout(() => {
        location.assign("/api/v1/admin");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
  }
};

const loginForm = document.querySelector(".form--login");

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

var mymap = L.map("map").setView([60.48638, 15.41533], 15);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  maxZoom: 16,
}).addTo(mymap);

L.control.mousePosition().addTo(mymap);
L.control.scale().addTo(mymap);

async function addMarkers(locations) {
  for (var i in locations) {
    let marker = new L.marker([
      locations[i].location.coordinates[0],
      locations[i].location.coordinates[1],
    ]).addTo(mymap);
    const weatherData = await getFromApi(locations[i].weatherData);

    const numTheft = await getFromApi(
      "https://polisen.se/api/events?type=st%C3%B6ld&locationname=" +
        locations[i].name +
        "&datetime=2021"
    );

    marker.bindPopup(
      "<h5>" +
        locations[i].name +
        "</h5>" +
        '<p style="margin:0 !important;"><b>Öppettider:</b> ' +
        locations[i].openHours +
        "</p>" +
        '<img style="width:175px;max-height:120px;overflow:hidden" src="' +
        locations[i].photo +
        '" class="photo">' +
        '<br><b><p style="margin:0 !important;">Väder: ' +
        weatherData.main.temp +
        " °C</b></p>" +
        "<p style='margin:0 !important;' ><b>Antal stölder i området <br> detta år:</b> " +
        numTheft.length +
        "</p>" +
        '<a href="' +
        locations[i].storeUrl +
        '">Gå till butikens webbplats!</a><br>' +
        '<button class="btn btn-danger" onclick="addBusStops(' +
        locations[i].location.coordinates[0] +
        "," +
        locations[i].location.coordinates[1] +
        ')">Hitta busshållsplats!</button>'
    );
  }
}

function addBusStops(lat, lng) {
  $.getJSON(
    "https://api.resrobot.se/v2/location.nearbystops?key=6a45c5f6-e1a6-4e62-b395-861cff7af1af&originCoordLat=" +
      lat +
      "&originCoordLong=" +
      lng +
      "&format=json",
    (data) => {
      $.each(data.StopLocation, (idx, element) => {
        let busIcon = L.icon({
          iconUrl:
            "https://icon-library.com/images/google-maps-bus-icon/google-maps-bus-icon-25.jpg",
          iconSize: [60, 60],
        });
        let marker = L.marker([element.lat, element.lon], {
          icon: busIcon,
        }).addTo(mymap);
        marker.on("click", (e) => {
          let deptTime = "";
          $.getJSON(
            "https://api.resrobot.se/v2/departureBoard?key=4900478d-08d2-462d-bed0-19b6093c4782&id=" +
              element.id +
              "&maxJourneys=1&format=json",
            (data) => {
              marker
                .bindPopup(
                  data.Departure !== void 0
                    ? "<h6>" +
                        data.Departure[0].Stops.Stop[0].name +
                        "</h6><p style='margin:0 !important;'>Avgång: " +
                        data.Departure[0].Stops.Stop[0].depTime +
                        "</p>"
                    : "<h6 class=" +
                        "text-danger" +
                        ">" +
                        "NO BUS DATA AVAILABLE" +
                        "</h6>"
                )
                .openPopup();
            }
          );
        });
      });
    }
  );
}

mymap.on("click", function (e) {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  document.getElementById("longitud").value = lat;
  document.getElementById("latitud").value = lng;
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

async function getFromApi(url) {
  try {
    const res = await axios({
      method: "GET",
      url: url,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
}

async function logout() {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    if ((res.data.status = "success")) {
      window.setTimeout(() => {
        location.assign("/api/v1/home");
      }, 1500);
    }
  } catch (err) {
    console.log(err.response);
  }
}

async function getLocations() {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/geodata/all",
    });
    if (res.data.status === "success") {
      return res.data.data.data;
    }
  } catch (e) {
    console.log(e);
  }
}

function showTable() {
  if (document.getElementById("myTable").style.display === "block") {
    document.getElementById("myTable").style.display = "none";
    document.getElementById("myTable").style.opacity = 0;
    document.getElementById("myTable").style.visibility = "hidden";
    document.getElementById("showTableBtn").innerHTML = "Hantera butiker";
  } else {
    document.getElementById("myTable").style.display = "block";
    document.getElementById("myTable").style.opacity = 1;
    document.getElementById("myTable").style.visibility = "visible";
    document.getElementById("showTableBtn").innerHTML = "Göm tabell";
  }
}

async function deleteStore(id) {
  try {
    const res = await axios({
      method: "DELETE",
      url: "/api/v1/geodata/" + id,
    });
    location.reload();
  } catch (e) {
    console.log(e);
  }
}

async function updateGeo(id) {
  try {
    const geoData = {
      name: document.getElementById("name" + id).value,
      openHours: document.getElementById("openHours" + id).value,
      storeUrl: document.getElementById("storeUrl" + id).value,
      photo: document.getElementById("photo" + id).value,
    };
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/geodata/update/" + id,
      data: geoData,
    });
    location.reload();
  } catch (e) {
    console.log(e);
  }
}
