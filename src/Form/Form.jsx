import React from 'react'

import Data from '../Data/Data'

import './Form.css';

class Form extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      value: '',
      isSearched: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event){
    this.setState({
      value: event.target.value
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
            <label>
              Area:
              <input type="text" value={this.state.value} onChange={this.handleChange}/>
            </label>
            <input type="submit" value="Submit" onClick={this.handleClick}/>
          </form>
        </div>
      );
    }
    else if(isSearched)
    {
      return(
          <Data searchedArea={this.state.value}/>
      );
    }
  }
}

export default Form;
