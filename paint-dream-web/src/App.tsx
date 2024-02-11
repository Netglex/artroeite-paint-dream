import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ColorDto, CreatePixelInfoDto, PositionDto } from './clients/pixel_info';
import { PixelInfoClient } from './clients/pixel_info.client';
import Button from './components/Button';
import Card from './components/Card';
import Canvas from './features/Canvas';

function App() {
  const test = async () => {
    const position: PositionDto = {
      x: 2,
      y: 3,
    };

    const color: ColorDto = {
      r: 1,
      g: 0.5,
      b: 0,
    };

    const createPixelInfo: CreatePixelInfoDto = {
      position,
      color,
    };

    const client = new PixelInfoClient(
      new GrpcWebFetchTransport({
        baseUrl: 'http://localhost:8080',
      }),
    );
    const { response } = await client.createPixelInfo(createPixelInfo);

    console.log(`Call made: '${response}'`);
  };

  return (
    <>
      <Button onClick={test}>This is a button</Button>
      <Card>This is the card</Card>
      <Canvas className="origin-top-left bg-black" width={100} height={100}>
        This will be displayed if canvas is not supported.
      </Canvas>
      <Card>This is the text after the canvas.</Card>
    </>
  );
}

export default App;
