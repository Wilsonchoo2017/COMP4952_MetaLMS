import Navbar from "../../Navbars/Navbars";
import React  from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import {Confirm, Form, Message} from 'semantic-ui-react';

import API from "../../../api";
import SimpleFooter from "../../Footers/SimpleFooter";

class LOFormSuccess extends React.Component {
  state = {open: false, errorForm: false}
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
      this.props.handleFormSubmit();
      this.setState({open: false})
    } else {
      this.setState({errorForm: true, open: false})
    }
  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  render() {
    const { values } = this.props;

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
                Addition of new LO succeeded
                <Button
                  className="mt-4"
                  color="primary"
                  href="/new-LO-page"
                >
                  Add Another Learning Object
                </Button>
              </Card>
            </Container>
          </section>
          <SimpleFooter />
        </main>
      </div>
    )
  }
}

export default LOFormSuccess;