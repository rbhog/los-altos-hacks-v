import Map from './Map';
import Drawer from './Drawer';
import Sidebar from './Sidebar';
import { position } from '@chakra-ui/styled-system';

const Content = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        margin: 0,
      }}
    >
      <Map />
      <Drawer />
      <Sidebar />
    </div>
  );
};

export default Content;
