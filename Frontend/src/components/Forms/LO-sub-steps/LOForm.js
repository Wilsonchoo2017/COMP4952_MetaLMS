import Navbar from "../../Navbars/Navbars";
import React  from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import {Confirm, Form, Icon, Message} from 'semantic-ui-react';

import API from "../../../api";
import SimpleFooter from "../../Footers/SimpleFooter";

class LOForm extends React.Component {
  state = {open: false, errorForm: false, processing: false}
  constructor(props) {
    super(props);
  }
  saveAndContinue = (e) => {
    e.preventDefault();
    let error = false;
    if (this.props.values.concepts === '' ||
      this.props.values.loName === '' ||
      this.props.values.file === '') {
      error = true
    }

    if (error === false) {
      let response = this.props.handleFormSubmit();
      this.setState({open: false, processing: true, errorForm: false})
      if (response === false) {
        this.setState({errorForm: true, open: false, processing: false})
      }
    } else {
      this.setState({errorForm: true, open: false})
    }
  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  render() {
    const { values } = this.props;
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
                    <h1 className="ui centered">LO Details</h1>
                    <Form.Input
                      required={true}
                        label='LO Name'
                        placeholder='LO Name (Giving better LO Name provides better extraction results)'
                        onChange={this.props.handleChange('loName')}
                        defaultValue={values.loName}
                      />

                    <Form.Input
                      label='Contact Email'
                      placeholder='a@a.com'
                      onChange={this.props.handleChange('contact')}
                      defaultValue={values.contact}
                    />

                    <Form.Dropdown label={"Related Concepts"} placeholder="Concepts Found In This LOs" name="concepts"
                                   fluid
                                   required={true}
                                   search
                                   selection
                                   multiple
                                   onChange={this.props.handleDropdownConceptChange.bind(this)}
                                   options={values.data} />
                    <Form.Field className="form-group files" required={true}>
                      <label>Upload Your File </label>
                      <input type="file" onChange={this.props.onFileChangeHandler}/>
                    </Form.Field>
                    <Message
                      error
                      header='Action Forbidden'
                      content='You have not fill in all the details.'
                    />
                  </Form>
                  <div>
                    <Button onClick={this.open} color={"success"}>Save And Submit</Button>
                    <Confirm
                      open={this.state.open}
                      onCancel={this.close}
                      onConfirm={this.saveAndContinue}
                    />
                    { this.state.processing ? <MessageExampleIcon /> : '' }
                  </div>
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

export default LOForm;