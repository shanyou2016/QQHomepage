// 状态管理
const state = {
    currentUser: null,
    friends: [],
    messages: {},
    moments: [],
    currentChat: null
};

// 添加表情包数据
const emojis = {
    common: ['😀', '😂', '🤣', '😊', '😍', '🥰', '😘', '😋'],
    emotion: ['😠', '😡', '🤬', '😱', '😨', '😰', '😥', '😓'],
    animation: ['💫', '⭐', '✨', '💥', '💢', '💦', '💨', '🕳️']
};

// 搜索处理函数
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    console.log('Searching for:', searchTerm);
    // TODO: 实现搜索功能
}

// 初始化应用
function initApp() {
    console.log('Initializing app...');
    loadMockData();
    setupEventListeners();
    renderFriendsList();
    setupMessageHandling();
    setupEmojiPicker();
    setupFileUpload();
    setupMomentPosting();
}

// 加载模拟数据
function loadMockData() {
    state.currentUser = {
        id: 'user1',
        name: '当前用户',
        avatar: 'images/avatar1.jpg',
        status: 'online'
    };
    
    state.friends = [
        {
            id: 'friend1',
            name: '张三',
            avatar: 'images/avatar2.jpg',
            status: 'online'
        },
        {
            id: 'friend2',
            name: '李四',
            avatar: 'images/avatar3.jpg',
            status: 'busy'
        },
        {
            id: 'friend3',
            name: '王五',
            avatar: 'images/avatar1.jpg',
            status: 'offline'
        }
    ];
    
    state.messages = {
        friend1: [
            {
                id: 'm1',
                senderId: 'friend1',
                content: '你好！',
                timestamp: new Date()
            }
        ]
    };
    
    // 添加示例动态
    state.moments = [
        {
            id: 1,
            userId: 'friend1',
            content: '今天天气真好！',
            images: ['images/moment1.gif'],
            likes: 5,
            comments: [
                { userId: 'user1', content: '确实不错！' }
            ],
            timestamp: new Date()
        }
    ];
}

// 设置事件监听器
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // 导航切换
    const navLinks = document.querySelectorAll('.main-nav a');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Nav link clicked:', e.target.textContent);
            handleNavigation(e);
        });
    });
    
    // 发送消息
    document.querySelector('.send-btn').addEventListener('click', sendMessage);
    
    // 搜索功能
    document.querySelector('.search-box input').addEventListener('input', handleSearch);
    
    // 动态发布功能
    setupMomentPosting();
}

// 处理导航
function handleNavigation(e) {
    e.preventDefault();
    console.log('Navigation clicked:', e.target.textContent);
    const section = e.target.textContent;
    
    // 移除所有active类
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加active类到当前项
    e.target.classList.add('active');
    
    // 切换显示相应的内容区域
    toggleContentSection(section);
}

// 发送消息
function sendMessage() {
    const input = document.querySelector('.chat-input textarea');
    const content = input.value.trim();
    
    if (!content || !state.currentChat) return;
    
    const message = {
        id: `m${Date.now()}`,
        senderId: state.currentUser.id,
        content,
        timestamp: new Date()
    };
    
    // 添加消息到状态
    if (!state.messages[state.currentChat]) {
        state.messages[state.currentChat] = [];
    }
    state.messages[state.currentChat].push(message);
    
    // 渲染消息
    renderMessage(message);
    
    // 清空输入框
    input.value = '';
}

// 渲染消息
function renderMessage(message) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageElement = createMessageElement(message);
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 创建消息元素
function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `chat-message ${message.senderId === state.currentUser.id ? 'sent' : 'received'}`;
    
    div.innerHTML = `
        <img class="avatar" src="${message.senderId === state.currentUser.id ? state.currentUser.avatar : state.friends.find(f => f.id === message.senderId).avatar}" alt="头像">
        <div class="message-content">${message.content}</div>
    `;
    
    return div;
}

// 设置表情选择器
function setupEmojiPicker() {
    const emojiBtn = document.querySelector('.emoji-btn');
    const emojiPicker = document.querySelector('.emoji-picker');
    const emojiContent = document.querySelector('.emoji-content');
    
    emojiBtn.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
        renderEmojis('common');
    });
    
    // 切换表情分类
    document.querySelector('.emoji-tabs').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            document.querySelectorAll('.emoji-tabs button').forEach(btn => 
                btn.classList.remove('active'));
            e.target.classList.add('active');
            renderEmojis(e.target.textContent);
        }
    });
    
    // 选择表情
    emojiContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('emoji')) {
            const textarea = document.querySelector('.chat-input textarea');
            textarea.value += e.target.textContent;
            emojiPicker.style.display = 'none';
        }
    });
}

// 渲染表情
function renderEmojis(category) {
    const emojiContent = document.querySelector('.emoji-content');
    emojiContent.innerHTML = emojis[category.toLowerCase()]
        .map(emoji => `<span class="emoji">${emoji}</span>`)
        .join('');
}

// 文件上传处理
function setupFileUpload() {
    const fileBtn = document.querySelector('.file-btn');
    const uploadDialog = document.querySelector('.upload-dialog');
    const fileInput = document.querySelector('#fileInput');
    const uploadArea = document.querySelector('.upload-area');
    
    fileBtn.addEventListener('click', () => {
        uploadDialog.style.display = 'block';
    });
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });
}

// 处理文件上传
function handleFiles(files) {
    const uploadList = document.querySelector('.upload-list');
    uploadList.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `
            <span>${file.name}</span>
            <span>${(file.size / 1024).toFixed(2)} KB</span>
            <div class="progress">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        `;
        uploadList.appendChild(item);
        
        // 模拟上传进度
        simulateUpload(item.querySelector('.progress-bar'));
    });
}

// 模拟文件上传进度
function simulateUpload(progressBar) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        progressBar.style.width = `${progress}%`;
    }, 200);
}

// 渲染好友列表
function renderFriendsList() {
    const friendsList = document.querySelector('.friends-list ul');
    friendsList.innerHTML = state.friends.map(friend => `
        <li class="friend-item" data-id="${friend.id}">
            <img class="avatar" src="${friend.avatar}" alt="${friend.name}">
            <div class="info">
                <div class="name">${friend.name}</div>
                <div class="status">${friend.status}</div>
            </div>
        </li>
    `).join('');
    
    // 添加点击事件
    friendsList.querySelectorAll('.friend-item').forEach(item => {
        item.addEventListener('click', () => {
            const friendId = item.dataset.id;
            openChat(friendId);
        });
    });
}

// 打开聊天窗口
function openChat(friendId) {
    const friend = state.friends.find(f => f.id === friendId);
    state.currentChat = friendId;
    
    // 更新聊天窗口标题
    document.querySelector('.chat-header h2').textContent = friend.name;
    
    // 显示聊天记录
    const messages = state.messages[friendId] || [];
    const messagesContainer = document.querySelector('.chat-messages');
    messagesContainer.innerHTML = '';
    messages.forEach(msg => renderMessage(msg));
}

// 切换内容区域
function toggleContentSection(section) {
    console.log('Toggling section:', section);
    const chatWindow = document.querySelector('.chat-window');
    const momentsSection = document.querySelector('.moments-section');
    const friendsList = document.querySelector('.friends-list');
    
    // 先隐藏所有区域
    chatWindow.style.display = 'none';
    momentsSection.style.display = 'none';
    friendsList.style.display = 'none';
    
    switch(section) {
        case '消息':
            chatWindow.style.display = 'flex';
            friendsList.style.display = 'block';
            break;
        case '动态':
            momentsSection.style.display = 'block';
            renderMoments();
            break;
        case '联系人':
            friendsList.style.display = 'block';
            break;
    }
}

// 渲染动态列表
function renderMoments() {
    console.log('Rendering moments:', state.moments);
    const momentsList = document.querySelector('.moments-list');
    momentsList.innerHTML = state.moments.map(moment => {
        const user = moment.userId === state.currentUser.id ? 
            state.currentUser : 
            state.friends.find(f => f.id === moment.userId);
        
        return `
            <div class="moment-item" data-id="${moment.id}">
                <div class="moment-header">
                    <img class="avatar" src="${user.avatar}" alt="${user.name}">
                    <div class="info">
                        <div class="name">${user.name}</div>
                        <div class="time">${formatTime(moment.timestamp)}</div>
                    </div>
                </div>
                <div class="moment-content">${moment.content}</div>
                ${moment.images ? `
                    <div class="moment-images">
                        ${moment.images.map(img => `
                            <img src="${img}" alt="动态图片">
                        `).join('')}
                    </div>
                ` : ''}
                <div class="moment-actions">
                    <button class="like-btn">
                        <i class="fas fa-heart"></i>
                        <span>${moment.likes}</span>
                    </button>
                    <button class="comment-btn">
                        <i class="fas fa-comment"></i>
                        <span>${moment.comments.length}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 格式化时间
function formatTime(date) {
    return new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 设置动态发布功能
function setupMomentPosting() {
    console.log('Setting up moment posting...');
    const postBtn = document.querySelector('.post-moment-btn');
    const dialog = document.querySelector('.post-moment-dialog');
    
    if (!postBtn || !dialog) {
        console.error('Required elements not found:', { postBtn, dialog });
        return;
    }
    
    const closeBtn = dialog.querySelector('.close-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const publishBtn = dialog.querySelector('.publish-btn');
    const addImageBtn = dialog.querySelector('.add-image-btn');
    const imageInput = dialog.querySelector('#momentImageInput');
    const previewContainer = dialog.querySelector('.preview-images');
    
    // 打开对话框
    postBtn.addEventListener('click', () => {
        console.log('Post button clicked');
        dialog.style.display = 'block';
        document.body.appendChild(createOverlay());
    });
    
    // 关闭对话框
    [closeBtn, cancelBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                console.log('Close/Cancel button clicked');
                dialog.style.display = 'none';
                removeOverlay();
                clearDialog();
            });
        }
    });
    
    // 添加图片
    if (addImageBtn && imageInput) {
        addImageBtn.addEventListener('click', () => {
            console.log('Add image button clicked');
            imageInput.click();
        });
        
        // 预览图片
        imageInput.addEventListener('change', () => {
            console.log('Image input changed');
            const files = Array.from(imageInput.files);
            previewContainer.innerHTML = '';
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
    }
    
    // 发布动态
    if (publishBtn) {
        publishBtn.addEventListener('click', () => {
            console.log('Publish button clicked');
            const content = dialog.querySelector('textarea').value.trim();
            if (!content) return;
            
            const images = Array.from(previewContainer.querySelectorAll('img')).map(img => img.src);
            
            const moment = {
                id: Date.now(),
                userId: state.currentUser.id,
                content,
                images,
                likes: 0,
                comments: [],
                timestamp: new Date()
            };
            
            state.moments.unshift(moment);
            renderMoments();
            
            dialog.style.display = 'none';
            removeOverlay();
            clearDialog();
        });
    }
}

// 创建遮罩层
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'block';
    return overlay;
}

// 移除遮罩层
function removeOverlay() {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.remove();
    }
}

// 清空对话框
function clearDialog() {
    const dialog = document.querySelector('.post-moment-dialog');
    dialog.querySelector('textarea').value = '';
    dialog.querySelector('.preview-images').innerHTML = '';
    dialog.querySelector('#momentImageInput').value = '';
}

// 设置消息处理
function setupMessageHandling() {
    console.log('Setting up message handling...');
    // TODO: 实现实时消息处理
}

// 确保DOM加载完成后再初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    initApp();
}); 