import Navbar from "../../Navbars/Navbars";
import React  from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import {Checkbox, Form, Radio, Icon, Message} from 'semantic-ui-react';
import SimpleFooter from "../../Footers/SimpleFooter";

const options = [
  { key: '1', text: 'Term 1', value: '1' },
  { key: '2', text: 'Term 2', value: '2' },
  { key: '3', text: 'Term 3', value: '3' },
  { key: '4', text: 'Summer Term', value: '0' },
]

class CourseStructureDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {errorForm: false}
  }
  saveAndContinue = (e) => {
    e.preventDefault();
    const { values } = this.props;
    let error = false;
    for (let i = 0; i < values.courseComponent.length; ++i) {
      let curr = values.courseComponent[i]
      if (curr.name === '' ||
          curr.subComponent.length === 0) {
        error = true
        break;
      }
    }
    if (error === false) {
      this.props.initCourseLO2();
      this.props.nextStep();
    } else {
      this.setState({errorForm: true})

    }
  }
  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  addCourseComponent = (e) => {
    e.preventDefault();
    this.props.addCourseComponent();
  };

  removeCourseComponent (i, e) {
    e.preventDefault();
    console.log(i)
    console.log(e)
    this.props.removeCourseComponent(i);
  };

  toggleAssess = (i) => {
    this.props.handleCheckAssessmentComponent(i);
  };


  render() {
    const { values } = this.props;
    const errorMessage =
      <Message
        error
        header='Action Forbidden'
        content='You have not fill in all the required details.'
      />

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
                  <Form>
                    <h1 className="ui centered">Course Structure</h1>
                    <Form.Input
                      label='Duration'
                      required={true}
                      placeholder='How many weeks will the course last?'
                      onChange={this.props.handleChange('courseDuration')}
                      defaultValue={values.courseDuration}
                    />
                  </Form>
                    {

                      values.courseComponent.map((el, i) => (
                        <div key={i}>
                          <Form>
                          <Form.Group widths={'equal'}>
                            <Form.Input
                              required={true}
                              label='Course Component'
                              placeholder='Lecture, Lab, etc'
                              onChange={this.props.handleMappingChange.bind(this, i, 'name')}
                            />
                            <Form.Input
                              required={true}
                              label='Course Sub-Component'
                              placeholder='Slides, Code, Video... (Separated by ",")'
                              onChange={this.props.handleMappingSubComponentChange.bind(this, i, 'subComponent')}
                            />
                            <Button value='remove' onClick={this.removeCourseComponent.bind(this, i)}><Icon name='delete' /> </Button>
                          </Form.Group>
                            {/*<Checkbox label='Include As Assessment Component' onChange={this.toggleAssess.bind(this, i) } />*/}
                          </Form>
                        </div>
                      ))
                    }
                    <Button onClick={this.addCourseComponent}>Add Another Component</Button>
                  {/*<Button onClick={this.props.test}>Test</Button>*/}
                  <span/>
                  <div>
                    {this.state.errorForm ? errorMessage : ''}
                    <Button onClick={this.back} color={"primary"}>Back</Button>
                    <Button onClick={this.saveAndContinue} color={"success"}>Save And Continue</Button>
                  </div>
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

export default CourseStructureDetails;