'use client';
import { useState, useRef, useEffect } from 'react';
import Output from '@/components/Output';
import Link from 'next/link';
import { RainbowButton } from '@/components/magicui/rainbow-button'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null) 
  const [btn_disabled, setbtn_disabled] = useState(true)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Update button state based on input
  useEffect(() => {
    setbtn_disabled(!input.trim());
  }, [input]);

  async function sendMessage() {
    if (!input.trim()) {
      return
    }
    
    setbtn_disabled(true) // Disable button during API call
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    const systemMessage = {
      role: 'system',
      content: `You are a strict domain-limited assistant. You are allowed to respond only to questions that are directly and exclusively about academic astronomy or pure mathematics.

      If a user says "hello", "hi", or similar greetings, respond politely and remind them that you can only help with astronomy and mathematics.

      If a question is not clearly focused on these topics (e.g., politics, finance, programming, daily life), you must reply: 
      "I'm here to assist with questions specifically related to astronomy and mathematics. For other topics, I may not be the best resource, as I've been designed to remain focused on these academic domains to ensure clarity and accuracy."

      Do not provide information outside your scope, even if the user insists.`
    };

    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [systemMessage, ...newMessages] })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.text || '⚠️ No response received.' }
      ]);
    } catch (err) {
      console.error('API error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ There was an error contacting the server. Please try again.' }
      ]);
    } finally {
      setbtn_disabled(false) // Re-enable button after API call completes
    }
  }

  return (
    <main className="text-center py-4 sm:py-6 px-6 font-sans flex flex-col items-center justify-center h-full w-full gap-2">
      <h1 className="text-xl sm:text-3xl font-semibold text-gray-800">Academic AI Assistant</h1>
      <p className="text-sm sm:text-md text-gray-600">
        I can assist you with topics strictly related to <strong>astronomy</strong> and <strong>mathematics</strong>. Please keep your queries within these areas.
      </p>

      <section ref={scrollRef} className="text-left border p-4 rounded-xl w-full h-[70dvh] overflow-y-auto bg-gray-50 shadow-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-green-700' : 'text-gray-800'}`}>
            <span className="font-semibold">{msg.role === 'user' ? 'You' : 'Assistant'}:</span> 
            <Output rawMarkdown={msg.content}/>
          </div>
        ))}
      </section>

      <section className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border-2 px-3 py-2 rounded-full shadow-sm focus:outline-none focus:border-green-600 transition-all duration-300 text-sm sm:text-md"
          placeholder="Enter your question..."
        />
        <button
          onClick={sendMessage}
          disabled={btn_disabled}
          className={`bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition text-sm sm:text-lg ${btn_disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
          Send
        </button>
      </section>
      <RainbowButton className="w-full sm:w-fit text-sm sm:text-xl rounded-full"><Link href="/" className="w-full">Home</Link></RainbowButton>
      <p className="font-semibold animate-pulse cursor-pointer"><Link href="https://github.com/adaptableCoder">adaptableCoder</Link></p>
    </main>
  );
}
