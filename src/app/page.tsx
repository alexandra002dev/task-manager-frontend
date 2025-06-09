"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);
  return <div className="min-h-screen bg-gray-100 p-8"></div>;
};
export default Page;
