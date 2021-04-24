import {
  Slide,
  Box,
  Button,
  Divider,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import './styles.css';

/**
 * The sidebar will display various data about population like:\
 * 1. Neighborhood
 * 2. Ward - Collection of neighborhood
 * 3. Census Tracked
 *
 */
const Sidebar = () => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <div className="toggll">
        <Button onClick={onToggle}>Toggle Sidebar</Button>
      </div>
      <Slide
        direction="left"
        in={isOpen}
        style={{ zIndex: 10, width: '10%', height: '80vh' }}
      >
        <Box
          p="40px"
          color="white"
          mt="4"
          bg="teal.500"
          rounded="md"
          shadow="md"
        >
          <VStack
            divider={<Divider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
          >
            <div>This is a sidebar</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>
            <div>Data module</div>

            <div>Data module</div>
          </VStack>
        </Box>
      </Slide>
    </>
  );
};

export default Sidebar;
