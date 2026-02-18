"use client";

import { useState, useTransition } from "react";
import { signUp } from "@/actions/auth.actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result.success) {
        setSuccess(true);
      } else if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-900/20 border border-green-700/50 text-green-400 text-sm">
          Cuenta creada. Revisa tu email para confirmar.
        </div>
      )}

      <Input
        id="displayName"
        name="displayName"
        type="text"
        label="Nombre"
        placeholder="Tu nombre"
        required
        minLength={2}
        maxLength={50}
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="tu@email.com"
        required
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="Mínimo 8 caracteres"
        required
        autoComplete="new-password"
        minLength={8}
      />

      <Button type="submit" loading={isPending} className="w-full" size="lg">
        Crear Cuenta
      </Button>
    </form>
  );
}
