function getChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
    return chatHistory ? chatHistory : [];
}

function saveChatHistory(chatHistory) {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function startNewChat() {
    const chatHistory = getChatHistory();
    const newChat = {
        id: Date.now(),
        messages: []
    };
    chatHistory.push(newChat);
    saveChatHistory(chatHistory);
    window.location.replace(`chatbot.html?chatId=${newChat.id}`);
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    });
}

function getPreviewText(messages) {
    if (!messages || messages.length === 0) return "Empty chat";
    const lastMessage = messages[messages.length - 1];
    return lastMessage.length > 60 ? lastMessage.substring(0, 60) + "..." : lastMessage;
}

function createHistoryItem(timestamp, preview) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.onclick = () => loadChat(timestamp);

    const content = document.createElement('div');
    content.className = 'history-content';

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'timestamp';
    timestampDiv.textContent = new Date(parseInt(timestamp)).toLocaleString();

    const previewDiv = document.createElement('div');
    previewDiv.className = 'preview';
    previewDiv.textContent = preview;

    content.appendChild(timestampDiv);
    content.appendChild(previewDiv);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-icon';
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteChat(timestamp);
    };
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

    historyItem.appendChild(content);
    historyItem.appendChild(deleteButton);

    return historyItem;
}

function displayChatHistory() {
    const historyModal = document.getElementById('history-modal');
    const historyContainer = document.getElementById('history-container');
    historyContainer.innerHTML = '';

    const chatHistory = getChatHistory();
    if (chatHistory.length === 0) {
        historyContainer.innerHTML = '<div class="no-history">No chat history yet</div>';
        historyModal.style.display = 'block';
        return;
    }

    const sortedChats = [...chatHistory].sort((a, b) => b.id - a.id);
    sortedChats.forEach(chat => {
        const historyItem = createHistoryItem(chat.id, getPreviewText(chat.messages));
        historyContainer.appendChild(historyItem);
    });

    historyModal.style.display = 'block';
}

function closeHistory() {
    document.getElementById('history-modal').style.display = 'none';
}

function loadChatMessages(chatId) {
    const chatHistory = getChatHistory();
    const chat = chatHistory.find(c => c.id === parseInt(chatId));

    if (chat) {
        const chatMessagesContainer = document.getElementById('chat-messages');
        chatMessagesContainer.innerHTML = '';

        chat.messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.textContent = msg;
            chatMessagesContainer.appendChild(messageElement);
        });
    }
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chatId');
    
    if (chatId) {
        loadChatMessages(chatId);
    }
};
