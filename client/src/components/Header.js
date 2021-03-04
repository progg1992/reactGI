import React, { Component, Fragment } from 'react';
import { NavItem, Jumbotron, Container, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import RegisterModal from './auth/RegisterModal';
import LoginModal from './auth/LoginModal';
import Logout from './auth/logout';
import QuestionModal from './QuestionModal';
import '../styles/styles.css';
import { BiSearchAlt } from 'react-icons/bi';
import Logo from '../images/linkedin_profile_image.png';
import { searchingQuestion /*, getQuestions*/ } from '../actions/questionActions'


class Header extends Component {
    state = {
        isOpen: false,
        topic: ""
    }

    static propTypes = {
        user: PropTypes.object.isRequired,
        //getQuestions: PropTypes.func.isRequired,
        searchingQuestion: PropTypes.func.isRequired
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onClick = e => {
        e.preventDefault();
        const { topic } = this.state;
        this.props.searchingQuestion(topic);
    }

    render() {
        const { isAuthenticated, user } = this.props.user;

        const authLinks = (
            <Fragment>
                <QuestionModal />
                <Logout />
                <NavItem id="navItem">
                    <span className='navbar-text mr-3'>
                        <strong>{user ? `Welcome ${user.username}` : ''}</strong>
                    </span>
                </NavItem>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <Button id="signup-btn">
                    <RegisterModal />
                </Button>

                <Button id="login-btn">
                    <LoginModal />
                </Button>

            </Fragment>
        )

        return (

            <Jumbotron id="jumbotron">
                <Form>
                    {isAuthenticated ? authLinks : guestLinks}
                </Form>
                <Container>
                    {/* // eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img src={Logo} alt="" />
                </Container>
                <Container>
                    <Form>
                        <BiSearchAlt id="search-icon" />
                        <input type="search" name="topic"
                            placeholder="JavaScript, HTML, CSS, Node, MySQL, Sequelize or Restful Services" onChange={this.onChange} />
                        <input type="submit" value="Search" onClick={this.onClick} />
                    </Form>
                </Container>
            </Jumbotron>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    topic: state.topic
})

export default connect(mapStateToProps, { searchingQuestion })(Header);