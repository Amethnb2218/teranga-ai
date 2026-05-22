function ChatBubble({ message }) {
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
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content.split('**').map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBubble
