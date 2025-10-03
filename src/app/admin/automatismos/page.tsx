'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  getAllPromptConfigs,
  getGeneralConfig,
  updatePromptConfig,
  updateGeneralConfig,
  initializeDefaultConfigs,
  type AIPromptConfig,
  type AIGeneralConfig
} from '@/lib/ai-config';

export default function AutomatismosPage() {
  const [promptConfigs, setPromptConfigs] = useState<AIPromptConfig[]>([]);
  const [generalConfig, setGeneralConfig] = useState<AIGeneralConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<AIPromptConfig | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const [prompts, general] = await Promise.all([
        getAllPromptConfigs(),
        getGeneralConfig()
      ]);

      setPromptConfigs(prompts);
      setGeneralConfig(general);

      // Initialize if no configs exist
      if (prompts.length === 0) {
        await initializeDefaultConfigs();
        loadConfigs(); // Reload after initialization
      }
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: AIPromptConfig) => {
    setEditingConfig(config);
    setShowEditor(true);
  };

  const handleSave = async (config: AIPromptConfig) => {
    try {
      await updatePromptConfig(config);
      alert('✅ Configuración guardada correctamente');
      setShowEditor(false);
      setEditingConfig(null);
      loadConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
      alert('❌ Error al guardar la configuración');
    }
  };

  const handleGeneralConfigChange = async (field: keyof AIGeneralConfig, value: any) => {
    if (!generalConfig) return;

    const updated = { ...generalConfig, [field]: value };
    setGeneralConfig(updated);

    try {
      await updateGeneralConfig({ [field]: value });
      console.log('✅ General config updated');
    } catch (error) {
      console.error('Error updating general config:', error);
    }
  };

  const getConfigIcon = (type: string) => {
    switch (type) {
      case 'daily-opinion':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'weekly-top5':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'breaking-news':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (showEditor && editingConfig) {
    return (
      <AdminLayout>
        <ConfigEditor
          config={editingConfig}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingConfig(null);
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Automatismos IA</h1>
          <p className="text-gray-400">
            Configura los prompts y parámetros para la generación automática de artículos
          </p>
        </div>

        {loading ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Cargando configuraciones...</p>
          </div>
        ) : (
          <>
            {/* General Configuration */}
            {generalConfig && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">Configuración General</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Modelo Preferido
                    </label>
                    <select
                      value={generalConfig.preferredModel}
                      onChange={(e) => handleGeneralConfigChange('preferredModel', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="gemini">Google Gemini</option>
                      <option value="huggingface">HuggingFace</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Modelo Gemini
                    </label>
                    <input
                      type="text"
                      value={generalConfig.geminiModel}
                      onChange={(e) => handleGeneralConfigChange('geminiModel', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Categoría por Defecto
                    </label>
                    <input
                      type="text"
                      value={generalConfig.defaultCategory}
                      onChange={(e) => handleGeneralConfigChange('defaultCategory', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Autor por Defecto
                    </label>
                    <input
                      type="text"
                      value={generalConfig.defaultAuthor}
                      onChange={(e) => handleGeneralConfigChange('defaultAuthor', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Configurations */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Configuraciones de Prompts</h2>

              <div className="space-y-4">
                {promptConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="bg-gray-700 rounded-lg p-6 hover:bg-gray-650 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-lg ${
                          config.type === 'daily-opinion' ? 'bg-blue-600' :
                          config.type === 'weekly-top5' ? 'bg-purple-600' :
                          'bg-red-600'
                        }`}>
                          {getConfigIcon(config.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{config.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              config.enabled
                                ? 'bg-green-900 text-green-200'
                                : 'bg-gray-600 text-gray-300'
                            }`}>
                              {config.enabled ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-400">Temperature</p>
                              <p className="text-white font-mono">{config.temperature}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Max Tokens</p>
                              <p className="text-white font-mono">{config.maxTokens}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">System Prompt</p>
                              <p className="text-white text-sm truncate">
                                {config.systemPrompt.substring(0, 30)}...
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">User Template</p>
                              <p className="text-white text-sm truncate">
                                {config.userPromptTemplate.substring(0, 30)}...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEdit(config)}
                        className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

// Config Editor Component
function ConfigEditor({
  config,
  onSave,
  onCancel
}: {
  config: AIPromptConfig;
  onSave: (config: AIPromptConfig) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(config);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Editar Configuración</h1>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition"
        >
          ← Volver
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-8 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            System Prompt
          </label>
          <textarea
            value={formData.systemPrompt}
            onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
            placeholder="Define el rol y estilo del asistente..."
          />
        </div>

        {/* User Prompt Template */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            User Prompt Template
          </label>
          <textarea
            value={formData.userPromptTemplate}
            onChange={(e) => setFormData({ ...formData, userPromptTemplate: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
            placeholder="Instrucciones específicas para generar el contenido..."
          />
          <p className="mt-2 text-sm text-gray-400">
            Variables disponibles: {'{category}'}, {'{year}'}, {'{topic}'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Temperature */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Temperature (0-1)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              min="100"
              max="8000"
              step="100"
              value={formData.maxTokens}
              onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Enabled */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="w-5 h-5 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label className="ml-3 text-sm font-semibold text-gray-300">
            Configuración activa
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}
