import Navbar from "../../Navbars/Navbars";
import React  from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import { Form, Popup } from 'semantic-ui-react';
import SimpleFooter from "../../Footers/SimpleFooter";


class CourseNewOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {radioValue: ''}
  }
  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.values.isImported = false
    this.props.nextStep();
  }
  importAndContinue = (e) => {
    e.preventDefault();
    this.props.values.isImported = true
    this.props.goToImport();
  }

  render() {
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
              <Card >
                <div className="px-4">
                  <h1> New Course </h1>
                  <Form>
                    <Popup content={'Due to Some Problem, Import is not Available At The Moment'}
                           trigger={<Button type='submit'
                                            // onClick={this.importAndContinue}
                                            color={"secondary"}>Import Course (N/A)</Button>} />

                    <Button type='submit' onClick={this.saveAndContinue} color={"info"}>Manually Add Course</Button>
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

export default CourseNewOptions;