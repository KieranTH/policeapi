import React from 'react'

import Form from '../Form/Form';
import ClickableArea from '../ClickableArea/ClickableArea';

import './Data.css';

import {runFetch, getCoords} from '../APIController/APIController.js'

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
      items: [],
      filteredArea: [],
      queryType: "forces",
      coordinates: []
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

    runFetch(this.state.queryType, (data=>{
      this.setState({
      items: data});
    }));

    if(this.state.items.length===0)
    {
      this.timerID = setInterval(() => this.filterAreas(), 2000);
    }
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
    console.log(this.state.items);

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

      return(
        <div className="data__container">
          <div className="data__div">
          <h1>Search: {this.props.searchedArea}</h1>
            <ul>
              {areas.map(area => (
                <li key={area.id}>
                {area.name}
                <ClickableArea/>
                </li>
              ))}
            </ul>
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
