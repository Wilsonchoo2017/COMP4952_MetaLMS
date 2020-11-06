/*
  Landing Page:
  The first page that user see when they enter metalms.com link
 */
import React from "react";
import { Link } from "react-router-dom";
// nodejs library that concatenates classes
// import classnames from "classnames";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import Navbar from "../components/Navbars/Navbars.js";
import CardsFooter from "../components/Footers/CardsFooter";
import SimpleFooter from "../components/Footers/SimpleFooter";

class Landing extends React.Component {
  state = {};


  render() {
    return (
      <>
        <Navbar/>
        <div className="position-relative">
          <section className="section section-lg section-shaped pb-250">
            <div className="shape shape-style-3 shape-default">
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className="py-lg-md d-flex container">
              <div className="col px-0">
                <div className="row">
                  <div className="col-lg-6"><h1 className="display-3 text-white">Meta LMS<span>Lots to Love. Less to Worry</span>
                  </h1><p className="lead text-white">Meta LMS packs with advanced and innovative technology to deliver
                    world class LMS system. It's just what you've been waiting for.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="separator separator-bottom separator-skew">
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100"
                   x="0" y="0">
                <polygon className="fill-white" points="2560 0 2560 100 0 100"/>
              </svg>
            </div>
          </section>
        </div>
        <section className="section section-lg pt-lg-0 mt--200">
          <div className="container">
            <Row className="justify-content-center">
              <Col lg="12">
                <Row className="row-grid">
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                          <i className="ni ni-check-bold" />
                        </div>
                        <h6 className="text-primary text-uppercase">
                          <Link to={"/concept-page"}> Browse Concepts</Link>
                        </h6>
                        <p className="description mt-3">
                          Find out all the concepts exist from us. These concepts are hand crafted by our beloved developers!
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                          <i className="ni ni-istanbul" />
                        </div>
                        <h6 className="text-success text-uppercase">

                          <Link to={"/course-page"}>Browse Courses</Link>
                        </h6>
                        <p className="description mt-3">
                          Explore all the courses exist in our system. Get the chance to design your courses in an efficient way!
                        </p>
                        <div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                          <i className="ni ni-planet" />
                        </div>
                        <h6 className="text-warning text-uppercase">
                          <Link to={"/LO-page"}>Browse Learning Objects</Link>
                        </h6>
                        <p className="description mt-3">
                          The finest grained of Learning Objects are available here. Get all of the learning objects posted by other academic staffs.
                        </p>
                        <div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </section>
        <SimpleFooter />
      </>
    );
  }
}

export default Landing;
