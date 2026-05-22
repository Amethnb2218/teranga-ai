import ReactMarkdown from 'react-markdown'
import { FiVolume2, FiSquare } from 'react-icons/fi'

function ChatBubble({ message, onSpeak, onStop, isSpeaking }) {
  const isUser = message.role === 'user';

  return (
    <div className={`fade-in ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 bg-amber-100 rounded-md flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2L12 22M12 2C9 7 5 8 2 9C5 10 9 13 12 22M12 2C15 7 19 8 22 9C19 10 15 13 12 22"/>
          </svg>
        </div>
      )}
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
        {isUser ? (
          <div className="text-sm leading-relaxed">{message.content}</div>
        ) : (
          <div>
            <div className="prose-chat text-sm leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h3 className="font-bold text-base text-stone-900 mt-3 mb-1.5">{children}</h3>,
                  h2: ({children}) => <h4 className="font-bold text-sm text-stone-900 mt-3 mb-1.5">{children}</h4>,
                  h3: ({children}) => <h5 className="font-semibold text-sm text-stone-800 mt-2 mb-1">{children}</h5>,
                  p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({children}) => <strong className="font-semibold text-stone-900">{children}</strong>,
                  a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:text-amber-900">{children}</a>,
                  ul: ({children}) => <ul className="mb-2 space-y-1 pl-1">{children}</ul>,
                  ol: ({children}) => <ol className="mb-2 space-y-1 pl-4 list-decimal">{children}</ol>,
                  li: ({children}) => <li className="flex gap-1.5"><span className="text-amber-600 mt-0.5 flex-shrink-0">•</span><span>{children}</span></li>,
                  table: ({children}) => (
                    <div className="my-2 rounded-lg border border-stone-200 overflow-hidden">
                      <table className="w-full text-xs">{children}</table>
                    </div>
                  ),
                  thead: ({children}) => <thead className="bg-stone-100">{children}</thead>,
                  th: ({children}) => <th className="px-3 py-1.5 text-left font-semibold text-stone-700 border-b border-stone-200">{children}</th>,
                  td: ({children}) => <td className="px-3 py-1.5 border-b border-stone-50 text-stone-600">{children}</td>,
                  tr: ({children}) => <tr className="even:bg-stone-50/50">{children}</tr>,
                  code: ({children}) => <code className="bg-stone-100 text-amber-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            {onSpeak && (
              <button
                onClick={() => {
                  if (isSpeaking) { onStop(); }
                  else { onSpeak(message.content); }
                }}
                className={`mt-2 flex items-center gap-1 text-xs transition-colors ${
                  isSpeaking ? 'text-red-500 hover:text-red-700' : 'text-stone-400 hover:text-amber-700'
                }`}
                title={isSpeaking ? 'Arrêter' : 'Écouter'}
              >
                {isSpeaking ? <FiSquare size={10} /> : <FiVolume2 size={11} />}
                <span>{isSpeaking ? 'Arrêter' : 'Écouter'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBubble
