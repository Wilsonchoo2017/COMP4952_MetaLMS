import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";

class Navbars extends React.Component {
  render() {
    return (
      <>
        <Navbar
          className="navbar-horizontal navbar-dark bg-default"
          expand="lg"
        >
          <Container>
            <Link to="/">
              <NavbarBrand>
              Meta LMS
            </NavbarBrand>
            </Link>
            <button
              aria-controls="navbar-default"
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navbar-default"
              data-toggle="collapse"
              id="navbar-default"
              type="button"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse navbar toggler="#navbar-default">
              <Nav className="navbar-nav" navbar>
                <NavItem>
                  <Link to="/concept-page">
                    <NavLink
                    className="nav-link-icon"
                  >
                    <span className="nav-link-inner--text ">
                      Concepts
                    </span>
                  </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/LO-page">
                <NavLink
                  className="nav-link-icon"
                >
                    <span className="nav-link-inner--text ">
                      Learning Objects
                    </span>
                </NavLink>
                  </Link>
              </NavItem>
                <Link to="/course-page">
                  <NavItem>
                  <NavLink
                    className="nav-link-icon"
                  >
                    <span className="nav-link-inner--text ">
                      Courses
                    </span>
                  </NavLink>
                </NavItem>
                </Link>


              </Nav>


              <Nav className="ml-lg-auto" navbar>

              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default Navbars;