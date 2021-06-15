import React, { Component } from "react";
import {Box, Button } from 'rebass';

class Welcome extends Component {

    constructor(props) {
        super(props);
        this.api_host = process.env.REACT_APP_API_HOST_DEV;
    }

    async componentDidMount() {
        const response = await fetch(this.api_host + "users/create", { credentials: 'include' });
        this.setState({ isLoaded: true })
        if (response.error) {
            this.setState({ error: response.error });
        }
    }

    render() {
        return (
            <Box id='welcome'>
                <Box id='rules'>
                    Welcome to the quizz ! You'll be asked a series of "Yes or No" questions. Answer as many as you can in the allowed time ! Good luck !
             </Box>
                <Button color='pink' bg='black'>Start</Button>
            </Box>

        );
    }

}

export default Welcome;