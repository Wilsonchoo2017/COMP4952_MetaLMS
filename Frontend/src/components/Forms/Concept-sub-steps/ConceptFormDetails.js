import Navbar from "../../Navbars/Navbars";
import React  from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import {Form, Message, Radio} from 'semantic-ui-react';

import API from "../../../api";
import SimpleFooter from "../../Footers/SimpleFooter";

function getScheme() {
  return API.getAllScheme().then(function(data) {
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

class ConceptFormDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {radioValue: '1', errorForm: false}
  }

  async componentDidMount() {
    const scheme = await getScheme();
    this.setState({conceptScheme: scheme})
  }

  saveAndContinue = (e) => {
    e.preventDefault();
    const { values } = this.props;
    if (values.conceptName === '') {
      // Trigger error system
      this.setState({errorForm: true})
    } else {
      this.props.nextStep();
    }
  }

  radioHandleChange = (e, { value }) => {
    this.setState( { radioValue: value} )
    console.log(value)
    this.props.handleChangeOnRadio(value)
  }

  render() {
    const { values } = this.props;
    const { radioValue } = this.state;
    let Schema = null;

    if (radioValue === '2') {
      Schema = (<div><Form.Input
        label={'Scheme Name'}
        placeholder='Scheme Name'
        onChange={this.props.handleChange('schemeName')}
        defaultValue={values.altLabel}
      />
      <Form.Dropdown label={"Concepts With This Scheme"} placeholder={'Concepts'} fluid multiple search selection
                     onChange={this.props.handleDropdownSchemeConceptChange.bind(this)}
                     options={values.data} />
      </div>
    )
    } else if (radioValue === '3') {
      Schema =
        <Form.Dropdown label={"Concept Scheme"} placeholder={'Scheme Name'} fluid
                       onChange={this.props.handleDropdownSchemeTitleChange.bind(this)}
                       search selection options={this.state.conceptScheme} />
    }
    return (
      <div>
        <Navbar />
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="pt-lg-7">
              <Card>
                <div className="px-4">
                  <Form error={this.state.errorForm}>
                    <h1 className="ui centered">Concept Details</h1>
                    <Form.Input
                        required={true}
                        label='Concept Title'
                        placeholder='Concept Title'
                        onChange={this.props.handleChange('conceptName')}
                        defaultValue={values.conceptName}
                      />
                    <Form.Input
                      label='Notation/Comments'
                        placeholder='Comment'
                        onChange={this.props.handleChange('comment')}
                        defaultValue={values.comment}
                    />
                    <h3 className="ui centered">Lexical Labels</h3>
                    <Form.Input
                      label={'prefLabel'}
                        placeholder='Preferred Label'
                        onChange={this.props.handleChange('prefLabel')}
                        defaultValue={values.prefLabel}
                      />
                    <Form.Input
                      label={'Hidden Label'}
                        placeholder='Hidden Label'
                        onChange={this.props.handleChange('hiddenLabel')}
                        defaultValue={values.hiddenLabel}
                      />
                      <Form.Input
                        label={'Alternative Label'}
                        placeholder='Alternative Label'
                        onChange={this.props.handleChange('altLabel')}
                        defaultValue={values.altLabel}
                      />
                    <h3 className="ui centered">Concept Scheme</h3>
                    <Form.Group inline>
                      <Form.Field
                        control={Radio}
                        label='None'
                        value='1'
                        checked={radioValue === '1'}
                        onChange={this.radioHandleChange}
                      />
                      <Form.Field
                        control={Radio}
                        label='Create New'
                        value='2'
                        checked={radioValue === '2'}
                        onChange={this.radioHandleChange}
                      />
                      <Form.Field
                        control={Radio}
                        label='Search and Pick Existing'
                        value='3'
                        checked={radioValue === '3'}
                        onChange={this.radioHandleChange}
                      />

                    </Form.Group>
                    {Schema}
                    <h3 className="ui centered">Dependency</h3>
                    <Form.Group inline>
                      <Form.Dropdown label={"Dependency Of This Concept"} placeholder={'Concepts'} fluid multiple search selection
                                     onChange={this.props.handleDropdownDependencyConceptChange.bind(this)}
                                     options={values.data} />
                  </Form.Group>
                    <Message
                      error
                      header='Action Forbidden'
                      content='You have not fill in all the required details.'
                    />
                    <Button onClick={this.saveAndContinue}>Save And Continue</Button>
                  </Form>
                </div>
              </Card>
            </Container>
          </section>
          <SimpleFooter/>
        </main>
      </div>
    )
  }
}

export default ConceptFormDetails;