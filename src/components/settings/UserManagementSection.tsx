import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SettingsSection } from './SettingsSection';
import { toast } from 'sonner';
import type { AppUser, UserRole } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserFormData {
  username: string;
  password: string;
  role: UserRole;
}

const roleConfig: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
  newbie: { 
    label: 'Newbie', 
    icon: <Shield className="w-3 h-3" />, 
    color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' 
  },
  user: { 
    label: 'Usuário', 
    icon: <ShieldCheck className="w-3 h-3" />, 
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
  },
  admin: { 
    label: 'Admin', 
    icon: <ShieldAlert className="w-3 h-3" />, 
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
  },
};

const roleDescriptions: Record<UserRole, string> = {
  newbie: 'Apenas visualização. Não pode adicionar ou remover músicas.',
  user: 'Pode gerenciar fila e playlists. Sem acesso a configurações.',
  admin: 'Acesso total ao sistema, incluindo configurações e usuários.',
};

export function UserManagementSection() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    // Load users from localStorage (in production, this would come from backend)
    const saved = localStorage.getItem('app_users');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      // Default users
      const defaultUsers: AppUser[] = [
        { id: 'local_tsi', username: 'tsi', role: 'admin', createdAt: new Date().toISOString() },
        { id: 'local_user', username: 'user', role: 'user', createdAt: new Date().toISOString() },
        { id: 'local_guest', username: 'guest', role: 'newbie', createdAt: new Date().toISOString() },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const saveUsers = (newUsers: AppUser[]) => {
    setUsers(newUsers);
    localStorage.setItem('app_users', JSON.stringify(newUsers));
  };

  const handleAddUser = () => {
    if (!formData.username || !formData.password) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (users.some(u => u.username === formData.username)) {
      toast.error('Usuário já existe');
      return;
    }

    const newUser: AppUser = {
      id: `local_${formData.username}_${Date.now()}`,
      username: formData.username,
      role: formData.role,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    setShowAddDialog(false);
    setFormData({ username: '', password: '', role: 'user' });
    toast.success('Usuário criado com sucesso');
  };

  const handleEditUser = () => {
    if (!editingUser) return;

    const updated = users.map(u => 
      u.id === editingUser.id 
        ? { ...u, role: formData.role }
        : u
    );

    saveUsers(updated);
    setEditingUser(null);
    toast.success('Usuário atualizado');
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    // Prevent deleting the last admin
    const admins = users.filter(u => u.role === 'admin');
    if (userToDelete.role === 'admin' && admins.length <= 1) {
      toast.error('Não é possível remover o último administrador');
      setShowDeleteDialog(false);
      setUserToDelete(null);
      return;
    }

    saveUsers(users.filter(u => u.id !== userToDelete.id));
    setShowDeleteDialog(false);
    setUserToDelete(null);
    toast.success('Usuário removido');
  };

  const openEditDialog = (user: AppUser) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: '', role: user.role });
  };

  const openDeleteDialog = (user: AppUser) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  return (
    <SettingsSection
      title="Gerenciamento de Usuários"
      description="Cadastre e configure permissões de acesso"
      icon={<Users className="w-5 h-5 text-blue-400" />}
    >
      <div className="space-y-4">
        {/* User List */}
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{user.username}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${roleConfig[user.role].color}`}
                  >
                    {roleConfig[user.role].icon}
                    <span className="ml-1">{roleConfig[user.role].label}</span>
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(user)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => openDeleteDialog(user)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add User Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setFormData({ username: '', password: '', role: 'user' });
            setShowAddDialog(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Usuário
        </Button>

        {/* Role Legend */}
        <div className="p-3 rounded-lg bg-muted/30 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Níveis de Permissão:</p>
          {Object.entries(roleDescriptions).map(([role, desc]) => (
            <div key={role} className="flex items-start gap-2">
              <Badge 
                variant="outline" 
                className={`text-[10px] ${roleConfig[role as UserRole].color} shrink-0`}
              >
                {roleConfig[role as UserRole].icon}
                <span className="ml-1">{roleConfig[role as UserRole].label}</span>
              </Badge>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>
              Crie um novo usuário com as permissões desejadas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome de Usuário</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="usuario"
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label>Nível de Acesso</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newbie">Newbie - Apenas visualização</SelectItem>
                  <SelectItem value="user">Usuário - Gerencia fila/playlists</SelectItem>
                  <SelectItem value="admin">Admin - Acesso total</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>Criar Usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere o nível de acesso do usuário {editingUser?.username}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nível de Acesso</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newbie">Newbie - Apenas visualização</SelectItem>
                  <SelectItem value="user">Usuário - Gerencia fila/playlists</SelectItem>
                  <SelectItem value="admin">Admin - Acesso total</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o usuário "{userToDelete?.username}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  );
}
