import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ChatWidget({ isOpen, onClose }) {
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot' }
  ])
  const [chatInput, setChatInput] = useState('')

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    
    setChatMessages([...chatMessages, { text: chatInput, sender: 'user' }])
    setChatInput('')
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: 'I can help you with reporting incidents, viewing the map, or finding emergency contacts. What would you like to do?', 
        sender: 'bot' 
      }])
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border flex flex-col z-[1001]">
      <div className="p-4 border-b flex items-center justify-between bg-green-600 rounded-t-lg">
        <h3 className="font-semibold text-white">SafeMap Assistant</h3>
        <Button variant="ghost" size="sm" className="text-white hover:bg-green-700" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..." 
            className="flex-1 border rounded-full px-4 py-2 outline-none focus:border-green-500"
          />
          <Button onClick={handleSendMessage} className="rounded-full px-4">
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatWidget
