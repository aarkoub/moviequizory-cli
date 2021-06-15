import React, { Component } from "react";
import { Route, HashRouter } from "react-router-dom";
import { Flex, Box, Link, Button } from 'rebass';

class Main extends Component {

  constructor(props) {
    super(props);
    this.api_host = process.env.REACT_APP_API_HOST_DEV;
    this.state = {
      error: undefined,
      user: undefined
    }
  }

  async componentDidMount() {
    const response = await fetch(this.api_host + "users/create", { credentials: 'include' });
    this.setState({ isLoaded: true })
    if (response.error) {
      this.setState({ error: response.error });
    }
    else {
      this.setState({ user: response.json() })
    }
  }

  render() {
    return (
      <HashRouter>
        <Box>
          <Flex
            px={2}
            color='white'
            bg='Pink'
            alignItems='center'>
            <Link sx={{
              display: 'inline-block',
              fontWeight: 'bold',
              px: 2,
              py: 1,
              color: 'inherit',
            }} variant='nav' href='/'>
              MovieQuizory
          </Link>
          </Flex>
          <Box id="content">
            <Route exact path="/" component={Welcome} />
            <Route path="/play" component={Quiz} />
            <Route path="/gameover" component={Result}/>
          </Box>
        </Box>
      </HashRouter>
    );
  }
}

class Quiz extends Component{
  
  constructor(props) {
    super(props);
    this.api_host = process.env.REACT_APP_API_HOST_DEV;
    this.state = {
        error: undefined,
        quiz: undefined
    }
}

  async componentDidMount() {
    const response = await fetch(this.api_host + "quizzes/generate", { credentials: 'include' });
      this.setState({ isLoaded: true })
      if (response.error) {
          this.setState({ error: response.error });
      }
      else {
          this.setState({ quiz: response.json() })
      }
  }

  render(){
    return <div>Display quiz</div>
  }
}

class Result extends Component{
  render(){
    return <div>Display results</div>
  }

}

class Welcome extends Component {

  constructor(props) {
      super(props);
      this.startGame = this.startGame.bind(this);
  }

  startGame(){
      this.props.history.push("/play");
  }


  render() {
      return (
          <Box id='welcome'>
              <Box id='rules'>
                  Welcome to the quizz ! You'll be asked a series of "Yes or No" questions. Answer as many as you can in the allowed time ! Good luck !
           </Box>
              <Button color='pink' bg='black' onClick={this.startGame}>Start</Button>
          </Box>

      );
  }

}


export default Main;