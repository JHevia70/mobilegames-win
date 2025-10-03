'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  getAllSubscribers, 
  getSubscriberStats, 
  exportSubscribersToCSV,
  downloadCSV,
  getEmailQuota,
  updateSubscriber,
  deleteSubscriber,
  bulkUpdateSubscribers,
  bulkDeleteSubscribers,
  getAllGroups,
  type Subscriber,
  type EmailQuota,
  type SubscriberGroup
} from '@/lib/newsletter';
import { Users, TrendingUp, Mail, Download, Search, Calendar, CheckCircle, Loader2, AlertTriangle, Zap, Trash2, Ban, Tag, X, Edit2, Plus, Folder } from 'lucide-react';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [emailQuota, setEmailQuota] = useState<EmailQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Nuevos estados para gestión de suscriptores
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked'>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState<'delete' | 'block' | 'activate' | 'group' | null>(null);
  
  // Grupos disponibles
  const [groups, setGroups] = useState<SubscriberGroup[]>([]);

  // Tab activa
  const [activeTab, setActiveTab] = useState<'subscribers' | 'groups'>('subscribers');  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = subscribers;

    // Filtrar por búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === filterStatus);
    }

    // Filtrar por grupo
    if (filterGroup !== 'all') {
      filtered = filtered.filter(sub => sub.groups?.includes(filterGroup));
    }

    setFilteredSubscribers(filtered);
  }, [searchTerm, subscribers, filterStatus, filterGroup]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subsData, statsData, quotaData, groupsData] = await Promise.all([
        getAllSubscribers(),
        getSubscriberStats(),
        getEmailQuota(),
        getAllGroups()
      ]);
      setSubscribers(subsData);
      setFilteredSubscribers(subsData);
      setStats(statsData);
      setEmailQuota(quotaData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = exportSubscribersToCSV(subscribers);
    downloadCSV(csv, `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Selección
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubscribers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubscribers.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Acciones individuales
  const handleDelete = async (id: string) => {
    try {
      await deleteSubscriber(id);
      await loadData();
      setShowDeleteModal(false);
      setSubscriberToDelete(null);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Error al eliminar el suscriptor');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      await updateSubscriber(id, { status: newStatus });
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al cambiar el estado');
    }
  };

  // Acciones en lote
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`¿Eliminar ${selectedIds.size} suscriptores seleccionados?`)) return;
    
    try {
      await bulkDeleteSubscribers(Array.from(selectedIds));
      setSelectedIds(new Set());
      await loadData();
    } catch (error) {
      console.error('Error bulk delete:', error);
      alert('Error al eliminar suscriptores');
    }
  };

  const handleBulkBlock = async () => {
    if (selectedIds.size === 0) return;
    
    try {
      await bulkUpdateSubscribers(Array.from(selectedIds), { status: 'blocked' });
      setSelectedIds(new Set());
      await loadData();
    } catch (error) {
      console.error('Error bulk block:', error);
      alert('Error al bloquear suscriptores');
    }
  };

  const handleBulkActivate = async () => {
    if (selectedIds.size === 0) return;
    
    try {
      await bulkUpdateSubscribers(Array.from(selectedIds), { status: 'active' });
      setSelectedIds(new Set());
      await loadData();
    } catch (error) {
      console.error('Error bulk activate:', error);
      alert('Error al activar suscriptores');
    }
  };

  const handleAddToGroup = async (groupId: string) => {
    if (selectedIds.size === 0) return;
    
    try {
      // Obtener los suscriptores seleccionados
      const selected = subscribers.filter(s => selectedIds.has(s.id));
      
      // Actualizar cada uno agregando el grupo (sin eliminar grupos existentes)
      for (const sub of selected) {
        const currentGroups = sub.groups || [];
        if (!currentGroups.includes(groupId)) {
          await updateSubscriber(sub.id, { 
            groups: [...currentGroups, groupId] 
          });
        }
      }
      
      setSelectedIds(new Set());
      setShowGroupModal(false);
      await loadData();
    } catch (error) {
      console.error('Error adding to group:', error);
      alert('Error al asignar grupo');
    }
  };

  const formatDate = (date: any) => {
    try {
      if (!date) return 'N/A';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white">Newsletter</h1>
            <p className="text-gray-400 mt-2">
              Gestión de suscriptores y estadísticas
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={subscribers.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-started"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Filtros y acciones masivas */}
        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="blocked">Bloqueados</option>
              </select>
            </div>

            {/* Filtro por grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Grupo</label>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los grupos</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>

            {/* Contador de seleccionados */}
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                {selectedIds.size > 0 && (
                  <span className="text-blue-400 font-semibold">
                    {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción masiva */}
          {selectedIds.size > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
              <button
                onClick={() => setShowGroupModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
              >
                <Tag className="w-4 h-4" />
                <span>Asignar Grupo</span>
              </button>
              <button
                onClick={handleBulkActivate}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Activar</span>
              </button>
              <button
                onClick={handleBulkBlock}
                className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition"
              >
                <Ban className="w-4 h-4" />
                <span>Bloquear</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          )}
        </div>

        {/* Email Quota Alert - Mostrar solo si hay alerta */}
        {emailQuota && emailQuota.percentage > 70 && (
          <div className={`rounded-lg p-4 flex items-start space-x-3 ${
            emailQuota.percentage > 90 
              ? 'bg-red-900 bg-opacity-30 border border-red-800' 
              : 'bg-yellow-900 bg-opacity-30 border border-yellow-800'
          }`}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              emailQuota.percentage > 90 ? 'text-red-400' : 'text-yellow-400'
            }`} />
            <div className="flex-1">
              <h3 className={`font-semibold ${
                emailQuota.percentage > 90 ? 'text-red-300' : 'text-yellow-300'
              }`}>
                {emailQuota.percentage > 90 ? '⚠️ Cuota de emails casi agotada' : '⚡ Cuota de emails alta'}
              </h3>
              <p className={`text-sm mt-1 ${
                emailQuota.percentage > 90 ? 'text-red-200' : 'text-yellow-200'
              }`}>
                Has usado {emailQuota.used} de {emailQuota.total} emails disponibles 
                ({emailQuota.percentage.toFixed(1)}%). 
                {emailQuota.percentage > 90 
                  ? ' Considera actualizar tu plan o esperar al próximo mes.' 
                  : ' Monitorea el uso para evitar quedarte sin cuota.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Suscriptores</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Suscriptores Activos</p>
                <p className="text-3xl font-bold mt-2">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Tasa de Conversión</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 bg-opacity-30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Nueva tarjeta de cuota de emails */}
          <div className={`bg-gradient-to-br rounded-lg p-6 text-white ${
            !emailQuota || emailQuota.percentage > 90 
              ? 'from-red-600 to-red-700' 
              : emailQuota.percentage > 70 
              ? 'from-yellow-600 to-yellow-700' 
              : 'from-cyan-600 to-cyan-700'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-opacity-90 text-sm font-medium">Cuota de Emails</p>
                <p className="text-3xl font-bold mt-2">
                  {emailQuota ? emailQuota.remaining.toLocaleString() : '---'}
                </p>
                <p className="text-xs text-white text-opacity-75 mt-1">
                  {emailQuota ? `de ${emailQuota.total.toLocaleString()} disponibles` : 'Cargando...'}
                </p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            {emailQuota && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white text-opacity-75 mb-1">
                  <span>Usado: {emailQuota.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      emailQuota.percentage > 90 ? 'bg-red-300' : 'bg-white'
                    }`}
                    style={{ width: `${Math.min(emailQuota.percentage, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas mensuales de emails */}
        {emailQuota?.monthlyStats && (
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-6 border border-indigo-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Estadísticas del Mes</h3>
                  <p className="text-indigo-200 text-sm">
                    {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4 text-indigo-300" />
                  <p className="text-indigo-200 text-xs font-medium">Enviados</p>
                </div>
                <p className="text-2xl font-bold text-white">{emailQuota.monthlyStats.sent}</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <p className="text-green-200 text-xs font-medium">Entregados</p>
                </div>
                <p className="text-2xl font-bold text-white">{emailQuota.monthlyStats.delivered}</p>
                <p className="text-xs text-green-200 mt-1">
                  {emailQuota.monthlyStats.sent > 0 
                    ? `${((emailQuota.monthlyStats.delivered / emailQuota.monthlyStats.sent) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-cyan-300" />
                  <p className="text-cyan-200 text-xs font-medium">Aperturas</p>
                </div>
                <p className="text-2xl font-bold text-white">{emailQuota.monthlyStats.opens}</p>
                <p className="text-xs text-cyan-200 mt-1">
                  {emailQuota.monthlyStats.delivered > 0 
                    ? `${((emailQuota.monthlyStats.opens / emailQuota.monthlyStats.delivered) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <p className="text-yellow-200 text-xs font-medium">Clicks</p>
                </div>
                <p className="text-2xl font-bold text-white">{emailQuota.monthlyStats.clicks}</p>
                <p className="text-xs text-yellow-200 mt-1">
                  {emailQuota.monthlyStats.opens > 0 
                    ? `${((emailQuota.monthlyStats.clicks / emailQuota.monthlyStats.opens) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por email o nombre..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              Lista de Suscriptores ({filteredSubscribers.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchTerm ? 'No se encontraron suscriptores' : 'No hay suscriptores aún'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredSubscribers.length && filteredSubscribers.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Grupos</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-750 transition">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(subscriber.id)}
                          onChange={() => toggleSelect(subscriber.id)}
                          className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-white">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{subscriber.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-300">{formatDate(subscriber.subscribedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          subscriber.status === 'active' ? 'bg-green-900 text-green-200' : 
                          subscriber.status === 'blocked' ? 'bg-red-900 text-red-200' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {subscriber.status === 'active' ? 'Activo' : 
                           subscriber.status === 'blocked' ? 'Bloqueado' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {subscriber.groups && subscriber.groups.length > 0 ? (
                            subscriber.groups.map(groupId => {
                              const group = groups.find(g => g.id === groupId);
                              return group ? (
                                <span key={groupId} className="px-2 py-1 text-xs bg-purple-900 text-purple-200 rounded">
                                  {group.name}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <span className="text-xs text-gray-500">Sin grupo</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleStatus(subscriber.id, subscriber.status)}
                            className={`p-2 rounded hover:bg-opacity-80 transition ${
                              subscriber.status === 'active' 
                                ? 'bg-yellow-600 hover:bg-yellow-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                            title={subscriber.status === 'active' ? 'Bloquear' : 'Activar'}
                          >
                            <Ban className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => {
                              setSubscriberToDelete(subscriber.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🚀 Brevo Email Service</h3>
              <p className="text-blue-200 text-sm mb-3">
                Sistema de newsletter configurado con <strong>Brevo (ex-Sendinblue)</strong>. Los emails de bienvenida se envían 
                automáticamente desde <strong>info@mobilegames.win</strong> con seguimiento en tiempo real de la cuota disponible.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-100">Emails de bienvenida automáticos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-100">Prevención de duplicados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-100">Almacenamiento en Firestore</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-100">Límite: 300/día = 9,000/mes (gratis permanente)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-blue-100">Monitoreo de cuota en tiempo real</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-blue-100">Alertas automáticas de límite</span>
                </div>
              </div>
              {emailQuota && (
                <div className="mt-4 pt-4 border-t border-blue-700">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 text-sm">
                      <strong>Estado actual:</strong> {emailQuota.used} emails usados de {emailQuota.total} disponibles
                    </span>
                    <span className={`text-sm font-bold ${
                      emailQuota.percentage > 90 ? 'text-red-400' : 
                      emailQuota.percentage > 70 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {emailQuota.remaining} restantes
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirmar Eliminación</h3>
            </div>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar este suscriptor? Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSubscriberToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => subscriberToDelete && handleDelete(subscriberToDelete)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de asignación de grupos */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Asignar a Grupo</h3>
              <button
                onClick={() => setShowGroupModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-300 mb-4">
              Selecciona un grupo para asignar a los {selectedIds.size} suscriptores seleccionados:
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {groups.map(group => (
                <button
                  key={group.id}
                  onClick={() => handleAddToGroup(group.id)}
                  className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{group.name}</h4>
                      <p className="text-sm text-gray-400">{group.description}</p>
                    </div>
                    <Tag className="w-5 h-5 text-purple-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
