import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodontProvider } from './context/TodontContext';
import { ListCreator } from './components/ListCreator';
import { TodontList } from './components/TodontList';
import { NotFound } from './components/NotFound';

function App() {
  return (
    <TodontProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListCreator />} />
          <Route path="/l/:id" element={<TodontList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TodontProvider>
  );
}

export default App;
