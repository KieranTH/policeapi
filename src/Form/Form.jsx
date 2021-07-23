import React from 'react'

import Data from '../Data/Data'

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


import './Form.css';

import {fetchAreas} from '../APIController/APIController.js'


/*
*  name: Form Component
*  use: Create form element and take input from user
*/
class Form extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      area: '',
      isSearched: false,
      items: []
    }
    this.areaChange = this.areaChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //--- if text area needs updating with default text box---
  areaChange(event){
    this.setState({
      area: event.target.value
    });
  }

  //--- handle submit function | not used with Autocmplete Textbox---
  handleSubmit(event)
  {
    alert("Area searched!: " + this.state.value);
    event.preventDefault();
  }


  //--- call function from button click ---
  handleClick(event)
  {
    this.setState({
      isSearched: true
    });
  }


  //--- react element has been rendered ---
  componentDidMount(){
    //--- getting json array of all Police API forces ---
    fetchAreas((data=>{
      this.setState({
      items: data});
    }));

  }


  render(){
    const {isSearched} = this.state;
    //--- form for input ---
    if(!isSearched)
    {
      return(
        <div className="form__container">
          <form autocomplete="off" onSubmit={this.handleSubmit} className="form__obj">
            <div className="form__input">
            <br></br>
              <Autocomplete
                id="areaText"
                options={this.state.items}
                getOptionLabel={(option => option.name)}
                style={{width:300}}
                onChange={(event, newVal)=>{
                  this.state.area = newVal;
                }}
                className="input"
                renderInput={(params)=> <TextField {...params} label="Area" variant="outlined" />}
              />
            </div>
            <br></br>
            <input className="button" type="submit" value="Submit" onClick={this.handleClick}/>
          </form>
        </div>
      );
    }
    else if(isSearched)
    {
      //--- Show Data after search ---
      //console.log(this.state.area.name);
      return(
          <Data area={this.state.area.id} areas={this.state.items}/>
      );
    }
  }
}

export default Form;
