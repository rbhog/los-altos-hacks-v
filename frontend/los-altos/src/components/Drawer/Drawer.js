import { Slide, Box, useDisclosure, Button } from '@chakra-ui/react';
import './pull.css';
const Drawer = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <div className="togg">
        <Button onClick={onToggle}>Click Me</Button>
      </div>
      <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
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
