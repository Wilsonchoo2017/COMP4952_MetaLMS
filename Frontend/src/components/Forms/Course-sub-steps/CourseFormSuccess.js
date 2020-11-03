import Navbar from "../../Navbars/Navbars";
import React  from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import SimpleFooter from "../../Footers/SimpleFooter";

class CourseFormSuccess extends React.Component {
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
                  <Button
                    className="mt-4"
                    color="primary"
                    href="/new-course-page"
                  >
                    Add Another Course
                  </Button>
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

export default CourseFormSuccess;