import React from 'react'

import Data from '../Data/Data'

import './Form.css';

class Form extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      area: '',
      isSearched: false
    }
    this.areaChange = this.areaChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  areaChange(event){
    this.setState({
      area: event.target.value
    });
  }

  handleSubmit(event)
  {
    alert("Area searched!: " + this.state.value);
    event.preventDefault();
  }

  handleClick(event)
  {
    this.setState({
      isSearched: true
    });
  }



  render(){
    const {isSearched} = this.state;
    if(!isSearched)
    {
      return(
        <div className="form__container">
          <form onSubmit={this.handleSubmit} className="form__obj">
            <div className="form__input">
            <label>City/County/Country:</label>
            <br></br>
              <input type="text" value={this.state.area} onChange={this.areaChange}/>
            </div>
            <br></br>
            <input type="submit" value="Submit" onClick={this.handleClick}/>
          </form>
        </div>
      );
    }
    else if(isSearched)
    {
      return(
          <Data area={this.state.area}/>
      );
    }
  }
}

export default Form;
