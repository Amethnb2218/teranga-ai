function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`fade-in ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
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
