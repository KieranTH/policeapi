import React from 'react';

import './ClickableArea.css';

import {fetchCrimes} from '../APIController/APIController.js'

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries
} from 'react-vis';


/*
*  name: ClickableArea Component
*  use: Component for creating Clickable title and displaying graph
*/
class ClickableArea extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      name: '',
      isClicked: false,
      retrievedData: false,
      resultsOne: [],
      resultsTwo: [],
      resultsThree: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  //--- toggle for graph and title ---
  handleClick(event)
  {
    if(this.state.isClicked)
    {
      this.setState({
        isClicked: false
      })
    }
    else if(!this.state.isClicked)
    {
      this.setState({
        isClicked: true
      })
    }
  }

  //--- react render complete ---
  componentDidUpdate(){
    if(this.state.isClicked)
    {
      if(!this.state.retrievedData)
      {
        //--- getting crimes per area ---
        this.getCrimesPerArea(this.props.lat, this.props.long, this.props.id);
        this.setState({
          retrievedData: true
        });
      }
    }
  }

  getCrimesPerArea(lat, long, type){

    //--- getting date object ---
    let newDate = new Date();
    var month = newDate.getMonth()-1;
    let year = newDate.getFullYear();

    if(month < 10)
    {
      month = "0"+month;
    }

    //--- running fetchCrimes for 3 months ---
    var date = year+"-"+month;

    //--- running fetch for previous month ---
      fetchCrimes(lat, long, type, date, (data =>{
          console.log("crime object:", data);
          this.setState({
            resultsOne: data
          });
      }));

    //--- running fetch for previous month - 1 ---
    month = newDate.getMonth()-2;
    date = year+"-"+month;
      fetchCrimes(lat, long, type, date, (data =>{
          console.log("crime object:", data);
          this.setState({
            resultsTwo: data
          });
      }));

    //--- running fetch for previous month - 2 ---
    month = newDate.getMonth()-3;
    date = year+"-"+month;
      fetchCrimes(lat, long, type, date, (data =>{
          console.log("crime object:", data);
          this.setState({
            resultsThree: data
          });
      }));
  }


  render(){
    const {isClicked} = this.state;
    //--- title element ---
    if(!isClicked)
    {
      return(
        <p className="clickable__title" onClick={this.handleClick}>
        {this.props.crimeType}
        </p>
      );
    }
    //--- graph element ---
    else if(isClicked)
    {
      const BarSeries = VerticalBarSeries;
      //--- setting new width for graph element ---
      var elem = document.getElementById(this.props.id);
      elem.style.width = "100px";


      //--- getting dates for each query as objects | could pass from previous method for efficiency if needed ---
      let dOne = new Date();
      dOne.setMonth(dOne.getMonth()-1);
      let monthOne = dOne.toLocaleString('default', {month: 'long'});

      let dTwo = new Date();
      dTwo.setMonth(dTwo.getMonth()-2);
      let monthTwo = dTwo.toLocaleString('default', {month: 'long'});

      let dThree = new Date();
      dThree.setMonth(dThree.getMonth()-3);
      let monthThree = dThree.toLocaleString('default', {month: 'long'});



      //--- plot data ---
      const blueData = [{x: monthOne, y: this.state.resultsOne.length}, {x: monthTwo, y: this.state.resultsTwo.length}, {x: monthThree, y: this.state.resultsThree.length}];

      //--- if results are valid | currently hangs if one result is empty from API response---
      if(this.state.resultsOne.length !=0 && this.state.resultsTwo.length != 0 && this.state.resultsThree.length != 0)
      {
        return(
          <div className="clickable__container">
            <p className="clickable__title" onClick={this.handleClick}>Viewing Data from {monthOne} and 2 previous months!</p>
            <br></br>
            <p className="text">Overall number of cases over 3 month period: <strong>{this.state.resultsThree.length + this.state.resultsTwo.length + this.state.resultsThree.length}</strong></p>
            <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <BarSeries data={blueData} />
          </XYPlot>

          </div>
        );
      }
      //--- loading data element ---
      else {
        return(
          <div className="clickable__container">
            <p onClick={this.handleClick}>Loading Crime Data...</p>
            <br></br>
          </div>
        );
      }
    }
  }
}

export default ClickableArea;
