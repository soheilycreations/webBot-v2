import React, { useState } from 'react';
import { BookOpen, HelpCircle, Save, Plus, FileText, CheckCircle2 } from 'lucide-react';

export default function KnowledgeBase() {
  const [faqs, setFaqs] = useState([
    { id: 1, question: "What are your business hours?", answer: "We are open Monday to Friday from 9 AM to 6 PM EST." },
    { id: 2, question: "Where are you located?", answer: "We are a fully cloud-based storefront. Delivery operates nationwide!" },
    { id: 3, question: "How can I check my order status?", answer: "Just type your order ID and our bot will retrieve the real-time tracking information instantly." },
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setFaqs([...faqs, { id: Date.now(), question: newQuestion, answer: newAnswer }]);
    setNewQuestion('');
    setNewAnswer('');
    
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="knowledge-base-view">
      {/* Tab Header banner */}
      <div>
        <h2 className="text-xl font-sans font-bold text-slate-900 tracking-tight">AI Knowledge Base & Auto-reply Prompts</h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize instant reply mappings for your WhatsApp tenant. The auto-responder crawls these assets to draft responses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="kb-grid-layout">
        {/* Left Side: FAQs List */}
        <div className="lg:col-span-3 space-y-4" id="kb-faqs-column">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" id="kb-list-card">
            <h3 className="font-sans font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Current FAQ Bot Response Catalog</span>
            </h3>

            <div className="space-y-3" id="faqs-accordion-container">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50/40 hover:bg-slate-50 transition-all" id={`faq-item-${faq.id}`}>
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-sans font-bold text-slate-800 text-sm leading-tight">{faq.question}</h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-white border border-slate-100 p-2.5 rounded-md font-mono">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: FAQ Creator */}
        <div className="lg:col-span-2 space-y-4" id="kb-creator-column">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" id="new-item-card">
            <h3 className="font-sans font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Inject FAQ Rule</span>
            </h3>

            <form onSubmit={handleAddFaq} className="space-y-4" id="kb-form">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Trigger Question Phrase</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Do you offer refunds?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="kb-question-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Automator Answer Script</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Yes! We offer a full 14-day return window on all items..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="kb-answer-input"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md shadow-blue-500/10"
                id="kb-submit-btn"
              >
                <Save className="w-4 h-4" />
                <span>Save Response Hook</span>
              </button>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-blue-600 justify-center bg-blue-50 border border-blue-100 p-2 rounded-lg text-xs" id="success-banner">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Rule catalog saved successfully!</span>
                </div>
              )}
            </form>
          </div>

          <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-5 font-mono text-[11px] leading-relaxed" id="kb-integrations-card">
            <span className="text-blue-400 font-bold block mb-1">⚡ TENANT INTEGRATIONS HOOK</span>
            Every FAQ item compiled on this dashboard is serialized as a custom JSON prompt mapping and injected into the Node.js connection runtime context of your whatsappManager. Upon detecting standard trigger keyword pairings, the bot responds without latency!
          </div>
        </div>
      </div>
    </div>
  );
}
