import { useRef, useState } from 'react'
import { Modal } from './Modal'
import { exportData, importData } from '../../utils/exportImport'

interface Props {
  onClose: () => void
}

export function ExportImportModal({ onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleExport() {
    await exportData()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('importing')
    try {
      await importData(file)
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Bu dosya tanınamadı. Lütfen Stashly yedeği olduğundan emin ol.')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Modal title="Veri Yedekleme" onClose={onClose}>
      <div className="px-4 pb-6 space-y-3">
        <div className="flex gap-2.5 p-3 rounded-xl bg-blue-50 text-blue-800 text-sm">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="leading-relaxed">
            Veriler yalnızca bu cihazda saklanır. Cihaz değiştirmeden önce yedek alın, yeni cihazda geri yükleyin.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white active:bg-gray-50 text-left"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Yedek Al</p>
            <p className="text-sm text-gray-500">Tüm verini bilgisayara kaydet</p>
          </div>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={status === 'importing'}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white active:bg-gray-50 text-left disabled:opacity-50"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            {status === 'importing' ? (
              <svg className="w-5 h-5 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {status === 'importing' ? 'Yükleniyor...' : 'Yedekten Yükle'}
            </p>
            <p className="text-sm text-gray-500">Daha önce aldığın yedeği yükle</p>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />

        {status === 'success' && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Veriler başarıyla yüklendi.
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {errorMsg}
          </div>
        )}
      </div>
    </Modal>
  )
}
