import React from 'react'

import Form from '../Form/Form';
import ClickableArea from '../ClickableArea/ClickableArea';

import './Data.css';

import {fetchAreas, getCoords, fetchCrimeCategories, fetchCrimes} from '../APIController/APIController.js'

import Geocode from 'react-geocode';

/*
*  name: Data Component
*  use: Create Data elements and display Forces and Categories
*/
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

  //--- switch from Data component to Form listener ---
  handleClick(event){
      this.setState({
        returnSearch: true
      })
  }

  //--- render method complete ---
  componentDidMount(){

    //--- getting crime categories from APIController ---
    fetchCrimeCategories((data =>{
      this.setState({
        crimeCategories: data
      })
      //console.log(this.state.crimeCategories);
    }));

    this.filterAreas();

  }


  //--- filtering forces based on input from user ---
  filterAreas(){

    //--- VARS for filtering ---
    var items = this.state.items;

    var areas = [];

    var keys = [];

    var test = Object.keys(items);


    //--- iterating through each force and checking if equal to user query ---
    for(var i = 0; i<items.length;i++)
    {
      //--- adding lat and long to items array retrieved from API ---
      items[i] = {... items[i], lat: "lat", long: "long"};

      //--- getting JSON keys ---
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
          //--- adding filtered area to areas array ---
          areas.push(items[i]);
          //console.log(areas[i]);
        }
      }
    }

    //console.log(areas);

    //--- setting filtered areas ---
    this.setState({
      filteredArea: areas
    });

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
        //--- adding new coords to array ---
        this.state.coordinates.push(data);
        //console.log("retrieved data: ", this.state.coordinates);
      }));

      //--- waiting for fetch and adding lat and long to area array ---
      setTimeout(function(){
        //console.log(i);
        for(var j = 0; j<i;j++)
        {
          areas[j].lat = this.state.coordinates[j][0];
          areas[j].long = this.state.coordinates[j][1];
          console.log(areas);
        }
        //--- laoding page ---
        this.setState({
          isLoaded: true
        });
      }.bind(this),2000, areas, i);
    }

    //--- clear timer ---
    clearInterval(this.timerID2);
  }

  render(){
    const {error, isLoaded, items, returnSearch} = this.state;

    //--- if error during fetch ---
    if(error)
    {
      return <div>Error: {error.message}</div>
    }
    //--- if the data is loading ---
    else if (!isLoaded){
      return (
        <div className="loading__container">
        <div>Loading...</div>
        <div>Finding relevant Police Forces from your query.</div>
        </div>
      );
    }
    //--- if data has loaded ---
    else if(!returnSearch){

      var areas = this.state.filteredArea;
      var crimes = this.state.crimeCategories;

      //--- returning table of Categories and Forces with ClickableArea component for each category ---
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
    //--- return back to form ---
    else if(returnSearch)
    {
      return(
        <Form/>
      );
    }
  }
}

export default Data;
