import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/auth";

type ChatMessage = {
  id: string;
  user: string;
  role: string;
  text: string;
  ts: string;
};

export default function Chat() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || !user) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10),
      user: user.name,
      role: user.role,
      text,
      ts: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Chat interno</h2>
        <p className="text-sm text-muted-foreground">
          Todos os perfis podem usar. Configuravel para alertas de desconto/PDV.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversa</CardTitle>
          <CardDescription>Canal geral (stub, sem backend ainda)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Input
              placeholder="Assunto (opcional)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <form className="space-y-2" onSubmit={handleSend}>
              <Textarea
                placeholder="Digite sua mensagem"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button type="submit">Enviar</Button>
              </div>
            </form>
          </div>
          <ScrollArea className="h-64 rounded border p-3">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="border rounded-md p-2">
                    <div className="text-sm font-semibold">
                      {msg.user} <span className="text-xs text-muted-foreground">({msg.role})</span>
                    </div>
                    {topic && <div className="text-xs text-muted-foreground">Assunto: {topic}</div>}
                    <div className="text-sm mt-1">{msg.text}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {new Date(msg.ts).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
