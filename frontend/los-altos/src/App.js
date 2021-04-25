import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';

import Content from './components/Content';
import Landing from './components/Landing';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh">
          <VStack spacing={8}>
            <Landing />
            <Content />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
