import Geocode from 'react-geocode';

require('dotenv').config();

/*
*  name: fetchAreas function
*  use: Fetch Forces from API - referred to as Areas
*/
export const fetchAreas = function(cb){

  var apiUrl = "https://data.police.uk/api/forces";
  console.log(apiUrl);
  //--- fetching data and issuing callback function to pass data to parent ---
  fetch(apiUrl)
    .then((response) =>{
        return response.json();
    })
    .then((data) =>{
      cb(data);
    });
}


/*
*  name: getCoords function
*  use: get coordinates for supplied area through Google API
*/
export const getCoords = function(area,cb){

  //--- setting Google Geocoder ---
  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API);
  Geocode.setLanguage("en");
  Geocode.setRegion("uk");

  //--- getting coordinates ---
  Geocode.fromAddress(area)
    .then(
      (response) => {
        var coords = [response.results[0].geometry.location.lat,response.results[0].geometry.location.lng];
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


/*
*  name: fetchCrimeCategories function
*  use: Fetch crime categories from Police API
*/
export const fetchCrimeCategories = function(cb){
  var apiUrl = "https://data.police.uk/api/crime-categories";

  //--- fetch data from API ---
  fetch(apiUrl)
    .then((response) =>{
      return response.json();
    })
    .then((data =>{
      cb(data)
    }));
}


/*
*  name: fetchCrimes function
*  use: Fetching crimes based on category, lat, long and date
*/
export const fetchCrimes = function(lat,long,type,date,cb){
  console.log("given coords: ", lat, long);
  var apiUrl = "https://data.police.uk/api/crimes-street/"+type+"?lat="+lat+"&lng="+long+"&date="+date;

  //--- fetching data ---
  fetch(apiUrl)
    .then((response)=>{
      return response.json();
    })
    .then((data=>{
      cb(data)
    }));
}
