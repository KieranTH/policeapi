import Geocode from 'react-geocode';
      //--- Could be structured as Class to reduce re-init of requestArray[] ---
      export const runFetch = function(request,cb){
        var force = "durham";
        var lat = "0";
        var long = "0";

        var requestArray = [
          "https://data.police.uk/api/forces",
          "https://data.police.uk/api/forces/"+force,
          "https://data.police.uk/api/crimes-street/all-crime?lat="+lat+"&lng="+long,
        ];

        var apiUrl = "";
        //console.log(request);
        var r;
        switch(request)
        {
          case "forces":
            apiUrl = requestArray[0];
            break;
          case "specificForce":
            apiUrl = requestArray[1]
            break;
          case "allCrime":
            apiUrl = requestArray[2];
            break;
        }
        console.log(apiUrl);
        fetch(apiUrl)
          .then((response) =>{
              return response.json();
          })
          .then((data) =>{
            cb(data);
          });
      }

      export const getCoords = function(area,cb){
        Geocode.setApiKey("AIzaSyD91S88Y9ikYoY-LVX2mwhic6h_-bFJXvw");
        Geocode.setLanguage("en");
        Geocode.setRegion("uk");

        Geocode.fromAddress(area)
          .then(
            (response) => {
              //console.log(response.results[0].geometry.location);
              var coords = [response.results[0].geometry.location.lat,response.results[0].geometry.location.lng];
              //console.log("coords: ",coords);
              return coords;
            },
            (error) =>{
              console.error(error);
            }
          )
          .then((data) =>{
            cb(data);
          });
      }
