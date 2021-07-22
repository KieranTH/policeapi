import React from 'react'

import Form from '../Form/Form';
import ClickableArea from '../ClickableArea/ClickableArea';

import './Data.css';

import {fetchAreas, getCoords, fetchCrimeCategories, fetchCrimes} from '../APIController/APIController.js'

//var geocoder = require('google-geocoder');

import Geocode from 'react-geocode';


class Data extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      returnSearch: false,
      items: this.props.areas,
      filteredArea: [],
      queryType: "forces",
      coordinates: [],
      crimeCategories: [],
      crimesPerArea: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
      this.setState({
        returnSearch: true
      })
  }

  componentDidMount(){
    /*var geo = geocoder({
      key: "AIzaSyD91S88Y9ikYoY-LVX2mwhic6h_-bFJXvw"
    })

    geo.find(this.props.searchedArea + "England", function(err,res){
      console.log(res[0].location.lat);
    })*/

    /*fetchAreas((data=>{
      this.setState({
      items: data});
    }));*/

    fetchCrimeCategories((data =>{
      this.setState({
        crimeCategories: data
      })
      console.log(this.state.crimeCategories);
    }));

    /*if(this.state.items.length)
    {
      this.timerID = setInterval(() => this.filterAreas(), 2000);
    }*/

    this.filterAreas();


    //this.timerID = setInterval(() => this.tick(), 1000);

    //this.timerID = setInterval(() => this.tick(), 1000);

    //google-api key: AIzaSyBpYCo621EaMVylQP_phTYvQGK3OkqTGjY
    /*fetch("https://data.police.uk/api/forces")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        (error) =>{
          this.setState({
            isLoaded: true,
            error
          });
        }
      )*/


  }

  filterAreas(){
    console.log("test",this.state.items);

    var items = this.state.items;

    var areas = [];

    var keys = [];

    var test = Object.keys(items);

    for(var i = 0; i<items.length;i++)
    {
      items[i] = {... items[i], lat: "lat", long: "long"};
      Object.keys(items[i]).forEach(function(key)
      {
        if(keys.indexOf(key) == -1)
        {
          keys.push(key);
        }
      });

      //--- looking for police force from given area ---
      if(items[i].id.includes(this.props.area))
      {
        if(this.props.area.length != 0)
        {
          areas.push(items[i]);
          //console.log(areas[i]);
        }
      }
    }

    console.log(areas);

    //--- setting filtered areas ---
    this.setState({
      filteredArea: areas
    });

    //console.log("Areas set!: ", areas);


    //--- if items have not been fetched yet ---
    if(this.state.coordinates.length===0)
    {
      this.timerID2 = setInterval(() => this.fetchCoords(), 2000);
    }

    //--- stop timer ---
    clearInterval(this.timerID);

    /*//--- get crimes from lat and long ---
    if(!this.state.isLoaded)
    {
        console.log("test");
      setTimeout(function(){
        this.getCrimesPerArea();
      }.bind(this),5000);
    }
    else {
      this.getCrimesPerArea();
    }*/

  }


  //--- get coords from Google API ---
  fetchCoords(){

    //--- passing areas variables (filtered list from what user requested) ---
    var areas = this.state.filteredArea;

    //--- iterating through each area ---
    for(var i = 0; i<areas.length;i++)
    {
      //--- getting coords and setting as state ---
      getCoords(areas[i].name, (data =>{
        /*this.setState({
          tempLat: data
        });*/
        //--- adding new coords to array ---
        this.state.coordinates.push(data);
        console.log("retrieved data: ", this.state.coordinates);
      }));

      //--- waiting for fetch and adding lat and long to area array ---
      setTimeout(function(){
        console.log(i);
        for(var j = 0; j<i;j++)
        {
          areas[j].lat = this.state.coordinates[j][0];
          areas[j].long = this.state.coordinates[j][1];
          console.log(areas);
        }
        this.setState({
          isLoaded: true
        });
      }.bind(this),2000, areas, i);
    }

    clearInterval(this.timerID2);
    //clearInterval(this.timerID3);
  }

  /*getCrimesPerArea(){
    var areas = this.state.filteredArea;

    console.log("crimes: ",areas);
    console.log(areas[0].lat);
    for(var i = 0;i<areas.length;i++)
    {
      fetchCrimes(areas[i].lat, areas[i].long, (data =>{
          this.state.crimesPerArea.push(data);
          console.log("crimes per area: ", this.state.crimesPerArea);
      }))
    }

    this.completedFetching()
  }

  completedFetching(){
    this.setState({
      isLoaded: true
    });
  }*/




  render(){
    const {error, isLoaded, items, returnSearch} = this.state;
    if(error)
    {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded){
      return (
        <div className="loading__container">
        <div>Loading...</div>
        <div>Finding relevant Police Forces from your query.</div>
        </div>
      );
    }
    else if(!returnSearch){

      var areas = this.state.filteredArea;
      var crimes = this.state.crimeCategories;

      return(
        <div className="data__container">
          <div className="data__div">
          <h1>Results: </h1>
            {areas.map(area=>(
              <table className="data__table">
              <thead>
                <tr className="header__row">
                  <th>
                  {area.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {crimes.map(crime=>(
                    <td className="data__table__data" id={crime.url}><ClickableArea crimeType={crime.name} id={crime.url} lat={area.lat} long={area.long}/></td>
                  ))}
                </tr>
              </tbody>
              </table>
            ))}
            </div>
          <div className="backbutton">
            <button onClick={this.handleClick}>Return / re-input </button>
          </div>
        </div>
      );
    }
    else if(returnSearch)
    {
      return(
        <Form/>
      );
    }
  }
}

export default Data;
