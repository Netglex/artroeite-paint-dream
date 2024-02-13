import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { ColorDto, CreatePixelInfoDto, PositionDto } from './clients/pixel_info';
import { PixelInfoClient } from './clients/pixel_info.client';
import Button from './components/Button';
import Card from './components/Card';
import Canvas from './features/Canvas';
import { Empty } from './clients/google/protobuf/empty';

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
    console.log(`Call made: '${JSON.stringify(response, (_, v) => (typeof v === 'bigint' ? v.toString() : v))}'`);

    const empty: Empty = {};
    const call = client.subscribePixelInfoUpdates(empty);
    for await (const response2 of call.responses) {
      console.log(
        `Received message: '${JSON.stringify(response2, (_, v) => (typeof v === 'bigint' ? v.toString() : v))}'`,
      );
    }
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
