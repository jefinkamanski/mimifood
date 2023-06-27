import React from "react";
import { AgendamentosManeger } from './components/ManegerAgendamentos';
import { AddAgendamento } from './components/AddEditAgendamento';
import { Configuracoes } from './components/Configuracoes';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


export default function App() {
  return (
    <Router>
       <Routes>
        <Route path="/" element={<AgendamentosManeger />}></Route>
        <Route path="/novo-agendamento" element={<AddAgendamento />}></Route>
        <Route path="/novo-agendamento/:id" element={<AddAgendamento />}></Route>
        <Route path="/configuracoes" element={<Configuracoes />}></Route>
       </Routes>
    </Router>
  )
}
