import Navbar from "../../Navbars/Navbars";
import React from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";

import {Confirm, Form, Message, Icon, Popup} from 'semantic-ui-react';

import API from "../../../api";
import SimpleFooter from "../../Footers/SimpleFooter";

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



const mapOptions = [
  {key: 'e', text: 'ExactMatch', value: 'exactMatch'},
  {key: 'c', text: 'CloseMatch', value: 'closeMatch'},
  {key: 'b', text: 'BroadMatch', value: 'broadMatch'},
  {key: 'n', text: 'NarrowMatch', value: 'narrowMatch'},
]


class ConceptRelationshipDetails extends React.Component {

  state = {open: false, serverError: false, processing: false}

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  saveAndContinue = (e) => {
    e.preventDefault();

    let response = this.props.handleFormSubmit();
    this.setState({open: false, processing: true, errorForm: false})
    if (response === false) {
      this.setState({serverError: true, open: false})
    } else {
      this.setState({processing: false})
    }

  };

  async componentDidMount() {
    const response = await getData();
    this.setState({data: response})
  }

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  addRelationshipClick = (e) => {
    e.preventDefault();
    this.props.addRelationshipClick();
  };



  render() {
    const {values} = this.props;

    const PopupExample = () => (
      <Popup trigger={<Button Icon='help'>Help...</Button>} >
        <p>ExactMatch means its 90~100% the same thing</p>
        <p>CloseMatch means its 60~80% the same thing</p>
        <p>BroadMatch means its 40~50% the same thing</p>
        <p>NarrowMatch means otherwise</p>
      </Popup>
    )

    const MessageExampleIcon = () => (
      <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Just one second</Message.Header>
          We are fetching that sorting things for you.
        </Message.Content>
      </Message>
    )

    return (
      <div>
        <Navbar/>
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
            </div>
            <Container className="pt-lg-7">
              <Card>
                <div className="px-4">
                  <Form error={this.state.serverError}>
                    <h1 className="ui centered">Enter Concept Relationships</h1>
                    {}
                    {
                      values.relationship.map((el, i) => (
                        <div key={i}>
                          <Form.Group widths={'equal'}>
                            <Form.Input
                              fluid
                              label={"Concept A"}
                              placeholder={values.conceptName}
                              readOnly
                            />
                            <Form.Dropdown label={"Semantic Relations"} placeholder="Maps To..." name="semanticRelation"
                                           fluid
                                           search
                                           selection
                                           value={el.semanticRelation || ''} onChange={this.props.handleDropdownRelationshipChange.bind(this, i)}
                                           options={mapOptions}/>
                            <Form.Dropdown label={"Concept B"} placeholder="Other Concept" name="concepts"
                                           fluid
                                           search
                                           selection
                                           multiple
                                           value={el.concepts || ''}
                                           onChange={this.props.handleDropdownRelationshipChange.bind(this, i)}
                                           options={values.data}/>
                            <Button value='remove' onClick={this.props.removeRelationshipClick.bind(this, i)}>x</Button>
                          </Form.Group>
                        </div>
                      ))
                    }
                    <Button onClick={this.addRelationshipClick}>Add Another Relationship</Button>
                    <PopupExample/>
                    <Message
                      error
                      header='Action Forbidden'
                      content='There is an error from the server. Please try again later'
                    />
                  </Form>
                  { this.state.processing ? <MessageExampleIcon /> : '' }

                  <Button onClick={this.back}>Back</Button>
                  <Button onClick={this.saveAndContinue} color={'success'}>Save And Submit</Button>
                  <Confirm
                    open={this.state.open}
                    onCancel={this.close}
                    onConfirm={this.saveAndContinue}
                  />
                </div>
              </Card>
            </Container>
          </section>
          <SimpleFooter />
        </main>
      </div>
    )
  }
}

export default ConceptRelationshipDetails;