"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { CheckCircleIcon, LogOut, Terminal, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};
const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };
  // Função para lidar com token expirado
  const handleAuthError = (message = "Problema de autenticação") => {
    localStorage.removeItem("token");
    alert(`${message}. Você será redirecionado para o login.`);

    // Usa window.location para garantir o redirecionamento
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };
  useEffect(() => {
    // Pega o nome do localStorage
    const name = localStorage.getItem("userName");

    if (name) {
      setUserName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
      console.log("Nome recuperado do localStorage:", name);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token não encontrado");
          router.push("/login");
          return;
        }

        const response = await axios.get("http://localhost:4000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log("Tarefas buscadas:", data);

        setTasks(data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          handleAuthError("Sua sessão expirou ou você não tem permissão");
        }
      }
    };

    fetchTasks();
  }, [router]);

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      setError(true);
      return;
    }
    setError(false);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado");
        router.push("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/tasks",
        {
          title: newTask,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);

      if (axios.isAxiosError(error)) {
        console.log("Status do erro:", error.response?.status);
        console.log("Data do erro:", error.response?.data);

        // Trata tanto 401 quanto 403 como problemas de autenticação
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Problema de autenticação - redirecionando...");
          localStorage.removeItem("token");
          alert(
            "Problema de autenticação. Você será redirecionado para o login."
          );

          // Força o redirecionamento
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
      }
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) return;

      const response = await axios.put(
        `http://localhost:4000/api/tasks/${taskId}`,
        {
          completed: !taskToUpdate.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleAuthError("Sua sessão expirou ou você não tem permissão");
      }
    }
  };
  const handleDeleteTask = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleAuthError("Sua sessão expirou ou você não tem permissão");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 space-y-8">
      {/* Header com nome do usuário e logout */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">Olá, {userName}</span>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Adicionar tarefas */}
      <div className="max-w-md mx-auto border-2 border-gray-300 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Adicionar tarefas
        </h1>
        <div className="flex gap-2 py-2">
          <Input
            type="text"
            placeholder="Nova tarefa"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button onClick={handleAddTask}>Adicionar</Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <Terminal />
            <AlertTitle>Erro!</AlertTitle>
            <AlertDescription>
              Por favor, digite uma tarefa válida.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Listar tarefas */}
      <div className="max-w-md mx-auto border-2 border-gray-300 p-4 rounded-md shadow-md mt-8">
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between gap-2 p-2 rounded-sm`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task.id)}
              />
              <span className={task.completed ? "line-through" : ""}>
                {task.title}
              </span>
              <span>
                <CheckCircleIcon className="text-green-500" />
              </span>
              <Button
                className="bg-red-500"
                onClick={() => handleDeleteTask(task.id)}
              >
                Excluir
              </Button>
            </li>
          ))}

          {tasks.length === 0 && <p>Nenhuma tarefa encontrada.</p>}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
