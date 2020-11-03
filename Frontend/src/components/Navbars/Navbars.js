import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
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
            <NavbarBrand href="/">
              Meta LMS
            </NavbarBrand>
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
                  <NavLink
                    className="nav-link-icon"
                    href="/concept-page"
                  >
                    <span className="nav-link-inner--text ">
                      Concepts
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                <NavLink
                  className="nav-link-icon"
                  href="/LO-page"
                >
                    <span className="nav-link-inner--text ">
                      Learning Objects
                    </span>
                </NavLink>
              </NavItem>
                <NavItem>
                  <NavLink
                    className="nav-link-icon"
                    href="/course-page"
                  >
                    <span className="nav-link-inner--text ">
                      Courses
                    </span>
                  </NavLink>
                </NavItem>


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