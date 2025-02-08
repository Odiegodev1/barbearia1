
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Markt from './Markt';
import Marktp from './MarktP';
import MarktU from './MarktU';
// Páginas (Componentes)


const App = () => {
  return (
    <Router>
    

        {/* Definindo as rotas */}
        <Routes>
          <Route path="/" element={<Markt />} />
          <Route path="/Marktp" element={<Marktp />} />
          <Route path="/MarktU" element={<MarktU />} />
         
        </Routes>
      
    </Router>
  );
};

export default App;
