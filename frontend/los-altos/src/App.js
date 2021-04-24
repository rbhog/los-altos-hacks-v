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
import { ColorModeSwitcher } from './ColorModeSwitcher';

import Map from './components/Map/Map';
import Drawer from './components/Drawer/Drawer';
import Sidebar from './components/Sidebar/Sidebar';
import Landing from './components/Landing/Landing'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh">
          {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
          <VStack spacing={8}>

            <Landing/>
            <Map />
            <Drawer />
            <Sidebar />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
