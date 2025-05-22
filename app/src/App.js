
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import './tailwind.css'
import MainPage from './Pages/MainPage';


function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<MainPage/>}/>
      
      
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
