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

class ClickableArea extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      name: '',
      isClicked: false,
      retrievedData: false,
      results: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

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

  componentDidUpdate(){
    if(this.state.isClicked)
    {
      if(!this.state.retrievedData)
      {
        this.getCrimesPerArea(this.props.lat, this.props.long, this.props.id);
        this.setState({
          retrievedData: true
        });
      }
    }
  }

  getCrimesPerArea(lat, long, type){

    let newDate = new Date();
    let month = newDate.getMonth()-1;
    let year = newDate.getFullYear();

    if(month < 10)
    {
      month = "0"+month;
    }

    var date = year+"-"+month;

      fetchCrimes(lat, long, type, date, (data =>{
          console.log("crime object:", data);
          this.setState({
            results: data
          });
      }));

    //--- MAKE NEW DATE FOR 2 MONTHS BEFORE ABOVE MONTH ---
      fetchCrimes(lat, long, type, date, (data =>{
          console.log("crime object:", data);
          this.setState({
            results: data
          });
      }));

      fetchCrimes(lat, long, type, date, (data =>{
          console.log("crime object:", data);
          this.setState({
            results: data
          });
      }));
  }



  render(){
    const {isClicked} = this.state;
    if(!isClicked)
    {
      return(
        <p className="clickable__text" onClick={this.handleClick}>
        {this.props.crimeType}
        </p>
      );
    }
    else if(isClicked)
    {
      const BarSeries = VerticalBarSeries;
      const blueData = [{x: 'A', y: 12}, {x: 'B', y: 2}, {x: 'C', y: 11}];
      var elem = document.getElementById(this.props.id);
      elem.style.width = "100px";

      let d = new Date();
      d.setMonth(d.getMonth()-1);
      let month = d.toLocaleString('default', {month: 'long'});
      return(
        <div className="clickable__container">
          <p onClick={this.handleClick}>Viewing Data from {month} and 2 previous months!</p>
          <br></br>
          <p>Number of cases: {this.state.results.length}</p>
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
  }
}

export default ClickableArea;
