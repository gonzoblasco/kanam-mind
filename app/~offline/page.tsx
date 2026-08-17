export default function Offline() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Estás offline</h1>
      <p className="max-w-md text-muted-foreground">
        Kanam Mind funciona sin conexión. Tus entradas están guardadas en tu
        máquina y podés seguir registrando. El resumen IA necesita conexión a
        Ollama local.
      </p>
    </div>
  );
}
