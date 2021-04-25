import { Slide, Box, useDisclosure, Button, Text, HStack, VStack } from '@chakra-ui/react';
import './styles.css';

/**
 * The drawer will generate graphs: scatterplots, whatever for whatever selected datapoint
 * @returns
 */
const Drawer = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <div className="togg">
        <Button onClick={onToggle}>Toggle Drawer</Button>
      </div>
      <Slide direction="bottom" in={isOpen} style={{ zIndex: 12 }}>
        <Box
          p="40px"
          color="white"
          mt="4"
          bg="#1a1a1aEF"
          rounded="md"
          shadow="md"
        >
          {/* <HStack>
            <VStack>
              
            </VStack>
          </HStack> */}
          <Text>Least Vaccinated Neighborhoods</Text>
          <Text>N16 DOUGLASS - 6.87%</Text>
        </Box>
        
      </Slide>
    </>
  );
};

export default Drawer;
