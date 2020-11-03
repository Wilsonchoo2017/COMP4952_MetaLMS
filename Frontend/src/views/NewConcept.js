/*
  New Concept Page:
  Creating a new concept page
 */

import React from "react";

// core components
import ConceptFormDetails from "../components/Forms/Concept-sub-steps/ConceptFormDetails";
import ConceptRelationshipDetails from "../components/Forms/Concept-sub-steps/ConceptRelationshipDetails";

import API from "../api";
import ConceptFormSuccess from "../components/Forms/Concept-sub-steps/ConceptFormSuccess";

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

class NewConcept extends React.Component {
  state = {
    step: 1,
    conceptName: '',
    comment: '',
    dependency: [],
    prefLabel: '',
    hiddenLabel: '',
    altLabel: '',
    schemeName: '',
    schemeConcepts: [],
    schemeMode: '', // 1 for None, 2 for create, 3 for use existing
    relationship: [{semanticRelation: "", concepts: []}],
    data: [],
  }

  async componentDidMount() {
    const response = await getData();
    this.setState({data: response})
  }

  nextStep = () => {
    const {step} = this.state
    this.setState({
      step: step + 1
    })
  }

  prevStep = () => {
    const {step} = this.state
    this.setState({
      step: step - 1
    })
  }

  handleChange = input => event => {
    this.setState({[input]: event.target.value})
  }

  handleChangeOnRadio = (idx) => {
    console.log(idx)
    this.setState({schemeMode: idx})
  }

  addRelationshipClick = () => {
    this.setState(prevState => ({
      relationship: [...prevState.relationship, {semanticRelation: "", concepts: []}]
    }))
  }

  handleDropdownRelationshipChange = (i, e, data) => {
    const {name, value} = data;
    let relationship = [...this.state.relationship];
    relationship[i] = {...relationship[i], [name]: value};
    this.setState({relationship});
  }


  handleDropdownSchemeConceptChange = (e, data) => {
    const {value} = data;
    this.setState({schemeConcepts: value});
  }


  handleDropdownDependencyConceptChange = (e, data) => {
    const {value} = data;
    this.setState({dependency: value});
  }

  handleDropdownSchemeTitleChange = (e, data) => {
    const {value} = data;
    this.setState({schemeName: value});
  }

  removeRelationshipClick = (i) => {
    let relationship = [...this.state.relationship];
    relationship.splice(i, 1);
    this.setState({relationship});
  }

   async handleFormSubmit() {
    let conceptData = this.state;
    let status = await API.submitConceptForm(conceptData);
    if (status === true) {
      this.setState({step: -1})
      return true
    }
    return false
  }

  render() {
    const {step} = this.state;
    const {conceptName, comment, prefLabel, hiddenLabel, altLabel, relationship, schemeName, schemeConcepts, schemeMode, data, dependency} = this.state;
    const values = {conceptName, comment, prefLabel, hiddenLabel, altLabel, relationship, schemeName, schemeMode, schemeConcepts, data, dependency};
    switch (step) {
      case 1:
        return (
          <ConceptFormDetails nextStep={this.nextStep} handleChange={this.handleChange} values={values}
                              handleChangeOnRadio={this.handleChangeOnRadio}
                              handleDropdownSchemeConceptChange={this.handleDropdownSchemeConceptChange}
                              handleDropdownSchemeTitleChange={this.handleDropdownSchemeTitleChange}
                              handleDropdownDependencyConceptChange={this.handleDropdownDependencyConceptChange }
          />
        );
      case 2:
        return (
          <div>
            <ConceptRelationshipDetails nextStep={this.nextStep} prevStep={this.prevStep}
                                        addRelationshipClick={this.addRelationshipClick} removeRelationshipClick={this.removeRelationshipClick}
                                        handleDropdownRelationshipChange={this.handleDropdownRelationshipChange }
                                        handleFormSubmit={this.handleFormSubmit.bind(this)}
                                        handleChange={this.handleChange} values={values}/>
          </div>
        );
      case -1:
        return (
          <div>
            <ConceptFormSuccess/>
          </div>
        )
    }

  }
}

export default NewConcept;
