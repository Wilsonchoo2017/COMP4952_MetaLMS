/*
  New Concept Page:
  Creating a new concept page
 */

import React from "react";
// core components
import LOForm from "../components/Forms/LO-sub-steps/LOForm";


import API from "../api";
import LOFormSuccess from "../components/Forms/LO-sub-steps/LOFormSuccess";

function getData() {
  return API.getAllConcepts().then(function(data) {
    let list = []
    for(let i = 0; i < data.length; i++) {
      let temp = {}
      temp['key'] = i;
      temp['text'] = data[i];
      temp['value'] = data[i];
      list.push(temp)
    }
    return list
  })
}

class NewLO extends React.Component {
  state = {
    step: 1,
    concepts: '',
    loName: '',
    file: '',
    fileName: '',
    type: '',
    contact: '',
  }

  async componentDidMount() {
    const response = await getData();
    this.setState({data: response})
  }

  async handleFormSubmit () {
    let loData = this.state;
    console.log(this.state)
    let status = await API.submitLO(loData)

    console.log(status)
    if (status === true) {
      this.setState({step: -1})
      return true
    }
    return false

  }

  goToStart = () => {
    this.setState(
      {
        step: 1,
        concepts: '',
        loName: '',
        file: '',
        fileName: '',
        type: '',
        contact: '',
      }
    )
    this.componentDidMount()
  }

  handleChange = input => event => {
    this.setState({[input]: event.target.value})
  }


  handleDropdownConceptChange = (e, data) => {
    const {value} = data;
    this.setState({concepts: value});
  }

  //https://www.youtube.com/watch?v=sp9r6hSWH_o
  onFileChangeHandler = (e) => {
    let files = e.target.files;
    const file = files[0]

    console.log(files)
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload=(e)=> {
      this.setState({file: e.target.result, type: file.type, fileName: file.name})
    }
  }
  render() {
    const {step} = this.state;

    switch (step) {
      case 1:
        return (
          <LOForm nextStep={this.nextStep} handleChange={this.handleChange} values={this.state}
                  handleDropdownConceptChange={this.handleDropdownConceptChange}
                  onFileChangeHandler={this.onFileChangeHandler}
                  handleFormSubmit={this.handleFormSubmit.bind(this)}
          />
        );
      case -1:
        return (
          <LOFormSuccess goToStart={this.goToStart}/>
        )

    }

  }
}

export default NewLO;
