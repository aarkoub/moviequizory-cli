import React, { Component } from "react";
import { Route, HashRouter } from "react-router-dom";
import { Flex, Box, Link, Button, Card, Image } from 'rebass';
import Countdown from 'react-countdown';


class Main extends Component {

  constructor(props) {
    super(props);
    if (process.env.NODE_ENV === 'development') {
      this.api_host = process.env.REACT_APP_API_HOST_DEV;
    }
    else {
      if (process.env.NODE_ENV === 'production') {
        this.api_host = process.env.REACT_APP_API_HOST_PROD;
      } else {
        this.api_host = process.env.REACT_APP_API_HOST_TEST;
      }
    }
    this.state = {
      error: undefined,
      user: { highscore: 0, id: "" }
    }
    this.setHighscore = this.setHighscore.bind(this)
  }

  async componentDidMount() {
    const response = await fetch(this.api_host + "users/create", { credentials: 'include' });
    this.setState({ isLoaded: true })
    if (response.error) {
      this.setState({ error: response.error });
    }
    else {
      const user = await response.json();
      this.setState({ user: user })
    }
  }

  setHighscore(highscore) {
    this.setState({ user: { highscore: highscore } })
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
            <Route path="/gameover" render={(props) => (<Result {...props} highscore={this.state.user.highscore} userId={this.state.user.id}
              setHighscore={this.setHighscore} />)} />
          </Box>
        </Box>
      </HashRouter>
    );
  }
}

class Quiz extends Component {

  constructor(props) {
    super(props);
    if (process.env.NODE_ENV === 'development') {
      this.api_host = process.env.REACT_APP_API_HOST_DEV;
    }
    else {
      if (process.env.NODE_ENV === 'production') {
        this.api_host = process.env.REACT_APP_API_HOST_PROD;
      } else {
        this.api_host = process.env.REACT_APP_API_HOST_TEST;
      }
    }
    this.checkAnswer = this.checkAnswer.bind(this);
    this.goToGameOver = this.goToGameOver.bind(this);
    this.countdownRef = React.createRef();
    this.state = {
      error: undefined,
      isLoaded: false,
      quiz: {
        questions: [{
          content: "",
          actor: { pictureURL: "" },
          movie: { pictureURL: "" }
        }]
      },
      current_question_ind: 0,
      curr_score: 0,
      left_time: Date.now() + 65000
    }
  }

  async componentDidMount() {
    const response = await fetch(this.api_host + "quizzes/generate", { credentials: 'include' });
    this.setState({ isLoaded: true })
    if (response.error) {
      this.setState({
        error: response.error,
        isLoaded: true
      });
    }
    else {
      const quiz = await response.json();
      this.setState({
        quiz: quiz,
        isLoaded: true
      })
    }
  }

  checkAnswer(response) {
    if (response === this.state.quiz.questions[this.state.current_question_ind].true) {
      this.setState({ curr_score: this.state.curr_score + 1 })
    }
    if (this.state.current_question_ind + 1 === this.state.quiz.questions.length) {
      this.props.history.push({
        pathname: "/gameover",
        state: { score: this.state.curr_score }
      });
    }
    else {
      this.setState({ current_question_ind: this.state.current_question_ind + 1 })
    }

    this.state.left_time = this.countdownRef.current.props.date;

  }

  goToGameOver() {
    this.props.history.push({
      pathname: "/gameover",
      state: { score: this.state.curr_score }
    });
  }

  render() {
    if (this.state.error) {
      return <Box>Erreur : {this.state.error.message}</Box>;
    } else if (!this.state.isLoaded) {
      return <Box>Chargement…</Box>;
    } else {
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
        <Countdown ref={this.countdownRef} date={this.state.left_time} onComplete={this.goToGameOver} />
      </Box>
    }
  }
}

class Result extends Component {

  constructor(props) {
    super(props);
    this.state = {
      score: props.location.state ? props.location.state.score : 0,
      highscore: this.props.highscore
    };
    this.retry = this.retry.bind(this);
    if (process.env.NODE_ENV === 'development') {
      this.api_host = process.env.REACT_APP_API_HOST_DEV;
    }
    else {
      if (process.env.NODE_ENV === 'production') {
        this.api_host = process.env.REACT_APP_API_HOST_PROD;
      } else {
        this.api_host = process.env.REACT_APP_API_HOST_TEST;
      }
    }

  }

  async componentDidMount() {
    if (this.state.score > this.props.highscore) {
      const response = await fetch(this.api_host + "users/" + this.props.userId + "/highscore/set",
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ new_highscore: this.state.score })
        });
      this.setState({ isLoaded: true })
      if (response.error) {
        this.setState({
          error: response.error,
          isLoaded: true
        });
      }
      this.props.setHighscore(this.state.score)
      this.setState({ highscore: this.state.score });
    }
  }

  retry() {
    this.props.history.push({
      pathname: "/play"
    });
  }

  render() {
    return <Box>
      <Box>Your score: {this.state.score}</Box>
      <Box>Your highest score: {this.state.highscore}</Box>
      <Button color='pink' bg='black' onClick={this.retry}>Retry?</Button>
    </Box>
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