import Link from "next/link";
import Card from "@/components/ui/Card";
import RegisterForm from "@/components/auth/RegisterForm";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function RegisterPage() {
  return (
    <Card glow="purple">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text">Crear Cuenta</h1>
          <p className="text-sm text-gray-400 mt-1">
            Únete a la comunidad y empieza a proponer
          </p>
        </div>

        <GoogleAuthButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-card" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-card px-2 text-gray-500">
              o con email
            </span>
          </div>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-neon-cyan hover:text-cyan-300 transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </Card>
  );
}
