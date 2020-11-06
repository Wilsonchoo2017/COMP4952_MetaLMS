import Navbar from "../../Navbars/Navbars";
import React  from "react";

import { Link }  from "react-router-dom";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import SimpleFooter from "../../Footers/SimpleFooter";

class ConceptFormSuccess extends React.Component {
  constructor(props) {
    super(props);
  }

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
                <div className="px-4">
                  Addition of new LO Succeeded!
                  <Link to={'/new-concept-page'}>
                    <Button
                    className="mt-4"
                    color="primary"
                    onClick={this.props.goToStart}>
                      Add Another Concept
                  </Button>
                  </Link>
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

export default ConceptFormSuccess;