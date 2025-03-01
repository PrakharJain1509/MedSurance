import React, { useState, useEffect } from "react";

function MedicalExaminerPage() {
  const [conversationId, setConversationId] = useState(null);
  const [conversation, setConversation] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Change this to your backend's URL if needed.
  const backendUrl = "http://localhost:8000";

  // Start the conversation on component mount.
  useEffect(() => {
    startConversation();
  }, []);

  const startConversation = async () => {
    try {
      const response = await fetch(`${backendUrl}/start`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to start conversation");
      }
      const data = await response.json();
      setConversationId(data.conversation_id);
      setConversation(data.conversation);
      addMessage("doctor", data.message);
    } catch (error) {
      console.error(error);
    }
  };

  // Append message to chat.
  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  // Determine which field is missing in the current conversation.
  const getMissingField = (convData) => {
    if (!convData.name) return "name";
    if (!convData.age) return "age";
    if (!convData.gender) return "gender";
    if (!convData.height) return "height";
    if (!convData.weight) return "weight";
    if (!convData.blood_pressure) return "blood_pressure";
    if (!convData.heart_rate) return "heart_rate";
    if (!convData.temperature) return "temperature";
    if (!convData.respiratory_rate) return "respiratory_rate";
    if (!convData.oxygen_saturation) return "oxygen_saturation";
    if (!convData.bmi) return "bmi";
    if (!convData.cardiovascular_health) return "cardiovascular_health";
    if (!convData.metabolic_health) return "metabolic_health";
    if (!convData.major_organs_status) return "major_organs_status";
    if (!convData.cholesterol_levels) return "cholesterol_levels";
    if (!convData.blood_sugar_levels) return "blood_sugar_levels";
    if (!convData.kidney_function) return "kidney_function";
    if (!convData.liver_function) return "liver_function";
    if (!convData.lung_capacity) return "lung_capacity";
    if (!convData.previous_conditions) return "previous_conditions";
    if (!convData.medications) return "medications";
    if (!convData.allergies) return "allergies";
    if (!convData.family_history) return "family_history";
    if (!convData.current_symptoms) return "current_symptoms";
    if (!convData.examination_notes) return "examination_notes";
    if (!convData.recommendations) return "recommendations";
    return "";
  };

  const updateConversation = async (userInput) => {
    try {
      setLoading(true);
      addMessage("user", userInput);

      // Fetch the latest conversation state.
      const convResponse = await fetch(`${backendUrl}/conversation/${conversationId}`);
      const convData = await convResponse.json();

      // Determine missing field using our heuristic.
      const missingField = getMissingField(convData);
      const payload = {};
      if (missingField) {
        payload[missingField] = userInput;
      }

      // Call the update endpoint.
      const response = await fetch(`${backendUrl}/update?conversation_id=${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to update conversation");
      }
      const data = await response.json();
      setConversation(data.conversation);
      addMessage("doctor", data.message);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    updateConversation(input.trim());
    setInput("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Medical Examiner Chat</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <strong>{msg.sender === "doctor" ? "Dr. Claude" : "You"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          placeholder="Type your response..."
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "80%", padding: "10px", fontSize: "16px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: "18%", padding: "10px", marginLeft: "2%", fontSize: "16px" }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default MedicalExaminerPage;
