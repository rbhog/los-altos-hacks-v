import { Slide, Box, useDisclosure, Button } from '@chakra-ui/react';
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
          bg="teal.500"
          rounded="md"
          shadow="md"
        >
          bruh
        </Box>
      </Slide>
    </>
  );
};

export default Drawer;
