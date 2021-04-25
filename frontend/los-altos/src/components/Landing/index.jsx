import { Center, Box, Button, Text, VStack } from '@chakra-ui/react';
import './landing-style.css';
import { FaChevronDown } from 'react-icons/fa'
const Landing = () => {

  return (
    <>
      <Box w="100%" h="1080px" bgImage="url('./img/mapbox_dark.jpg')">
        <div className="blurContainer">
            <Center h="85%">
                <Box className="feature">
                    <VStack spacing={5} >
                        <Text className="title" fontSize="7xl">
                            Project Title Here
                        </Text>
                        <Text className="description" fontSize="xl">
                            More descriptions and funny shit here
                        </Text>
                    </VStack>
                </Box>
            </Center>
            

            <Button className="scrollButton" variant="ghost"><FaChevronDown size={40} /></Button>
        </div>
        
      </Box>
      
    </>
  );
};

export default Landing;
