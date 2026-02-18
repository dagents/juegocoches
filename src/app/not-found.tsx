import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold gradient-text">404</h2>
        <p className="text-gray-400">
          La página que buscas no existe.
        </p>
        <Link href="/">
          <Button variant="secondary">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
