import Button from './components/Button';
import Card from './components/Card';
import Canvas from './features/Canvas';

function App() {
  return (
    <>
      <Button>This is a button</Button>
      <Card>This is the card</Card>
      <Canvas className="origin-top-left bg-black" width={100} height={100}>
        This will be displayed if canvas is not supported.
      </Canvas>
      <Card>This is the text after the canvas.</Card>
    </>
  );
}

export default App;
