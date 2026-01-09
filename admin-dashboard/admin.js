// Initialize dashboard data
const dashboardData = {
  totalUsers: 2543,
  totalRevenue: 45231,
  activeInvestments: 1234,
  pendingKyc: 48,
  revenueChange: 8.2,
  usersChange: 12.5,
  investmentsChange: 5.1,
  kycChange: 15
};

// Show notification on page load
window.addEventListener("load", () => {
  const notification = document.getElementById("notification")
  notification.classList.add("show")

  // Auto hide after 5 seconds
  setTimeout(() => {
    closeNotification()
  }, 5000)
  
  // Load saved language preference
  const savedLanguage = localStorage.getItem('adminLanguage') || 'en';
  document.querySelector('.language-select').value = savedLanguage;
  applyLanguage(savedLanguage);
  
  // Initialize dashboard data
  initializeDashboardData();
  
  // Setup chart event listeners
  setupChartFilters();
})

// Close notification
function closeNotification() {
  const notification = document.getElementById("notification")
  notification.classList.remove("show")
}

// Initialize and update dashboard data
function initializeDashboardData() {
  // Load from localStorage or use defaults
  const savedData = JSON.parse(localStorage.getItem('dashboardData') || '{}');
  const data = { ...dashboardData, ...savedData };
  
  // Update stat cards
  updateStatCard(0, data.totalUsers, data.usersChange, 'positive');
  updateStatCard(1, '$' + data.totalRevenue.toLocaleString(), data.revenueChange, 'positive');
  updateStatCard(2, data.activeInvestments, data.investmentsChange, 'positive');
  updateStatCard(3, data.pendingKyc, data.kycChange, 'negative');
  
  // Update transactions table with sample data
  updateTransactionsTable();
  
  // Populate all transactions section
  populateAllTransactions();
  
  // Save data to localStorage
  localStorage.setItem('dashboardData', JSON.stringify(data));
}

// Update individual stat card
function updateStatCard(index, value, change, type) {
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards[index]) {
    const valueElement = statCards[index].querySelector('.stat-value');
    const changeElement = statCards[index].querySelector('.stat-change');
    
    if (valueElement) {
      valueElement.textContent = value;
    }
    
    if (changeElement) {
      const sign = change >= 0 ? '+' : '';
      const changeClass = type === 'positive' ? 'positive' : 'negative';
      const keyword = index === 3 ? 'new requests' : 'from last month';
      changeElement.className = 'stat-change ' + changeClass;
      changeElement.innerHTML = `${sign}${change}% <span data-translate="${index === 3 ? 'newRequests' : 'fromLastMonth'}">${keyword}</span>`;
    }
  }
}

// Update transactions table with data
function updateTransactionsTable() {
  const transactions = [
    { id: '12345', user: 'Sanju Talukder', avatar: 'ST', amount: '$1,250.00', type: 'Deposit', status: 'Completed', date: '2025-01-08 14:30' },
    { id: '12344', user: 'Piyush Thakur', avatar: 'PT', amount: '$850.50', type: 'Withdrawal', status: 'Pending', date: '2025-01-08 12:15' },
    { id: '12343', user: 'Madison Lopez', avatar: 'ML', amount: '$2,500.00', type: 'Investment', status: 'Completed', date: '2025-01-08 10:45' },
    { id: '12342', user: 'Ugwu Kingsley', avatar: 'UK', amount: '$450.00', type: 'Deposit', status: 'Failed', date: '2025-01-08 09:20' },
    { id: '12341', user: 'Oussama Kal', avatar: 'OK', amount: '$3,200.00', type: 'Investment', status: 'Completed', date: '2025-01-07 16:55' }
  ];
  
  // Store in localStorage
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  // Update table display with transactions from localStorage
  const tableBody = document.querySelector('.data-table tbody');
  if (tableBody && tableBody.querySelectorAll('tr').length > 0) {
    // Table already populated with static data, ensure data is saved
    console.log('Transactions table initialized with ' + transactions.length + ' records');
  }
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebarOverlay")

  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("show")
    overlay.classList.toggle("show")
  } else {
    sidebar.classList.toggle("collapsed")
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebarOverlay")

  sidebar.classList.remove("show")
  overlay.classList.remove("show")
}

// Toggle dropdown
let currentDropdown = null

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId)

  // Close current dropdown if different
  if (currentDropdown && currentDropdown !== dropdown) {
    currentDropdown.classList.remove("show")
  }

  dropdown.classList.toggle("show")
  currentDropdown = dropdown.classList.contains("show") ? dropdown : null
}

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.remove("show")
    })
    currentDropdown = null
  }
})

// Toggle submenu
function toggleSubmenu(event) {
  event.preventDefault()
  const navItem = event.currentTarget.closest(".nav-item")
  navItem.classList.toggle("open")
}

// Language change
function changeLanguage(lang) {
  console.log("Language changed to:", lang)
  localStorage.setItem('adminLanguage', lang);
  applyLanguage(lang);
  // Force a small delay to ensure DOM is updated
  setTimeout(() => {
    console.log('Language change completed');
  }, 100);
}

// View transaction
function viewTransaction(id) {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const transaction = transactions.find(t => t.id === id);
  
  if (transaction) {
    const modal = document.createElement('div');
    modal.id = 'transactionModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content transaction-modal">
        <div class="modal-header">
          <h2>Transaction Details - #TXN-${transaction.id}</h2>
          <button class="modal-close" onclick="closeTransactionModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="transaction-details">
            <div class="detail-row">
              <span class="detail-label">User:</span>
              <span class="detail-value">${transaction.user}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">${transaction.amount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${transaction.type}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value badge ${transaction.status.toLowerCase()}">${transaction.status}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${transaction.date}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="closeTransactionModal()">Close</button>
          <button class="btn-primary" onclick="downloadTransactionReceipt('${transaction.id}')">Download Receipt</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  } else {
    console.log("Transaction not found:", id);
  }
}

// Close transaction modal
function closeTransactionModal() {
  const modal = document.getElementById('transactionModal');
  if (modal) {
    modal.remove();
  }
}

// Download transaction receipt
function downloadTransactionReceipt(id) {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const transaction = transactions.find(t => t.id === id);
  
  if (transaction) {
    // Create receipt content
    const receiptContent = `
RIVERTRADE - TRANSACTION RECEIPT
==================================
Transaction ID: #TXN-${transaction.id}
Date: ${transaction.date}
User: ${transaction.user}
Type: ${transaction.type}
Amount: ${transaction.amount}
Status: ${transaction.status}

Thank you for using Rivertrade!
==================================
    `;
    
    // Create and download file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
    element.setAttribute('download', `receipt_${id}.txt`);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    console.log('Receipt downloaded for transaction ' + id);
  } else {
    alert('Transaction not found');
  }
}

// Close sidebar when clicking nav links on mobile (but not submenu toggles)
document.addEventListener("click", (e) => {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebarOverlay")
  
  // Check if click is on a nav link that is NOT a submenu toggle (has-submenu class)
  const navItem = e.target.closest(".nav-item")
  const isSubmenuToggle = navItem && navItem.classList.contains("has-submenu") && e.target.closest("a[onclick*='toggleSubmenu']")
  
  if (navItem && !isSubmenuToggle && window.innerWidth <= 768 && sidebar.classList.contains("show")) {
    sidebar.classList.remove("show")
    overlay.classList.remove("show")
  }
})

// Charts
const revenueChart = document.getElementById("revenueChart")
const userChart = document.getElementById("userChart")

// Chart data for different periods
const chartDataByPeriod = {
  revenue: {
    '7days': [3200, 4100, 3800, 5200, 4800, 6100, 5800],
    '30days': [3200, 4100, 3800, 5200, 4800, 6100, 5800, 5900, 6200, 5800, 6500, 6800, 6200, 6500, 6800, 7100, 6900, 7200, 7500, 7200, 7800, 8100, 7900, 8200, 8500, 8200, 8800, 9100, 8900, 9200],
    '90days': Array.from({ length: 90 }, (_, i) => Math.floor(Math.random() * 5000 + 3000))
  },
  users: {
    '7days': [120, 180, 150, 220, 190, 280, 250],
    '30days': [120, 180, 150, 220, 190, 280, 250, 300, 280, 350, 320, 400, 380, 450, 420, 500, 480, 550, 520, 600, 580, 650, 620, 700, 680, 750, 720, 800, 780, 850],
    '90days': Array.from({ length: 90 }, (_, i) => Math.floor(Math.random() * 400 + 100))
  }
};

// Setup chart period filters
function setupChartFilters() {
  const chartSelects = document.querySelectorAll('.chart-select');
  
  chartSelects.forEach((select) => {
    select.addEventListener('change', function() {
      const period = this.value; // '7days', '30days', or '90days'
      const chartType = this.getAttribute('data-chart'); // 'revenue' or 'users'
      
      if (chartType === 'revenue' && revenueChart) {
        const ctx = revenueChart.getContext("2d");
        drawLineChart(ctx, revenueChart, chartDataByPeriod.revenue[period], "#5e3fc9");
      } else if (chartType === 'users' && userChart) {
        const ctx = userChart.getContext("2d");
        drawLineChart(ctx, userChart, chartDataByPeriod.users[period], "#00b894");
      }
    });
  });
}

// Simple chart drawing (using canvas)
if (revenueChart) {
  const ctx = revenueChart.getContext("2d")
  drawLineChart(ctx, revenueChart, [3200, 4100, 3800, 5200, 4800, 6100, 5800], "#5e3fc9")
}

if (userChart) {
  const ctx = userChart.getContext("2d")
  drawLineChart(ctx, userChart, [120, 180, 150, 220, 190, 280, 250], "#00b894")
}

function drawLineChart(ctx, canvas, data, color) {
  const width = (canvas.width = canvas.offsetWidth * 2)
  const height = (canvas.height = 600)
  const padding = 60
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // Find min and max
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw grid lines
  ctx.strokeStyle = "#e1e8ed"
  ctx.lineWidth = 1

  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  // Draw line
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.lineJoin = "round"
  ctx.lineCap = "round"

  ctx.beginPath()
  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = height - padding - ((value - min) / range) * chartHeight

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  // Draw gradient fill
  const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
  gradient.addColorStop(0, color + "40")
  gradient.addColorStop(1, color + "00")

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(padding, height - padding)
  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = height - padding - ((value - min) / range) * chartHeight
    ctx.lineTo(x, y)
  })
  ctx.lineTo(width - padding, height - padding)
  ctx.closePath()
  ctx.fill()

  // Draw points
  ctx.fillStyle = color
  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = height - padding - ((value - min) / range) * chartHeight

    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()

    // White center
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = color
  })

  // Draw labels
  ctx.fillStyle = "#636e72"
  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
  ctx.textAlign = "center"

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    ctx.fillText(days[index], x, height - padding + 40)
  })
}

window.addEventListener("resize", () => {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebarOverlay")

  // Reset sidebar state on desktop
  if (window.innerWidth > 768) {
    sidebar.classList.remove("show")
    overlay.classList.remove("show")
  }

  // Redraw charts on resize
  if (revenueChart) {
    const ctx = revenueChart.getContext("2d")
    drawLineChart(ctx, revenueChart, [3200, 4100, 3800, 5200, 4800, 6100, 5800], "#5e3fc9")
  }

  if (userChart) {
    const ctx = userChart.getContext("2d")
    drawLineChart(ctx, userChart, [120, 180, 150, 220, 190, 280, 250], "#00b894")
  }
})

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      })
    }
  })
})

// Add active state to nav items
document.querySelectorAll(".nav-item a").forEach((link) => {
  link.addEventListener("click", function () {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
    })
    this.closest(".nav-item").classList.add("active")
  })
})

// ===== PROFILE DROPDOWN FUNCTIONS =====

// Navigate to profile page
function goToProfile() {
  // Redirect to profile page (create this page or link to existing)
  window.location.href = '#profile';
  // Alternatively, if you have a separate profile page:
  // window.location.href = 'profile.html';
}

// Open change password modal
function openChangePasswordModal() {
  // Create and show a change password modal
  const modal = document.createElement('div');
  modal.id = 'changePasswordModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content change-password-modal">
      <div class="modal-header">
        <h2>Change Password</h2>
        <button class="modal-close" onclick="closeChangePasswordModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="changePasswordForm" onsubmit="submitPasswordChange(event)">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" name="currentPassword" required placeholder="Enter current password">
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input type="password" id="newPassword" name="newPassword" required placeholder="Enter new password">
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm new password">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" onclick="closeChangePasswordModal()">Cancel</button>
            <button type="submit" class="btn-primary">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

// Close change password modal
function closeChangePasswordModal() {
  const modal = document.getElementById('changePasswordModal');
  if (modal) {
    modal.remove();
  }
}

// Submit password change
function submitPasswordChange(event) {
  event.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validate passwords match
  if (newPassword !== confirmPassword) {
    alert('New passwords do not match!');
    return;
  }
  
  // Validate password strength (minimum 8 characters)
  if (newPassword.length < 8) {
    alert('Password must be at least 8 characters long');
    return;
  }
  
  // Here you would typically send this to your backend
  console.log('Password change request:', {
    currentPassword,
    newPassword
  });
  
  // Show success message
  alert('Password updated successfully!');
  closeChangePasswordModal();
  
  // Optional: You can add an API call here
  // updatePassword(currentPassword, newPassword);
}

// Logout function
function handleLogout() {
  // Clear user data from localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  
  // Show logout message
  alert('You have been logged out successfully');
  
  // Redirect to login page
  window.location.href = '../auth.html';
}

// Attach event listeners to dropdown menu items
document.addEventListener('DOMContentLoaded', function() {
  // Get all dropdown items
  const profileDropdown = document.getElementById('userDropdown');
  if (profileDropdown) {
    const dropdownItems = profileDropdown.querySelectorAll('.dropdown-item');
    
    if (dropdownItems.length >= 3) {
      // Profile link
      dropdownItems[0].onclick = function(e) {
        e.preventDefault();
        goToProfile();
      };
      
      // Change Password link
      dropdownItems[1].onclick = function(e) {
        e.preventDefault();
        openChangePasswordModal();
      };
      
      // Logout link
      dropdownItems[2].onclick = function(e) {
        e.preventDefault();
        handleLogout();
      };
    }
  }
  
  // Initialize notifications
  initializeNotifications();
});

// ===== NOTIFICATIONS MANAGEMENT =====

// Initialize notifications from localStorage or sample data
function initializeNotifications() {
  let notifications = localStorage.getItem('notifications');
  if (!notifications) {
    // Initialize with sample notifications if none exist
    notifications = [
      {
        id: 1,
        user: 'Sanju Talukder',
        message: 'joined the system',
        type: 'user-plus',
        time: '7 hours ago',
        read: false
      },
      {
        id: 2,
        user: 'Piyush Thakur',
        message: 'requested KYC verification',
        type: 'kyc',
        time: '8 hours ago',
        read: false
      },
      {
        id: 3,
        user: 'Madison Lopez',
        message: 'joined the system',
        type: 'user-plus',
        time: '2 days ago',
        read: false
      }
    ];
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
  
  // Attach click handlers to notification items
  const notificationItems = document.querySelectorAll('.notification-item');
  notificationItems.forEach((item, index) => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      markNotificationAsRead(index);
    });
  });
}

// Mark single notification as read
function markNotificationAsRead(index) {
  let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  if (notifications[index]) {
    notifications[index].read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Update UI
    const notificationItems = document.querySelectorAll('.notification-item');
    if (notificationItems[index]) {
      notificationItems[index].classList.add('read');
      notificationItems[index].style.opacity = '0.6';
    }
    
    updateNotificationBadge();
  }
}

// Mark all notifications as read
function markAllNotificationsAsRead() {
  let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.forEach(notif => notif.read = true);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // Update UI
  document.querySelectorAll('.notification-item').forEach(item => {
    item.classList.add('read');
    item.style.opacity = '0.6';
  });
  
  updateNotificationBadge();
  
  // Show success message
  showNotificationMessage('All notifications marked as read!');
}

// View all notifications
function viewAllNotifications() {
  let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  // Create a modal to display all notifications
  const modal = document.createElement('div');
  modal.id = 'allNotificationsModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content notifications-modal">
      <div class="modal-header">
        <h2>All Notifications</h2>
        <button class="modal-close" onclick="closeAllNotificationsModal()">&times;</button>
      </div>
      <div class="modal-body notifications-list-container">
        ${notifications.length > 0 ? notifications.map((notif, index) => `
          <div class="notification-item-full ${notif.read ? 'read' : ''}">
            <div class="notification-icon-wrapper">
              <div class="notification-icon-small ${notif.type}">
                <i class="fas fa-${notif.type === 'user-plus' ? 'user-plus' : 'shield'}"></i>
              </div>
            </div>
            <div class="notification-content-full">
              <p><strong>${notif.user}</strong> ${notif.message}</p>
              <span class="time">${notif.time}</span>
            </div>
            <div class="notification-actions">
              <button class="btn-sm" onclick="markNotificationAsRead(${index})">Mark as Read</button>
              <button class="btn-sm danger" onclick="deleteNotification(${index})">Delete</button>
            </div>
          </div>
        `).join('') : '<p class="no-notifications">No notifications</p>'}
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeAllNotificationsModal()">Close</button>
        <button class="btn-primary" onclick="markAllNotificationsAsRead()">Mark All as Read</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

// Close all notifications modal
function closeAllNotificationsModal() {
  const modal = document.getElementById('allNotificationsModal');
  if (modal) {
    modal.remove();
  }
}

// Delete a notification
function deleteNotification(index) {
  let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.splice(index, 1);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // Refresh the view
  viewAllNotifications();
  updateNotificationBadge();
}

// Update notification badge count
function updateNotificationBadge() {
  let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const badge = document.querySelector('.notification-badge');
  if (badge) {
    badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }
}

// Show notification toast message
function showNotificationMessage(message) {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #5e3fc9;
    color: white;
    padding: 15px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10001;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Attach handlers to notification buttons when page loads
document.addEventListener('DOMContentLoaded', function() {
  const markAllBtn = document.querySelector('.dropdown-footer .btn-secondary');
  const viewAllBtn = document.querySelector('.dropdown-footer .btn-primary');
  
  if (markAllBtn) {
    markAllBtn.addEventListener('click', markAllNotificationsAsRead);
  }
  
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      viewAllNotifications();
    });
  }
  
  // Initialize notification badge
  updateNotificationBadge();
});
// ===== LANGUAGE/TRANSLATION SYSTEM =====

const translations = {
  en: {
    // Header
    dashboard: 'Dashboard',
    language: 'Language',
    notifications: 'Notifications',
    profile: 'Profile',
    changePassword: 'Change Password',
    logout: 'Logout',
    
    // Sidebar
    customerManagement: 'Customer Management',
    customers: 'Customers',
    allCustomers: 'All Customers',
    activeCustomers: 'Active Customers',
    disabledCustomers: 'Disabled Customers',
    kycNotifications: 'Notifications',
    sendEmailToAll: 'Send Email to All',
    sendMessageToAll: 'Send Message to All',
    
    kycManagement: 'KYC Management',
    pendingKyc: 'Pending KYC',
    rejectedKyc: 'Rejected KYC',
    allKycLogs: 'All KYC Logs',
    kycForm: 'KYC Form',
    
    staffManagement: 'Staff Management',
    manageRoles: 'Manage Roles',
    manageStaffs: 'Manage Staffs',
    
    plans: 'Plans',
    manageSchema: 'Manage Schema',
    schedule: 'Schedule',
    holiday: 'Holiday',
    schema: 'Manage Schema',
    manageSchedule: 'Manage Crowd Schema',
    
    transactions: 'Transactions',
    investments: 'Investments',
    
    // Main Content
    welcomeBack: 'Welcome back! Here\'s what\'s happening with your platform today.',
    
    // Stats Cards
    totalUsers: 'Total Users',
    totalRevenue: 'Total Revenue',
    activeInvestments: 'Active Investments',
    pendingKycRequests: 'Pending KYC',
    fromLastMonth: 'from last month',
    newRequests: 'new requests',
    
    // Charts
    revenueOverview: 'Revenue Overview',
    userGrowth: 'User Growth',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    last90Days: 'Last 90 days',
    
    // Transactions Table
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    transactionId: 'Transaction ID',
    user: 'User',
    amount: 'Amount',
    type: 'Type',
    status: 'Status',
    date: 'Date',
    action: 'Action',
    view: 'View',
    
    // Status badges
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    investment: 'Investment',
    
    // Notifications
    markAllAsRead: 'Mark All as Read',
    joinedTheSystem: 'joined the system',
    requestedKycVerification: 'requested KYC verification',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    
    // Buttons
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    update: 'Update',
    send: 'Send',
    
    // Customer Management
    addCustomer: 'Add Customer',
    editCustomer: 'Edit Customer',
    deleteCustomer: 'Delete Customer',
    
    // Role Management
    addRole: 'Add Role',
    editRole: 'Edit Role',
    
    // Staff Management
    addStaff: 'Add Staff Member',
    editStaff: 'Edit Staff',
    removeStaff: 'Remove Staff',
    
    // Holiday Management
    addHoliday: 'Add Holiday',
    
    // Schema Management
    addSchema: 'Add Schema',
    editSchema: 'Edit Schema',
    deleteSchema: 'Delete Schema',
    
    // Crowd Schema
    addCrowdSchema: 'Add Crowd Schema',
    editCrowdSchema: 'Edit Crowd Schema',
    deleteCrowdSchema: 'Delete Crowd Schema',
    manageCrowdSchema: 'Manage Crowd Schema'
  },
  
  es: {
    // Header
    dashboard: 'Panel de Control',
    language: 'Idioma',
    notifications: 'Notificaciones',
    profile: 'Perfil',
    changePassword: 'Cambiar Contraseña',
    logout: 'Cerrar Sesión',
    
    // Sidebar
    customerManagement: 'Gestión de Clientes',
    customers: 'Clientes',
    allCustomers: 'Todos los Clientes',
    activeCustomers: 'Clientes Activos',
    disabledCustomers: 'Clientes Deshabilitados',
    kycNotifications: 'Notificaciones',
    sendEmailToAll: 'Enviar Correo a Todos',
    sendMessageToAll: 'Enviar Mensaje a Todos',
    
    kycManagement: 'Gestión KYC',
    pendingKyc: 'KYC Pendiente',
    rejectedKyc: 'KYC Rechazado',
    allKycLogs: 'Todos los Registros KYC',
    kycForm: 'Formulario KYC',
    
    staffManagement: 'Gestión de Personal',
    manageRoles: 'Gestionar Roles',
    manageStaffs: 'Gestionar Personal',
    
    plans: 'Planes',
    manageSchema: 'Gestionar Esquema',
    schedule: 'Horario',
    holiday: 'Festivo',
    schema: 'Gestionar Esquema',
    manageSchedule: 'Gestionar Esquema Crowdfunding',
    
    transactions: 'Transacciones',
    investments: 'Inversiones',
    
    // Main Content
    welcomeBack: '¡Bienvenido de vuelta! Aquí está lo que está sucediendo en tu plataforma hoy.',
    
    // Stats Cards
    totalUsers: 'Total de Usuarios',
    totalRevenue: 'Ingresos Totales',
    activeInvestments: 'Inversiones Activas',
    pendingKycRequests: 'KYC Pendiente',
    fromLastMonth: 'del mes pasado',
    newRequests: 'nuevas solicitudes',
    
    // Charts
    revenueOverview: 'Descripción de Ingresos',
    userGrowth: 'Crecimiento de Usuarios',
    last7Days: 'Últimos 7 días',
    last30Days: 'Últimos 30 días',
    last90Days: 'Últimos 90 días',
    
    // Transactions Table
    recentTransactions: 'Transacciones Recientes',
    viewAll: 'Ver Todo',
    transactionId: 'ID de Transacción',
    user: 'Usuario',
    amount: 'Cantidad',
    type: 'Tipo',
    status: 'Estado',
    date: 'Fecha',
    action: 'Acción',
    view: 'Ver',
    
    // Status badges
    completed: 'Completado',
    pending: 'Pendiente',
    failed: 'Fallido',
    deposit: 'Depósito',
    withdrawal: 'Retiro',
    investment: 'Inversión',
    
    // Notifications
    markAllAsRead: 'Marcar Todo como Leído',
    joinedTheSystem: 'se unió al sistema',
    requestedKycVerification: 'solicitó verificación KYC',
    hoursAgo: 'hace horas',
    daysAgo: 'hace días',
    
    // Buttons
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    update: 'Actualizar',
    send: 'Enviar',
    
    // Customer Management
    addCustomer: 'Añadir Cliente',
    editCustomer: 'Editar Cliente',
    deleteCustomer: 'Eliminar Cliente',
    
    // Role Management
    addRole: 'Añadir Rol',
    editRole: 'Editar Rol',
    
    // Staff Management
    addStaff: 'Añadir Miembro del Personal',
    editStaff: 'Editar Personal',
    removeStaff: 'Eliminar Personal',
    
    // Holiday Management
    addHoliday: 'Añadir Festivo',
    
    // Schema Management
    addSchema: 'Añadir Esquema',
    editSchema: 'Editar Esquema',
    deleteSchema: 'Eliminar Esquema',
    
    // Crowd Schema
    addCrowdSchema: 'Añadir Esquema Participativo',
    editCrowdSchema: 'Editar Esquema Participativo',
    deleteCrowdSchema: 'Eliminar Esquema Participativo',
    manageCrowdSchema: 'Gestionar Esquema Participativo'
  },
  
  fr: {
    // Header
    dashboard: 'Tableau de Bord',
    language: 'Langue',
    notifications: 'Notifications',
    profile: 'Profil',
    changePassword: 'Modifier le Mot de Passe',
    logout: 'Se Déconnecter',
    
    // Sidebar
    customerManagement: 'Gestion des Clients',
    customers: 'Clients',
    allCustomers: 'Tous les Clients',
    activeCustomers: 'Clients Actifs',
    disabledCustomers: 'Clients Désactivés',
    kycNotifications: 'Notifications',
    sendEmailToAll: 'Envoyer un E-mail à Tous',
    sendMessageToAll: 'Envoyer un Message à Tous',
    
    kycManagement: 'Gestion KYC',
    pendingKyc: 'KYC en Attente',
    rejectedKyc: 'KYC Rejeté',
    allKycLogs: 'Tous les Journaux KYC',
    kycForm: 'Formulaire KYC',
    
    staffManagement: 'Gestion du Personnel',
    manageRoles: 'Gérer les Rôles',
    manageStaffs: 'Gérer le Personnel',
    
    plans: 'Plans',
    manageSchema: 'Gérer le Schéma',
    schedule: 'Horaire',
    holiday: 'Jour Férié',
    schema: 'Gérer le Schéma',
    manageSchedule: 'Gérer le Schéma Participatif',
    
    transactions: 'Transactions',
    investments: 'Investissements',
    
    // Main Content
    welcomeBack: 'Bienvenue! Voici ce qui se passe sur votre plateforme aujourd\'hui.',
    
    // Stats Cards
    totalUsers: 'Nombre Total d\'Utilisateurs',
    totalRevenue: 'Revenu Total',
    activeInvestments: 'Investissements Actifs',
    pendingKycRequests: 'KYC en Attente',
    fromLastMonth: 'du mois dernier',
    newRequests: 'nouvelles demandes',
    
    // Charts
    revenueOverview: 'Aperçu des Revenus',
    userGrowth: 'Croissance des Utilisateurs',
    last7Days: '7 derniers jours',
    last30Days: '30 derniers jours',
    last90Days: '90 derniers jours',
    
    // Transactions Table
    recentTransactions: 'Transactions Récentes',
    viewAll: 'Voir Tout',
    transactionId: 'ID de Transactio',
    user: 'Utilisateur',
    amount: 'Montant',
    type: 'Type',
    status: 'Statut',
    date: 'Date',
    action: 'Action',
    view: 'Voir',
    
    // Status badges
    completed: 'Terminé',
    pending: 'En Attente',
    failed: 'Échoué',
    deposit: 'Dépôt',
    withdrawal: 'Retrait',
    investment: 'Investissement',
    
    // Notifications
    markAllAsRead: 'Marquer Tout comme Lu',
    joinedTheSystem: 'a rejoint le système',
    requestedKycVerification: 'a demandé la vérification KYC',
    hoursAgo: 'il y a des heures',
    daysAgo: 'il y a des jours',
    
    // Buttons
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    update: 'Mettre à Jour',
    send: 'Envoyer',
    
    // Customer Management
    addCustomer: 'Ajouter un Client',
    editCustomer: 'Modifier un Client',
    deleteCustomer: 'Supprimer un Client',
    
    // Role Management
    addRole: 'Ajouter un Rôle',
    editRole: 'Modifier un Rôle',
    
    // Staff Management
    addStaff: 'Ajouter un Membre du Personnel',
    editStaff: 'Modifier le Personnel',
    removeStaff: 'Supprimer le Personnel',
    
    // Holiday Management
    addHoliday: 'Ajouter un Jour Férié',
    
    // Schema Management
    addSchema: 'Ajouter un Schéma',
    editSchema: 'Modifier un Schéma',
    deleteSchema: 'Supprimer un Schéma',
    
    // Crowd Schema
    addCrowdSchema: 'Ajouter un Schéma Participatif',
    editCrowdSchema: 'Modifier un Schéma Participatif',
    deleteCrowdSchema: 'Supprimer un Schéma Participatif',
    manageCrowdSchema: 'Gérer le Schéma Participatif'
  }
};

// Apply language translations
function applyLanguage(lang) {
  if (!translations[lang]) {
    console.warn('Language not found:', lang);
    return;
  }
  
  const t = translations[lang];
  console.log('Applying language:', lang);
  
  // Update all text elements with data-translate attribute
  const elements = document.querySelectorAll('[data-translate]');
  console.log('Elements with data-translate:', elements.length);
  
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (t[key]) {
      try {
        // Only update the direct text node, not children
        if (element.childNodes.length === 0 || (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3)) {
          // Element has no children or only text node
          element.textContent = t[key];
        } else if (element.tagName === 'SPAN' || element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'LI') {
          // For these tags, replace only text nodes
          let hasOnlyText = Array.from(element.childNodes).every(node => 
            node.nodeType === 3 || (node.nodeType === 1 && node.tagName === 'SPAN')
          );
          if (hasOnlyText) {
            element.textContent = t[key];
          }
        } else {
          element.textContent = t[key];
        }
      } catch (e) {
        console.error('Error translating element:', key, e);
      }
    } else {
      console.warn('Translation key not found:', key);
    }
  });
  
  // Update specific elements without data-translate attribute
  // Header
  const dashboardTitle = document.querySelector('.content-header h1');
  if (dashboardTitle) dashboardTitle.textContent = t.dashboard;
  
  // Notification buttons
  const markAllBtn = document.querySelector('.dropdown-footer .btn-secondary');
  if (markAllBtn) markAllBtn.textContent = t.markAllAsRead;
  
  const viewAllBtn = document.querySelector('.dropdown-footer .btn-primary');
  if (viewAllBtn) viewAllBtn.textContent = t.viewAll;
  
  console.log('Language applied successfully');
  
  // Save language preference
  localStorage.setItem('adminLanguage', lang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedLanguage = localStorage.getItem('adminLanguage') || 'en';
  const langSelect = document.querySelector('.language-select');
  if (langSelect) {
    langSelect.value = savedLanguage;
  }
  applyLanguage(savedLanguage);
  
  // Initialize section navigation
  initSectionNavigation();
});

// Navigate to section
function navigateToSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
    window.scrollTo(0, 0);
  }
  
  // Update active nav item
  document.querySelectorAll('.nav-item, .submenu li').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
  if (activeLink) {
    activeLink.closest('li').classList.add('active');
  }
  
  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('show');
    document.getElementById('sidebarOverlay').classList.remove('show');
  }
}

// Initialize section navigation
function initSectionNavigation() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    // Skip submenu toggles
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes('toggleSubmenu')) {
      return;
    }
    
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#') {
        e.preventDefault();
        const sectionId = href.substring(1);
        navigateToSection(sectionId);
      }
    });
  });
}

// Customer Management Functions
function editCustomer(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Customer #${id}</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveCustomerEdit(event, ${id})">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" required placeholder="Customer name">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" required placeholder="Email address">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" required placeholder="Phone number">
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveCustomerEdit(event, id) {
  event.preventDefault();
  alert('Customer ' + id + ' updated successfully');
  event.target.closest('.modal-overlay').remove();
}

function deleteCustomer(id) {
  if (confirm('Are you sure you want to delete this customer?')) {
    alert('Customer ' + id + ' deleted successfully');
  }
}

function addCustomer() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Add New Customer</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveNewCustomer(event)">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" required placeholder="Customer name">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" required placeholder="Email address">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" required placeholder="Phone number">
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Add Customer</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveNewCustomer(event) {
  event.preventDefault();
  alert('New customer added successfully');
  event.target.closest('.modal-overlay').remove();
}

// KYC Management Functions
function approveKyc(id) {
  if (confirm('Are you sure you want to approve this KYC request?')) {
    // Update stat
    const card = document.querySelector('.stat-card:nth-child(4)');
    if (card) {
      const currentValue = parseInt(card.querySelector('.stat-value').textContent);
      card.querySelector('.stat-value').textContent = currentValue - 1;
    }
    alert('KYC request ' + id + ' approved successfully');
  }
}

function rejectKyc(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Reject KYC Request</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form onsubmit="submitKycRejection(event, ${id})">
          <div class="form-group">
            <label>Reason for Rejection</label>
            <textarea required placeholder="Explain why you're rejecting this KYC" rows="4"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Reject KYC</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function submitKycRejection(event, id) {
  event.preventDefault();
  alert('KYC request ' + id + ' rejected');
  event.target.closest('.modal-overlay').remove();
}

function viewKycDetails(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content transaction-modal">
      <div class="modal-header">
        <h2>KYC Request #${id}</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="transaction-details">
          <div class="detail-row">
            <span class="detail-label">Request ID:</span>
            <span class="detail-value">#KYC${id}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">User Name:</span>
            <span class="detail-value">Piyush Thakur</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">piyush@example.com</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Document Type:</span>
            <span class="detail-value">Passport</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Submitted Date:</span>
            <span class="detail-value">2025-01-08</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value badge pending">Pending</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
        <button class="btn-primary" onclick="approveKyc(${id}); this.closest('.modal-overlay').remove()">Approve</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function submitKycForm(event) {
  event.preventDefault();
  alert('KYC form submitted successfully');
}

// Email and Message Functions
function sendEmailToAll(event) {
  event.preventDefault();
  
  const subject = event.target.querySelector('input').value;
  const message = event.target.querySelector('textarea').value;
  
  if (!subject || !message) {
    alert('Please fill in all fields');
    return;
  }
  
  const confirmSend = confirm(`Send email to all customers?\n\nSubject: ${subject}\nRecipients: All Customers`);
  
  if (confirmSend) {
    // Save email log
    const emailLog = JSON.parse(localStorage.getItem('emailLog') || '[]');
    emailLog.push({
      id: emailLog.length + 1,
      subject,
      message,
      recipient: 'All Customers',
      sentDate: new Date().toLocaleString(),
      status: 'Sent'
    });
    localStorage.setItem('emailLog', JSON.stringify(emailLog));
    
    alert('Email sent to all customers successfully!');
    event.target.reset();
  }
}

function sendMessageToAll(event) {
  event.preventDefault();
  
  const message = event.target.querySelector('textarea').value;
  
  if (!message) {
    alert('Please enter a message');
    return;
  }
  
  const confirmSend = confirm(`Send message to all customers?\n\nMessage: ${message.substring(0, 50)}...`);
  
  if (confirmSend) {
    // Save message log
    const messageLog = JSON.parse(localStorage.getItem('messageLog') || '[]');
    messageLog.push({
      id: messageLog.length + 1,
      message,
      recipient: 'All Customers',
      sentDate: new Date().toLocaleString(),
      status: 'Delivered'
    });
    localStorage.setItem('messageLog', JSON.stringify(messageLog));
    
    alert('Message sent to all customers successfully!');
    event.target.reset();
  }
}

// Role Management Functions
function editRole(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Role #${id}</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveRoleEdit(event, ${id})">
          <div class="form-group">
            <label>Role Name</label>
            <input type="text" required placeholder="Role name">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea required placeholder="Role description" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>Permissions</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label><input type="checkbox"> View Dashboard</label>
              <label><input type="checkbox"> Manage Customers</label>
              <label><input type="checkbox"> Manage KYC</label>
              <label><input type="checkbox"> Manage Transactions</label>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Save Role</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveRoleEdit(event, id) {
  event.preventDefault();
  alert('Role ' + id + ' updated successfully');
  event.target.closest('.modal-overlay').remove();
}

function addRole() {
  editRole('new');
}

// Staff Management Functions
function editStaff(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Staff #${id}</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveStaffEdit(event, ${id})">
          <div class="form-group">
            <label>Staff Name</label>
            <input type="text" required placeholder="Staff name">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" required placeholder="Email address">
          </div>
          <div class="form-group">
            <label>Role</label>
            <select required>
              <option>Admin</option>
              <option>Manager</option>
              <option>Staff</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveStaffEdit(event, id) {
  event.preventDefault();
  alert('Staff ' + id + ' updated successfully');
  event.target.closest('.modal-overlay').remove();
}

function removeStaff(id) {
  if (confirm('Are you sure you want to remove this staff member?')) {
    alert('Staff ' + id + ' removed successfully');
  }
}

function addStaff() {
  editStaff('new');
}

// Schedule Functions
function saveSchedule(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const startDate = formData.get('startDate') || event.target.querySelector('input[type="date"]:nth-of-type(1)').value;
  const endDate = formData.get('endDate') || event.target.querySelector('input[type="date"]:nth-of-type(2)').value;
  const description = event.target.querySelector('textarea')?.value || '';
  
  if (!startDate || !endDate) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Save schedule
  const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  schedules.push({
    id: schedules.length + 1,
    startDate,
    endDate,
    description,
    createdAt: new Date().toLocaleString()
  });
  localStorage.setItem('schedules', JSON.stringify(schedules));
  
  alert('Schedule saved successfully');
  event.target.reset();
}

// Holiday Management Functions
function addHoliday() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Add Holiday</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveHoliday(event)">
          <div class="form-group">
            <label>Holiday Name</label>
            <input type="text" required placeholder="Holiday name">
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" required>
          </div>
          <div class="form-group">
            <label>Type</label>
            <select required>
              <option>Public Holiday</option>
              <option>Company Holiday</option>
              <option>Optional</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Add Holiday</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveHoliday(event) {
  event.preventDefault();
  alert('Holiday added successfully');
  event.target.closest('.modal-overlay').remove();
}

function deleteHoliday(id) {
  if (confirm('Are you sure you want to delete this holiday?')) {
    alert('Holiday deleted successfully');
  }
}

// Schema Management Functions
function editSchema(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Schema #${id}</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveSchemaEdit(event, ${id})">
          <div class="form-group">
            <label>Schema Name</label>
            <input type="text" required placeholder="Schema name">
          </div>
          <div class="form-group">
            <label>Min Amount</label>
            <input type="number" required placeholder="Minimum investment">
          </div>
          <div class="form-group">
            <label>Max Amount</label>
            <input type="number" required placeholder="Maximum investment">
          </div>
          <div class="form-group">
            <label>Return %</label>
            <input type="number" step="0.1" required placeholder="Return percentage">
          </div>
          <div class="form-group">
            <label>Duration</label>
            <input type="text" required placeholder="e.g., 12 months">
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Save Schema</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveSchemaEdit(event, id) {
  event.preventDefault();
  alert('Schema ' + id + ' updated successfully');
  event.target.closest('.modal-overlay').remove();
}

function deleteSchema(id) {
  if (confirm('Are you sure you want to delete this schema?')) {
    alert('Schema deleted successfully');
  }
}

function addSchema() {
  editSchema('new');
}

// Crowd Schema Functions
function editCrowdSchema(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Crowd Schema #${id}</h2>
        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
      </div>
      <div class="modal-body">
        <form onsubmit="saveCrowdSchemaEdit(event, ${id})">
          <div class="form-group">
            <label>Schema Name</label>
            <input type="text" required placeholder="Schema name">
          </div>
          <div class="form-group">
            <label>Target Amount</label>
            <input type="number" required placeholder="Target amount">
          </div>
          <div class="form-group">
            <label>Max Participants</label>
            <input type="number" required placeholder="Maximum participants">
          </div>
          <div class="form-group">
            <label>Status</label>
            <select required>
              <option>Active</option>
              <option>Paused</option>
              <option>Closed</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Save Schema</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveCrowdSchemaEdit(event, id) {
  event.preventDefault();
  alert('Crowd Schema ' + id + ' updated successfully');
  event.target.closest('.modal-overlay').remove();
}

function deleteCrowdSchema(id) {
  if (confirm('Are you sure you want to delete this crowd schema?')) {
    alert('Crowd Schema deleted successfully');
  }
}

function addCrowdSchema() {
  editCrowdSchema('new');
}

// ===== TRANSACTIONS MANAGEMENT =====

// Populate all transactions table
function populateAllTransactions() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const tbody = document.getElementById('allTransactionsTbody');
  
  if (tbody) {
    tbody.innerHTML = transactions.map(t => `
      <tr>
        <td>#TXN-${t.id}</td>
        <td>${t.user}</td>
        <td><span class="badge-type ${t.type.toLowerCase()}">${t.type}</span></td>
        <td><strong>${t.amount}</strong></td>
        <td><span class="badge ${t.status.toLowerCase()}">${t.status}</span></td>
        <td>${t.date}</td>
        <td><button class="action-btn" onclick="viewTransaction('${t.id}')">View</button></td>
      </tr>
    `).join('');
  }
}

// Filter transactions
function filterTransactions() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const fromDate = document.getElementById('transFromDate')?.value;
  const toDate = document.getElementById('transToDate')?.value;
  const typeFilter = document.getElementById('transTypeFilter')?.value;
  
  let filtered = transactions;
  
  // Filter by type
  if (typeFilter) {
    filtered = filtered.filter(t => t.type === typeFilter);
  }
  
  // Filter by date range
  if (fromDate || toDate) {
    filtered = filtered.filter(t => {
      const tDate = t.date.split(' ')[0]; // Extract date part
      if (fromDate && tDate < fromDate) return false;
      if (toDate && tDate > toDate) return false;
      return true;
    });
  }
  
  // Display filtered results
  const tbody = document.getElementById('allTransactionsTbody');
  if (tbody) {
    tbody.innerHTML = filtered.length > 0 
      ? filtered.map(t => `
          <tr>
            <td>#TXN-${t.id}</td>
            <td>${t.user}</td>
            <td><span class="badge-type ${t.type.toLowerCase()}">${t.type}</span></td>
            <td><strong>${t.amount}</strong></td>
            <td><span class="badge ${t.status.toLowerCase()}">${t.status}</span></td>
            <td>${t.date}</td>
            <td><button class="action-btn" onclick="viewTransaction('${t.id}')">View</button></td>
          </tr>
        `).join('')
      : '<tr><td colspan="7" style="text-align:center; padding:20px;">No transactions found</td></tr>';
  }
  
  alert(filtered.length + ' transaction(s) found');
}

// Export transactions
function exportTransactions() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }
  
  // Create CSV content
  let csv = 'Transaction ID,User,Type,Amount,Status,Date\n';
  
  transactions.forEach(t => {
    csv += `"#TXN-${t.id}","${t.user}","${t.type}","${t.amount}","${t.status}","${t.date}"\n`;
  });
  
  // Download CSV
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'transactions_' + new Date().toISOString().split('T')[0] + '.csv');
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  
  console.log('Transactions exported: ' + transactions.length + ' records');
}

// Add new transaction
function addNewTransaction(transactionData) {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  const newTransaction = {
    id: String(Math.max(...transactions.map(t => parseInt(t.id)), 0) + 1).padStart(5, '0'),
    user: transactionData.user,
    amount: transactionData.amount,
    type: transactionData.type,
    status: 'Pending',
    date: new Date().toLocaleString()
  };
  
  transactions.unshift(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  // Update display
  populateAllTransactions();
  
  return newTransaction;
}