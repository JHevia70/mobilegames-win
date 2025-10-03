'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Escribe tu contenido en Markdown...',
  minHeight = '500px'
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('split');

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center space-x-2 mb-4 border-b border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${
            activeTab === 'edit'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${
            activeTab === 'preview'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          👁️ Vista Previa
        </button>
        <button
          onClick={() => setActiveTab('split')}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${
            activeTab === 'split'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          ⚡ Dividido
        </button>

        <div className="flex-1"></div>

        {/* Markdown Help */}
        <div className="text-xs text-gray-500 space-x-4">
          <span>**negrita**</span>
          <span>*cursiva*</span>
          <span># Título</span>
          <span>[link](url)</span>
          <span>![img](url)</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex gap-4" style={{ minHeight }}>
        {/* Editor */}
        {(activeTab === 'edit' || activeTab === 'split') && (
          <div className={activeTab === 'split' ? 'flex-1' : 'w-full'}>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
            />
          </div>
        )}

        {/* Preview */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className={activeTab === 'split' ? 'flex-1' : 'w-full'}>
            <div className="h-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-lg overflow-auto">
              {value ? (
                <div className="prose prose-invert prose-slate max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      // Customize rendering
                      h1: ({ node, ...props }) => (
                        <h1 className="text-4xl font-bold text-white mb-6 mt-8" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-3xl font-bold text-white mb-4 mt-6" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-2xl font-bold text-white mb-3 mt-5" {...props} />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4 className="text-xl font-bold text-white mb-2 mt-4" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-gray-300 mb-4 leading-relaxed text-lg" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="text-gray-300 ml-4" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-400" {...props} />
                      ),
                      code: ({ node, inline, ...props }: any) =>
                        inline ? (
                          <code className="bg-gray-800 text-cyan-400 px-2 py-1 rounded text-sm" {...props} />
                        ) : (
                          <code className="block bg-gray-800 text-cyan-400 p-4 rounded-lg overflow-x-auto text-sm my-4" {...props} />
                        ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto my-4" {...props} />
                      ),
                      img: ({ node, ...props }) => (
                        <img className="rounded-lg my-6 max-w-full h-auto" {...props} />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr className="border-gray-700 my-8" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full divide-y divide-gray-700" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead className="bg-gray-800" {...props} />
                      ),
                      tbody: ({ node, ...props }) => (
                        <tbody className="divide-y divide-gray-700" {...props} />
                      ),
                      tr: ({ node, ...props }) => (
                        <tr className="hover:bg-gray-800" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="px-4 py-3 text-sm text-gray-300" {...props} />
                      ),
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 italic">
                    La vista previa aparecerá aquí mientras escribes...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Word Count */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          {value.split(/\s+/).filter(Boolean).length} palabras • {value.length} caracteres
        </span>
        <span>
          Tiempo de lectura estimado: {Math.ceil(value.split(/\s+/).filter(Boolean).length / 200)} min
        </span>
      </div>
    </div>
  );
}
