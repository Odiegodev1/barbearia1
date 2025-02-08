import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { format } from "date-fns";

// Configurar Supabase
const SUPABASE_URL = 'https://dnauphumydkysxtabeey.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuYXVwaHVteWRreXN4dGFiZWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MTIwMDIsImV4cCI6MjA1NDI4ODAwMn0.3aJnSN-WiC0Xtw-P5A2oRIBOBUUTeOGr4o6cVF8eMMs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminPanel() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [barbeiro, setBarbeiro] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Buscar lista de barbeiros
  useEffect(() => {
    async function fetchBarbeiros() {
      const { data, error } = await supabase.from("barbeiros").select("*");
      if (error) console.error("Erro ao buscar barbeiros:", error);
      else setBarbeiros(data);
    }
    fetchBarbeiros();
  }, []);

  // Buscar agendamentos do barbeiro logado
  useEffect(() => {
    if (!barbeiro) return;

    async function fetchAgendamentos() {
      const { data, error } = await supabase
        .from("agendamentos")
        .select("*, barbeiros(nome)")
        .eq("barbeiro_id", barbeiro.id)
        .order("data_hora", { ascending: true });

      if (error) console.error("Erro ao buscar agendamentos:", error);
      else setAgendamentos(data);
    }

    fetchAgendamentos();

    // Configurar listener em tempo real
    const channel = supabase
      .channel("realtime_agendamentos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agendamentos" },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new.barbeiro_id === barbeiro.id) {
            setAgendamentos((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setAgendamentos((prev) =>
              prev.map((agendamento) =>
                agendamento.id === payload.new.id ? payload.new : agendamento
              )
            );
          } else if (payload.eventType === "DELETE") {
            setAgendamentos((prev) =>
              prev.filter((agendamento) => agendamento.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [barbeiro]);

  // Atualizar status do agendamento
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("agendamentos")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
    }
  };

  // Excluir agendamento
  const deleteAgendamento = async (id) => {
    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
    }
  };

  // Login do Barbeiro
  const handleLogin = (id) => {
    const selectedBarbeiro = barbeiros.find((b) => b.id === id);
    setBarbeiro(selectedBarbeiro);
    setIsLoggedIn(true);
  };

  // Logout do Barbeiro
  const handleLogout = () => {
    setBarbeiro(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-zinc-800 flex flex-col items-center p-6">
      {!isLoggedIn ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Escolha seu perfil</h1>
          <div className="w-full max-w-md">
            {barbeiros.length > 0 ? (
              barbeiros.map((b) => (
                <Card key={b.id} className="mb-2">
                  <CardContent className="p-3 flex justify-between gap-2 items-center">
                    <p className="font-medium text-zinc-800">{b.nome}</p>
                    <Button onClick={() => handleLogin(b.id)}>Entrar</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Nenhum barbeiro cadastrado.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 text-white">Painel do Barbeiro</h1>
          <p className="text-lg text-gray-400 mb-4">Bem-vindo, {barbeiro?.nome}!</p>
          <Button variant="destructive" onClick={handleLogout}>
            Sair
          </Button>

          <div className="w-full max-w-md mt-6">
            <h2 className="text-lg font-semibold mb-2 text-white">Seus Agendamentos</h2>
            {agendamentos.length > 0 ? (
              agendamentos.map((item) => (
                <Card key={item.id} className="mb-2">
                  <CardContent className="p-3 space-y-2">
                    <p className="font-medium">{item.nome}</p>
                    <p className="text-sm text-gray-600">
                      {item.telefone} | {item.email}
                    </p>
                    <p className="text-sm">{format(new Date(item.data_hora), "dd/MM/yyyy HH:mm")}</p>
                    <p className={`text-sm font-semibold ${
                      item.status === "Concluído" ? "text-green-600" :
                      item.status === "Faltou" ? "text-red-600" :
                      "text-yellow-600"
                    }`}>
                      Status: {item.status}
                    </p>

                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => updateStatus(item.id, "Concluído")}>
                        ✅ Concluído
                      </Button>
                      <Button variant="outline" onClick={() => updateStatus(item.id, "Faltou")}>
                        ❌ Faltou
                      </Button>
                      <Button variant="destructive" onClick={() => deleteAgendamento(item.id)}>
                        🗑 Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Nenhum agendamento disponível.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
