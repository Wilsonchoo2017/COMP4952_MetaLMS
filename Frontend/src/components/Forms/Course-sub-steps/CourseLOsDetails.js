import Navbar from "../../Navbars/Navbars";
import React from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import {Form, Divider, } from 'semantic-ui-react';
import SimpleFooter from "../../Footers/SimpleFooter";

const options = [
  {key: '1', text: 'Term 1', value: '1'},
  {key: '2', text: 'Term 2', value: '2'},
  {key: '3', text: 'Term 3', value: '3'},
  {key: '4', text: 'Summer Term', value: '0'},
]

class CourseLOsDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {errorForm: false}
  }

  saveAndContinue = (e) => {
    e.preventDefault();
    let response = this.props.handleFormSubmit();
    this.setState({open: false, errorForm: false})
    if (response === false) {
      this.setState({errorForm: true, open: false})
    }
  }

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };


  render() {
    const {values} = this.props;
    const final = [];
    for (let i = 1; i <= values.courseDuration; i++) {
      final.push((
          <div key={i}>
            <h1>Week {i}</h1>
            {
              values.courseComponent.map((componentDict, componentIdx) => (
                <div key={componentIdx}>
                  <h2>{componentDict.name}</h2>
                  {
                    componentDict.subComponent.map((subComponent, idx) => (
                      <div key={idx}>
                        <h3>{subComponent}</h3>
                        <Form.Dropdown label={"Learning Object"} placeholder="Learning Object For This Sub-Component" name="SubComponent"
                                       fluid
                                       search
                                       selection
                                       multiple
                                       onChange={this.props.handleCourseLOChange.bind(this, i, componentDict.name, subComponent)}
                                       options={values.data}/>
                      </div>
                    ))
                  }

                </div>
              ))
            }
            <Divider />
          </div>
        )
      )
    }

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
                  <h1 className="ui centered">Week to Week Course Structure</h1>
                  <Form>
                    {final}
                  </Form>

                  <Button onClick={this.back} color={"primary"}>Back</Button>
                  <Button onClick={this.saveAndContinue} color={"success"}>Confirm And Save</Button>
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

export default CourseLOsDetails;