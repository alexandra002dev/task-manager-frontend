"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(name, email, password);
    e.preventDefault();
    if (!name || !email || !password) {
      setError(true);
      return;
    }
    setError(false);
    try {
      const response = await axios.post("http://localhost:4000/api/register", {
        name,
        email,
        password,
      });
      router.push("/login");

      console.log("Cadastro realizado com sucesso:", response.data);
      localStorage.setItem("token", response.data.token);
      router.push("/login");
    } catch (error) {
      console.error("Erro no registro:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center ">
      <div className="max-w-lg mx-auto flex rounded-lg overflow-hidden shadow-lg h-[400px] w-[900px] md: flex-col md:flex-row">
        <form
          onSubmit={handleSubmit}
          className="text-black flex-2 p-5 space-y-3 flex flex-col items-center justify-center "
        >
          <h1 className="text-center font-bold">Criar Conta</h1>
          <p className="text-gray-400 text-sm text-center  ">
            Cadastre seu email e senha para acessar sua conta
          </p>
          <Input
            className="w-[60%] "
            placeholder="Nome de usuário"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className="w-[60%] "
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className="w-[60%] "
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-[60%] ">Cadastrar</Button>
          {error && (
            <Alert variant="destructive">
              <Terminal />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Preencha todos os campos obrigatoriamente
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};
export default RegisterPage;
