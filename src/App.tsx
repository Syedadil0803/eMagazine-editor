import { Routes, Route } from 'react-router-dom';
import FlipbookEditor from './pages/FlipbookEditor';
import '@arco-design/web-react/dist/css/arco.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FlipbookEditor />} />
    </Routes>
  );
}

export default App;
