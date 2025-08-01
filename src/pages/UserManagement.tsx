import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  User,
  Mail,
  Phone,
  Key,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
  phone: string;
  company: string;
}

const UserManagement: React.FC = () => {
  const { 
    users, 
    addUser, 
    updateUserById, 
    deleteUser, 
    toggleUserStatus, 
    resetUserPassword 
  } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
    company: ''
  });

  const [editUser, setEditUser] = useState<any>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = async () => {
    setError('');
    setIsLoading(true);

    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Wszystkie pola są wymagane');
      setIsLoading(false);
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setError('Hasła nie są identyczne');
      setIsLoading(false);
      return;
    }

    if (newUser.password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setError('Nieprawidłowy format adresu email');
      setIsLoading(false);
      return;
    }

    try {
      const success = await addUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        company: newUser.company,
        ebayConnected: false
      });

      if (success) {
        setNewUser({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          phone: '',
          company: ''
        });
        setShowAddModal(false);
        setSuccess('Użytkownik został pomyślnie dodany');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Użytkownik z tym adresem email już istnieje');
      }
    } catch (error) {
      setError('Wystąpił błąd podczas dodawania użytkownika');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = () => {
    setError('');
    setIsLoading(true);

    try {
      updateUserById(selectedUser.id, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        phone: editUser.phone,
        company: editUser.company
      });

      setShowEditModal(false);
      setSelectedUser(null);
      setSuccess('Dane użytkownika zostały zaktualizowane');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Wystąpił błąd podczas aktualizacji danych');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser && selectedUser.id !== 'admin-001') {
      deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      setSuccess('Użytkownik został usunięty');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setIsLoading(true);

    if (newPassword !== confirmNewPassword) {
      setError('Hasła nie są identyczne');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      setIsLoading(false);
      return;
    }

    try {
      const success = await resetUserPassword(selectedUser.id, newPassword);
      if (success) {
        setShowPasswordModal(false);
        setSelectedUser(null);
        setNewPassword('');
        setConfirmNewPassword('');
        setSuccess('Hasło zostało zresetowane');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Nie udało się zresetować hasła');
      }
    } catch (error) {
      setError('Wystąpił błąd podczas resetowania hasła');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      company: user.company || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openPasswordModal = (user: any) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmNewPassword('');
    setShowPasswordModal(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Zarządzanie użytkownikami"
        subtitle={`${filteredUsers.length} ${filteredUsers.length === 1 ? 'użytkownik' : 'użytkowników'}`}
      />
      
      <div className="flex-1 p-6 bg-slate-900">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Szukaj użytkowników..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj użytkownika</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Użytkownik</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Kontakt</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Rola</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Ostatnie logowanie</th>
                  <th className="text-right py-4 px-6 text-slate-300 font-medium">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-900/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-slate-400 text-sm">{user.email}</p>
                          {user.company && (
                            <p className="text-slate-500 text-xs">{user.company}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-300 text-sm">
                        {user.phone && (
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          user.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className={`text-sm ${
                          user.isActive ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {user.isActive ? 'Aktywny' : 'Nieaktywny'}
                        </span>
                        {user.ebayConnected && (
                          <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            eBay
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300 text-sm">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('pl-PL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Nigdy'
                      }
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                          title="Edytuj użytkownika"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openPasswordModal(user)}
                          className="p-2 text-slate-400 hover:text-yellow-400 transition-colors"
                          title="Resetuj hasło"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          disabled={user.id === 'admin-001'}
                          className="p-2 text-slate-400 hover:text-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={user.isActive ? 'Dezaktywuj' : 'Aktywuj'}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          disabled={user.id === 'admin-001'}
                          className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Usuń użytkownika"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Dodaj nowego użytkownika</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Adres email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="jan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hasło *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Minimum 6 znaków"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Potwierdź hasło *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Powtórz hasło"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="+48 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Firma
                </label>
                <input
                  type="text"
                  value={newUser.company}
                  onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Nazwa firmy"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rola
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="user">Użytkownik</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleAddUser}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Dodawanie...' : 'Dodaj użytkownika'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Edytuj użytkownika</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Adres email
                </label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={editUser.phone}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Firma
                </label>
                <input
                  type="text"
                  value={editUser.company}
                  onChange={(e) => setEditUser({ ...editUser, company: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rola
                </label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  disabled={selectedUser.id === 'admin-001'}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="user">Użytkownik</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleEditUser}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Usuń użytkownika</h3>
                <p className="text-slate-400 text-sm">Ta akcja jest nieodwracalna</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-300 mb-2">
                Czy na pewno chcesz usunąć użytkownika:
              </p>
              <div className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                <p className="text-white font-medium">{selectedUser.name}</p>
                <p className="text-slate-400 text-sm">{selectedUser.email}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Usuń użytkownika
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Resetuj hasło</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-slate-300 mb-2">
                Resetuj hasło dla użytkownika:
              </p>
              <div className="bg-slate-900 border border-slate-600 rounded-lg p-3 mb-4">
                <p className="text-white font-medium">{selectedUser.name}</p>
                <p className="text-slate-400 text-sm">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nowe hasło
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Minimum 6 znaków"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Potwierdź hasło
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Powtórz nowe hasło"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
              >
                {isLoading ? 'Resetowanie...' : 'Resetuj hasło'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;