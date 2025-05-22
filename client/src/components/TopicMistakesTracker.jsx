import { useState } from "react";
import "./TopicMistakesTracker.css";

export default function TopicMistakesTracker({ 
  examId, 
  lesson, 
  totalWrong, 
  totalBlank, 
  onSave 
}) {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [topicMistakes, setTopicMistakes] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  
  // Total mistakes that can be allocated
  const totalMistakes = totalWrong + totalBlank;
  
  // Calculate sum of all allocated mistakes
  const allocatedMistakes = Object.values(topicMistakes).reduce((sum, count) => sum + count, 0);
  
  // Remaining mistakes to allocate
  const remainingMistakes = totalMistakes - allocatedMistakes;
  
  const handleAddTopic = () => {
    if (!newTopic.trim()) {
      setError("Lütfen bir konu adı girin");
      return;
    }
    
    if (topics.includes(newTopic.trim())) {
      setError("Bu konu zaten eklenmiş");
      return;
    }
    
    setTopics([...topics, newTopic.trim()]);
    setTopicMistakes({...topicMistakes, [newTopic.trim()]: 0});
    setNewTopic("");
    setError("");
    setIsAdding(false);
  };
  
  const handleChangeMistakeCount = (topic, count) => {
    // Make sure the count is a valid number
    const newCount = parseInt(count, 10) || 0;
    
    // Ensure the count is not negative or greater than the total possible mistakes
    if (newCount < 0 || newCount > totalMistakes) {
      return;
    }
    
    // Calculate what the total would be with this change
    const currentTotal = allocatedMistakes - (topicMistakes[topic] || 0);
    const newTotal = currentTotal + newCount;
    
    // Ensure we don't exceed total mistakes
    if (newTotal > totalMistakes) {
      setError(`Toplam hata sayısını (${totalMistakes}) aşamazsınız.`);
      return;
    }
    
    setTopicMistakes({...topicMistakes, [topic]: newCount});
    setError("");
  };
  
  const handleRemoveTopic = (topicToRemove) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
    const newTopicMistakes = {...topicMistakes};
    delete newTopicMistakes[topicToRemove];
    setTopicMistakes(newTopicMistakes);
  };
  
  const handleSave = () => {
    if (allocatedMistakes !== totalMistakes && totalMistakes > 0) {
      setError(`Lütfen tüm hataları konulara dağıtın. ${remainingMistakes} hata henüz atanmamış.`);
      return;
    }
    
    // Send to parent component or API
    onSave({
      examId,
      lesson,
      topicMistakes
    });
  };
  
  return (
    <div className="topic-mistakes-tracker">
      <h4>"{lesson}" Dersi Konu Bazlı Hata Takibi</h4>
      
      <div className="mistake-summary">
        <span className="mistake-stat">🔴 Yanlış: {totalWrong}</span>
        <span className="mistake-stat">⚪ Boş: {totalBlank}</span>
        <span className="mistake-stat total">Toplam: {totalMistakes}</span>
      </div>
      
      {totalMistakes > 0 ? (
        <>
          <div className="progress-bar-container">
            <div className="progress-label">
              <span>Hataların dağılımı: {allocatedMistakes}/{totalMistakes}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${totalMistakes ? (allocatedMistakes / totalMistakes * 100) : 0}%`}}
              ></div>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="topics-container">
            {topics.map(topic => (
              <div className="topic-item" key={topic}>
                <div className="topic-name">{topic}</div>
                <div className="topic-controls">
                  <input 
                    type="number" 
                    min="0" 
                    max={totalMistakes} 
                    value={topicMistakes[topic]} 
                    onChange={(e) => handleChangeMistakeCount(topic, e.target.value)}
                    className="topic-count-input"
                  />
                  <button 
                    className="remove-topic-btn"
                    onClick={() => handleRemoveTopic(topic)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {isAdding ? (
            <div className="add-topic-form">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Konu adı girin (Örn: İntegral, Türev)"
                className="topic-input"
              />
              <div className="add-topic-buttons">
                <button className="cancel-btn" onClick={() => setIsAdding(false)}>İptal</button>
                <button className="add-btn" onClick={handleAddTopic}>Ekle</button>
              </div>
            </div>
          ) : (
            <button className="add-topic-btn" onClick={() => setIsAdding(true)}>
              + Yeni Konu Ekle
            </button>
          )}
          
          <button 
            className="save-btn"
            disabled={allocatedMistakes !== totalMistakes && totalMistakes > 0}
            onClick={handleSave}
          >
            Kaydet
          </button>
        </>
      ) : (
        <div className="no-mistakes-message">
          Bu derste hata/boş soru bulunmamaktadır.
        </div>
      )}
    </div>
  );
} 