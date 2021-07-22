import Geocode from 'react-geocode';
      //--- Could be structured as Class to reduce re-init of requestArray[] ---
      export const fetchAreas = function(cb){

        var apiUrl = "https://data.police.uk/api/forces";
        //console.log(request);
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

      export const fetchCrimeCategories = function(cb){
        var apiUrl = "https://data.police.uk/api/crime-categories";

        fetch(apiUrl)
          .then((response) =>{
            return response.json();
          })
          .then((data =>{
            cb(data)
          }));
      }

      export const fetchCrimes = function(lat,long,type,date,cb){
        console.log("given coords: ", lat, long);
        var apiUrl = "https://data.police.uk/api/crimes-street/"+type+"?lat="+lat+"&lng="+long+"&date="+date;

        fetch(apiUrl)
          .then((response)=>{
            return response.json();
          })
          .then((data=>{
            cb(data)
          }));
      }
