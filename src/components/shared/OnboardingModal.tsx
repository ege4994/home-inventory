import { Modal } from './Modal'

interface Props {
  onClose: () => void
}

export function OnboardingModal({ onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="px-4 pb-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">Verileriniz güvende</h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Stashly verilerinizi yalnızca bu cihazda saklar. Hiçbir sunucuya gönderilmez, hesap oluşturmanıza gerek yoktur.
          </p>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Cihaz değiştirirken veri kaybetmemek için sağ üstteki{' '}
            <span className="inline-flex items-center gap-0.5 font-medium text-gray-800">
              <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
              menüsünden
            </span>{' '}
            yedek alabilirsiniz.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl active:bg-blue-700"
        >
          Anladım
        </button>
      </div>
    </Modal>
  )
}
