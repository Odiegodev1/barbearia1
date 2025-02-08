import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// Configurar Supabase
const SUPABASE_URL = 'https://dnauphumydkysxtabeey.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuYXVwaHVteWRreXN4dGFiZWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MTIwMDIsImV4cCI6MjA1NDI4ODAwMn0.3aJnSN-WiC0Xtw-P5A2oRIBOBUUTeOGr4o6cVF8eMMs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    data_hora: "",
    barbeiro_id: "",
  });

  useEffect(() => {
    async function fetchBarbeiros() {
      const { data, error } = await supabase.from("barbeiros").select("*");
      if (error) console.error("Erro ao buscar barbeiros:", error);
      else setBarbeiros(data);
    }
    fetchBarbeiros();
  }, []);

  useEffect(() => {
    async function fetchAgendamentos() {
      const { data, error } = await supabase
        .from("agendamentos")
        .select("*, barbeiros(nome)")
        .order("data_hora", { ascending: true });

      if (error) console.error(error);
      else setAgendamentos(data);
    }
    fetchAgendamentos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.barbeiro_id) {
      alert("Por favor, escolha um barbeiro!");
      return;
    }

    const { error } = await supabase
      .from("agendamentos")
      .insert([{ ...formData, status: "Pendente" }]);

    if (error) {
      console.error(error);
      alert("Erro ao realizar o agendamento!");
    } else {
      setFormData({ nome: "", telefone: "", email: "", data_hora: "", barbeiro_id: "" });
      alert("Agendamento realizado com sucesso!");
    }
  };

  return (
    <section className="w-full h-full  bg-zinc-800 ">
      <header className="w-full py-4 px-2 bg-emerald-900"> 
        <Button onClick={() => navigate("/MarktU")}>Painel ADM</Button>
      </header>
      
      <div className="md:flex flex-col items-center justify-center mt-48">
        <main className="flex flex-col items-center flex-1">
          <h1 className="mb-2 md:text-3xl font-bold text-zinc-400 text-center">
            Agendamentos Barbearia 13
          </h1>

          <Card className="md:w-full max-w-md mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <Input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input type="tel" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Data e Hora</Label>
                  <Input type="datetime-local" name="data_hora" value={formData.data_hora} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Escolha um Barbeiro</Label>
                  <select name="barbeiro_id" value={formData.barbeiro_id} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Selecione um barbeiro</option>
                    {barbeiros.map((barbeiro) => (
                      <option key={barbeiro.id} value={barbeiro.id}>{barbeiro.nome}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">Agendar</Button>
              </form>
            </CardContent>
          </Card>
        </main>


        <div className="w-full md:w-1/2 px-3 md:mb-20 md:mt-20">
        {/* Lista de Agendamentos com Scroll */}
        <div className="flex-1 max-h-96 overflow-y-auto border p-4 rounded bg-zinc-900">
          <h2 className="text-lg font-semibold mb-2 text-zinc-400">Horários Agendados</h2>
          {agendamentos.length > 0 ? (
            agendamentos.map((item, index) => {
              const naFila = agendamentos.filter(
                (agendamento) => agendamento.barbeiro_id === item.barbeiro_id && 
                new Date(agendamento.data_hora) < new Date(item.data_hora)
              ).length;

              return (
                <Card key={item.id} className="mb-2">
                  <CardContent className="p-3">

                    <p className="font-medium">{item.nome}</p>
                    <p className="text-sm font-semibold text-zinc-900">Barbeiro: {item.barbeiros.nome}</p>
                    <p className="text-sm text-gray-600">{item.telefone} | {item.email}</p>
                    <p className="text-sm">{format(new Date(item.data_hora), "dd/MM/yyyy HH:mm")}</p>
                    
                    <p className="text-sm font-semibold text-zinc-400">Pessoas na frente: {naFila}</p>
                    <p className={`text-sm font-semibold ${
                      item.status === "Concluído" ? "text-green-600" : 
                      item.status === "Faltou" ? "text-red-600" : "text-yellow-600"
                    }`}>Status: {item.status}</p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-gray-500">Nenhum horário agendado ainda.</p>
          )}
        </div>
        </div>
      </div>
      <footer className="h-12 bg-zinc-900 border-t border-zinc-500 mt-20"></footer>
    </section>
  );
}
