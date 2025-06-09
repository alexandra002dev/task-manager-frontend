"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError(true);
      return;
    }
    setError(false);
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });

      console.log("Login realizado com sucesso:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.name);
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center ">
        <div className="max-w-lg mx-auto flex rounded-lg overflow-hidden shadow-lg h-[400px] w-[900px] md: flex-col md:flex-row">
          <div className="text-black flex-1 bg-black p-5 space-y-3 flex flex-col items-center justify-center">
            <h1 className="text-center font-bold text-white">Crie sua conta</h1>
            <p className="text-gray-400 text-sm text-center ">
              Preencha seus dados
            </p>
            <Button onClick={() => router.push("/register")} className="w-full">
              Cadastrar
            </Button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="text-black flex-2 p-5 space-y-3 flex flex-col items-center justify-center "
          >
            <h1 className="text-center font-bold">Bem vindo de volta!</h1>
            <p className="text-gray-400 text-sm text-center ">
              Acesse sua conta agora mesmo!
            </p>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full">Entrar</Button>
            {error && (
              <Alert variant="destructive">
                <Terminal />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components and dependencies to your app using the
                  cli.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
