import React, { Component } from "react";
import { Route, HashRouter } from "react-router-dom";
import { Flex, Box, Link, Button, Card, Image } from 'rebass';
import Countdown from 'react-countdown';

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
            <Route path="/gameover" component={Result} />
          </Box>
        </Box>
      </HashRouter>
    );
  }
}

class Quiz extends Component {

  constructor(props) {
    super(props);
    this.api_host = process.env.REACT_APP_API_HOST_DEV;
    this.checkAnswer = this.checkAnswer.bind(this);
    this.goToGameOver = this.goToGameOver.bind(this);
    this.state = {
      error: undefined,
      quiz: {
        questions: [{
          content: "",
          actor: { pictureURL: "" },
          movie: { pictureURL: "" }
        }]
      },
      current_question_ind: 0,
      curr_score: 0,
      loadCountdown: false
    }
  }

  async componentDidMount() {
    const response = await fetch(this.api_host + "quizzes/generate", { credentials: 'include' });
    this.setState({ isLoaded: true })
    if (response.error) {
      this.setState({ error: response.error });
    }
    else {
      const quiz = await response.json();
      this.setState({
        quiz: quiz,
        loadCountdown: true
      })
    }
  }

  checkAnswer(response) {
    if (response === this.state.quiz.questions[this.state.current_question_ind].true) {
      this.setState({ curr_score: this.state.curr_score + 1 })
    }
    if (this.state.current_question_ind === this.state.current_question_ind + 1 == this.state.quiz.questions.length) {
      this.props.history.push("/gameover");
    }
    else {
      this.setState({ current_question_ind: this.state.current_question_ind + 1 })
    }
  }

  goToGameOver() {
    this.props.history.push({
      pathname: "/gameover",
      state: { score: this.state.curr_score }
    });
  }

  render() {
    return <Box>
      <Box>{this.state.quiz.questions[this.state.current_question_ind].content}</Box>
      <Flex>
        <Box>
          <Card>
            <Image
              sx={{ width: ['100%', '50%'], borderRadius: 8 }}
              src={this.state.quiz.questions[this.state.current_question_ind].actor.pictureURL} />
          </Card>
          <Button color='pink' bg='black' onClick={() => this.checkAnswer(true)}>Yes</Button>
        </Box>
        <Box>
          <Card>
            <Image
              sx={{ width: ['100%', '50%'], borderRadius: 8 }}
              src={this.state.quiz.questions[this.state.current_question_ind].movie.pictureURL} />
          </Card>
          <Button color='pink' bg='black' onClick={() => this.checkAnswer(false)}>No</Button>
        </Box>
      </Flex>
      <Box>Score: {this.state.curr_score}</Box>
      {this.state.loadCountdown ? (<Countdown date={Date.now() + 60000} onComplete={this.goToGameOver} />) : <div></div>}
    </Box>
  }
}

class Result extends Component {

  constructor(props) {
    super(props);
    console.log(props)
    this.state = props.location.state? props.location.state : {score : 0};
  }

  render() {
    return <div>Score: {this.state.score}</div>
  }

}

class Welcome extends Component {

  constructor(props) {
    super(props);
    this.startGame = this.startGame.bind(this);
  }

  startGame() {
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