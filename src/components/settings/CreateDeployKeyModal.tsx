import { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreateDeployKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateDeployKeyModal({ open, onOpenChange, onSuccess }: CreateDeployKeyModalProps) {
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Digite um título para a chave');
      return;
    }

    if (!key.trim()) {
      toast.error('Cole a chave pública SSH');
      return;
    }

    // Basic SSH key validation
    if (!key.startsWith('ssh-') && !key.startsWith('ecdsa-')) {
      toast.error('Chave SSH inválida. Deve começar com ssh- ou ecdsa-');
      return;
    }

    setIsCreating(true);

    try {
      const response = await supabase.functions.invoke('github-repo', {
        body: {
          action: 'create-deploy-key',
          title: title.trim(),
          key: key.trim(),
          read_only: readOnly,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create deploy key');
      }

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to create deploy key');
      }

      toast.success('Deploy key criada com sucesso!');
      setTitle('');
      setKey('');
      setReadOnly(true);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao criar deploy key: ${errorMessage}`);
      console.error('[CreateDeployKeyModal] Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-kiosk-primary" />
            Adicionar Deploy Key
          </DialogTitle>
          <DialogDescription>
            Deploy keys são chaves SSH que concedem acesso ao repositório.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="key-title">Título</Label>
            <Input
              id="key-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Server Production"
              className="bg-kiosk-background border-kiosk-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-content">Chave Pública SSH</Label>
            <Textarea
              id="key-content"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="ssh-ed25519 AAAA... user@host"
              className="bg-kiosk-background border-kiosk-border font-mono text-xs min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Cole sua chave pública SSH (arquivo .pub)
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-kiosk-background/50 border border-kiosk-border">
            <div>
              <Label>Somente Leitura</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {readOnly
                  ? 'A chave só pode clonar/pull'
                  : 'A chave pode push/write (menos seguro)'}
              </p>
            </div>
            <Switch
              checked={readOnly}
              onCheckedChange={setReadOnly}
            />
          </div>

          {!readOnly && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
              ⚠️ Chaves com permissão de escrita podem modificar o repositório. Use com cuidado!
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Deploy Key'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
