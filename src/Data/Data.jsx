import React from 'react'

import Form from '../Form/Form';
import ClickableArea from '../ClickableArea/ClickableArea';

class Data extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      returnSearch: false,
      items: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
      this.setState({
        returnSearch: true
      })
  }

  componentDidMount(){
    fetch("https://data.police.uk/api/forces")
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
      )


  }
  render(){
    const {error, isLoaded, items, returnSearch} = this.state;
    if(error)
    {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded){
      return <div>Loading...</div>
    }
    else if(!returnSearch){

      var areas = [];

      for(var i = 0; i<items.length;i++)
      {
        if(items[i].id.includes(this.props.searchedArea))
        {
          console.log("hit");
          areas.push(items[i]);
        }
      }

      /*items.map(item => (
        if(item.name.includes(this.props.searchedArea))
        {
          areas.push(item.name);
        }
      ));*/


      /*{items.map(item => (
        <li key={item.id}>
          {item.name}
          </li>
       ))}*/

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
