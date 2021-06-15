import React, { Component } from "react";
import { Flex, Box, Link, Button } from 'rebass';
import Welcome from "./Welcome";

class Main extends Component {
  render() {
    return (
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
          <Welcome/>
        </Box>
      </Box>
    );
  }
}

export default Main;