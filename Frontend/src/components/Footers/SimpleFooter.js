/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

import { Segment, Grid, List, Header, Divider} from "semantic-ui-react";

class SimpleFooter extends React.Component {
  render() {
    return (
      <>
        <Segment vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
          <Container textAlign='center'>
            <div className=" copyright">
              © {new Date().getFullYear()}{" "}
              MetaLMS
              .
            </div>
          </Container>
        </Segment>
      </>
    );
  }
}

export default SimpleFooter;
