"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import cookie from 'js-cookie';

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/login", { password });
      if (res.status === 200) {
        // Set access_granted cookie with token and expiry
        const { token, expiresAt } = res.data; // Assuming your API returns token and expiry
        const expirySeconds = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);

        cookie.set('access_granted', token, {
          expires: expirySeconds / 3600, // expires in hours (e.g., 2 hours)
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        });

        router.push("/");
        toast.success("Login Success");
      } else {
        toast.error("Login Failed");
      }
    } catch (err) {
      toast.error("Error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-16 text-center z-50">
      <form onSubmit={handleSubmit}>
        <Label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password:
        </Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <Button type="submit" className="mt-3" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;