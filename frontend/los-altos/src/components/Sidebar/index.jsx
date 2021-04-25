import {
  Slide,
  Box,
  Button,
  Divider,
  VStack,
  HStack,
  useDisclosure,
  Text,
  Tooltip
} from '@chakra-ui/react';

import { FaCircle } from 'react-icons/fa'

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
          p="20px"
          m="10px"
          color="white"
          mt="4"
          bg="#1a1a1aEF"
          rounded="md"
          shadow="md"
        >
          <VStack
            divider={<Divider borderColor="gray.600" />}
            spacing={4}
            align="stretch"
            className="sidebarWrapper"
          >
            <Text className="sidebarHeader" fontSize="2xl">Legend</Text>
            <VStack className="popDensityLegend" spacing={3}>
              <Tooltip label="population/mi²" bg="#262626" color="white">
                <Text className="legendHeader">Population Density</Text>
              </Tooltip>
              <Tooltip label="13.43  -  44897.16" bg="#262626" color="white">
                <Box w="90%" h="20px" bgGradient="linear(to-r, #eff3ff, #08519c)" rounded="sm"></Box>
              </Tooltip>
            </VStack>
            <VStack className="incomeLegend" spacing={3}>
              <Tooltip label="Height of 3D extrusions" bg="#262626" color="white">
                <Text className="legendHeader">Income</Text>
              </Tooltip>
              <HStack className="incomeRects">
                <Tooltip label="$21076" bg="#262626" color="white">
                  <Box w="10px" h="15px" bg="white" rounded="sm" mt="auto"></Box>
                </Tooltip>
                <Tooltip label="$165589" bg="#262626" color="white">
                  <Box w="10px" h="35px" bg="white" rounded="sm"></Box>
                </Tooltip>
              </HStack>
            </VStack>
            <VStack className="avgIncomeLegend" spacing={3}>
              <Text className="legendHeader">Average Income</Text>
              <Tooltip label="$21076  -  $165589" bg="#262626" color="white">
                <Box w="90%" h="20px" bgGradient="linear(to-r, #fa1100, #00ff11)" rounded="sm"></Box>
              </Tooltip>
            </VStack>
            <VStack className="casesLegend" spacing={3}>
              <Text className="legendHeader">Cases per Capita</Text>
              <HStack>
                <Tooltip label="Less cases" fontSize="lg" bg="#262626" color="white">
                  <span>
                    <FaCircle size={20}/>
                  </span>
                </Tooltip>
                <Text>  -  </Text>
                <Tooltip label="More cases" fontSize="lg" bg="#262626" color="white">
                  <span>
                    <FaCircle size={40} />
                  </span>
                </Tooltip>
              </HStack>
            </VStack>
            <VStack className="negCorrLegend" spacing={3}>
              <Text className="legendHeader">Negative Correlation</Text>
              <Tooltip label="-1.00  -  1.00" bg="#262626" color="white">
                <Box w="90%" h="20px" bgGradient="linear(to-r, #f00ec6, #262b01)" rounded="sm"></Box>
              </Tooltip>
            </VStack>
          </VStack>
        </Box>
      </Slide>
    </>
  );
};

export default Sidebar;
