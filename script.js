const API_KEY = 'my api key';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
let currentChatId = Date.now();
let chats = JSON.parse(localStorage.getItem('chats') || '{}');

function saveChat(chatId, message, isUser) {
    if (!chats[chatId]) {
        chats[chatId] = [];
    }
    chats[chatId].push({ message, isUser, timestamp: new Date().toISOString() });
    localStorage.setItem('chats', JSON.stringify(chats));
}

function startNewChat() {
    if (chatMessages.children.length > 0) {
        saveCurrentChat();
    }
    chatMessages.innerHTML = '';
    currentChatId = Date.now();
    userInput.value = '';
    userInput.focus();
}

function saveCurrentChat() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

function displayChatHistory() {
    const historyContainer = document.getElementById('history-container');
    historyContainer.innerHTML = '';
    const sortedChatIds = Object.keys(chats).sort((a, b) => b - a);
    if (sortedChatIds.length === 0) {
        historyContainer.innerHTML = '<div class="no-history">No chat history found</div>';
        return;
    }
    const deleteAllBtn = document.createElement('button');
    deleteAllBtn.className = 'delete-all-btn';
    deleteAllBtn.innerHTML = 'Delete All History';
    deleteAllBtn.onclick = deleteAllHistory;
    historyContainer.appendChild(deleteAllBtn);
    sortedChatIds.forEach(chatId => {
        const chatPreview = document.createElement('div');
        chatPreview.className = 'chat-preview';
        const firstMessage = chats[chatId][0]?.message || 'Empty chat';
        const date = new Date(parseInt(chatId)).toLocaleString();
        chatPreview.innerHTML = `
            <div class="chat-preview-content">
                <div class="chat-preview-header">
                    <span>${date}</span>
                    <button class="delete-chat-btn" onclick="deleteChat('${chatId}', event)">
                        <svg width="14" height="14" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
                <div class="chat-preview-text">${firstMessage.substring(0, 50)}...</div>
            </div>
        `;
        chatPreview.onclick = (e) => {
            if (!e.target.closest('.delete-chat-btn')) {
                loadChat(chatId);
            }
        };
        historyContainer.appendChild(chatPreview);
    });
    document.getElementById('history-modal').style.display = 'block';
}

function deleteChat(chatId, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
        delete chats[chatId];
        localStorage.setItem('chats', JSON.stringify(chats));
        if (chatId === currentChatId.toString()) {
            startNewChat();
        }
        displayChatHistory();
    }
}

function deleteAllHistory() {
    if (confirm('Are you sure you want to delete all chat history? This cannot be undone.')) {
        chats = {};
        localStorage.setItem('chats', JSON.stringify(chats));
        startNewChat();
        displayChatHistory();
    }
}

function loadChat(chatId) {
    if (chatMessages.children.length > 0) {
        saveCurrentChat();
    }
    chatMessages.innerHTML = '';
    currentChatId = chatId;
    chats[chatId].forEach(msg => {
        addMessage(msg.message, msg.isUser);
    });
    closeHistory();
}

function closeHistory() {
    document.getElementById('history-modal').style.display = 'none';
}

async function generateResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        })
    });
    if (!response.ok) {
        throw new Error('Failed to generate response');
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text) {
    return text
        .replace(/#{1,6}\s?/g, '')
        .replace(/\*\*/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'images/person1.jpg' : 'images/bot.jpg';
    profileImage.alt = isUser ? 'User' : 'Bot';
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;
    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChat(currentChatId, message, isUser);
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        sendButton.disabled = true;
        userInput.disabled = true;
        try {
            const botMessage = await generateResponse(userMessage);
            addMessage(cleanMarkdown(botMessage), false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, connection is lost . Please try again.', false);
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
}

sendButton.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});