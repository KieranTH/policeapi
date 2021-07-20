import React from 'react';

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
      isClicked: false
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

  render(){
    const {isClicked} = this.state;
    if(!isClicked)
    {
      return(
        <p className="clickable__text" onClick={this.handleClick}>
        Test Click
        </p>
      );
    }
    else if(isClicked)
    {
      const BarSeries = VerticalBarSeries;
      const blueData = [{x: 'A', y: 12}, {x: 'B', y: 2}, {x: 'C', y: 11}];
      return(
        <div className="clickable__container">
          <p onClick={this.handleClick}>Clicked!</p>
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
