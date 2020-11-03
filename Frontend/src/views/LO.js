/*
  LO Page
  Main page that shows all the Learning object exist in the database.
 */
import React from "react";
import { useTable } from 'react-table'

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
import LoTable from "../components/Tables/lo-table";

// utilities
import getData from "../components/Tables/TableData/LoData";
import SimpleFooter from "../components/Footers/SimpleFooter";

class LO extends React.Component {
  state = {
    data: [],
  };

  async componentDidMount() {
    const response = await getData();
    this.setState({data:response})
  }
  render() {
    return (
      <>
        <Navbar />
        <main ref="main">
          {/* Circle BG */}

          <section className={"section section-lg"}>
            <Container>
              <Button
                className="mt-4"
                color="primary"
                href="/new-LO-page"
              >
                New Learning Object
              </Button>
            <LoTable data={this.state.data} />
            </Container>
          </section>
        <SimpleFooter />
        </main>
      </>
    );
  }
}

export default LO;