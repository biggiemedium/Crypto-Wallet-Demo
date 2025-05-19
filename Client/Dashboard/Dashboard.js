/**
 * Dashboard controller for Stellar Wallet application
 */
class Dashboard {
    /**
     * Initialize dashboard and load user data
     */
    constructor() {
        // Check if user is authenticated first
        if (!this.checkAuthentication()) {
            // Redirect to login page if not authenticated
            window.location.href = "../Login/Login.html";
            return;
        }

        // Load user data from sessionStorage
        this.userData = this.getUserData();
        this.isDemoAccount = this.checkIfDemoAccount();

        this.currentSection = 'overview';
        this.darkMode = true;
        this.charts = {};
        this.accentColor = localStorage.getItem('accentColor') || '#149ED9';
        this.notifications = [
            {
                id: 1,
                title: 'New XLM Price Alert',
                message: 'XLM has increased by 5% in the last hour.',
                time: '15 min ago',
                isRead: false,
                type: 'alert'
            },
            {
                id: 2,
                title: 'Security Recommendation',
                message: 'Enable hardware wallet for enhanced security.',
                time: '2 hours ago',
                isRead: false,
                type: 'security'
            },
            {
                id: 3,
                title: 'Transaction Confirmed',
                message: '500 XLM payment has been confirmed.',
                time: '1 day ago',
                isRead: true,
                type: 'transaction'
            }
        ];

        // Add demo notification if using demo account
        if (this.isDemoAccount) {
            this.notifications.unshift({
                id: 0,
                title: 'Demo Account Active',
                message: 'You are using a demo account. Data shown is for demonstration purposes only.',
                time: 'Just now',
                isRead: false,
                type: 'security'
            });
        }

        this.initEventListeners();
        this.initCharts();
        this.loadStellarData();
        this.initAccentColors();
        this.initNotifications();

        /** Add moon icon for theme toggle */
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle.querySelector('.fa-moon')) {
            const moonIcon = document.createElement('i');
            moonIcon.className = 'fas fa-moon';
            moonIcon.style.display = 'none';
            darkModeToggle.appendChild(moonIcon);
        }

        /** Set current date in dashboard header */
        document.getElementById('currentDate').textContent = this.formatDate(new Date());

        /** Check for saved theme preference */
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.darkMode = false;
            document.getElementById('themeToggle').checked = false;
            this.applyTheme();

            /** Update icon display */
            const sunIcon = document.querySelector('#darkModeToggle .fa-sun');
            const moonIcon = document.querySelector('#darkModeToggle .fa-moon');
            if (sunIcon && moonIcon) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'inline-block';
            }
        }
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    checkAuthentication() {
        return sessionStorage.getItem('authenticated') === 'true';
    }

    /**
     * Get authenticated user data from session storage
     * @returns {object} User data
     */
    getUserData() {
        return {
            username: sessionStorage.getItem('currentUser'),
            walletAddress: sessionStorage.getItem('walletAddress')
        };
    }

    /**
     * Check if the current wallet address indicates a demo account
     * @returns {boolean} True if demo account
     */
    checkIfDemoAccount() {
        const walletAddress = sessionStorage.getItem('walletAddress');
        return !walletAddress ||
            walletAddress.startsWith('DEMO_') ||
            walletAddress.startsWith('DEV_WALLET_');
    }

    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        /* Navigation */
        document.querySelectorAll('.sidebar-nav a, .view-more[data-section]').forEach(navItem => {
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(navItem.dataset.section);
            });
        });

        /* Mobile menu toggle */
        document.querySelector('.menu-toggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.add('active');
        });

        document.querySelector('.mobile-close').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.remove('active');
        });

        /* Dark mode toggle */
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            this.toggleDarkMode();
            this.switchSection('settings');
        });

        document.getElementById('themeToggle').addEventListener('change', (e) => {
            this.darkMode = e.target.checked;
            this.applyTheme();
        });

        /* Notification button */
        const notificationBtn = document.querySelector('.action-btn:has(.fa-bell)');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.toggleNotifications();
            });
        }

        /* Portfolio time range buttons */
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateChartData(btn.dataset.time);

                /* Add subtle animation when changing time range */
                const chart = document.getElementById('portfolioGrowthChart');
                chart.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                chart.style.transform = 'scale(0.97)';
                chart.style.opacity = '0.7';

                setTimeout(() => {
                    chart.style.transform = 'scale(1)';
                    chart.style.opacity = '1';
                }, 300);
            });
        });

        /* Table row hover effects */
        document.querySelectorAll('tbody').forEach(tbody => {
            tbody.addEventListener('mouseover', (e) => {
                if (e.target.tagName === 'TD') {
                    e.target.parentElement.classList.add('hover');
                }
            });

            tbody.addEventListener('mouseout', (e) => {
                if (e.target.tagName === 'TD') {
                    e.target.parentElement.classList.remove('hover');
                }
            });
        });

        /* Add Stellar operation type filter functionality */
        document.querySelectorAll('.operation-type-filter').forEach(filter => {
            filter.addEventListener('click', () => {
                const operationType = filter.dataset.type;
                this.filterStellarOperations(operationType);
            });
        });

        /* Add click outside for notifications */
        document.addEventListener('click', (e) => {
            const notificationPanel = document.getElementById('notificationPanel');
            const notificationBtn = document.querySelector('.action-btn:has(.fa-bell)');

            if (notificationPanel && notificationBtn) {
                if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
                    notificationPanel.classList.remove('show');
                }
            }
        });

        /* Add logout button handler */
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('authenticated');
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('walletAddress');
                window.location.href = "../Login/Login.html";
            });
        }
    }

    /**
     * Initialize notification panel
     */
    initNotifications() {
        /* Create notification panel if it doesn't exist */
        if (!document.getElementById('notificationPanel')) {
            const panel = document.createElement('div');
            panel.id = 'notificationPanel';
            panel.className = 'notification-panel';
            panel.style.position = 'absolute';
            panel.style.top = 'calc(var(--header-height) + 5px)';
            panel.style.right = '20px';
            panel.style.width = '320px';
            panel.style.maxHeight = '400px';
            panel.style.overflowY = 'auto';
            panel.style.background = 'var(--bg-card)';
            panel.style.borderRadius = 'var(--card-border-radius)';
            panel.style.boxShadow = 'var(--box-shadow)';
            panel.style.border = '1px solid var(--border-color)';
            panel.style.zIndex = '100';
            panel.style.display = 'none';
            panel.style.transition = 'all 0.3s ease';
            panel.style.transform = 'translateY(-10px)';
            panel.style.opacity = '0';

            const header = document.createElement('div');
            header.className = 'notification-header';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.padding = '15px';
            header.style.borderBottom = '1px solid var(--border-color)';
            header.innerHTML = `
                <h3 style="margin: 0; font-size: 16px;">Notifications</h3>
                <button id="markAllRead" style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 13px;">
                    Mark all as read
                </button>
            `;

            const content = document.createElement('div');
            content.className = 'notification-content';

            panel.appendChild(header);
            panel.appendChild(content);

            document.querySelector('.top-bar').appendChild(panel);

            /* Add event listener to mark all as read */
            document.getElementById('markAllRead').addEventListener('click', (e) => {
                e.stopPropagation();
                this.markAllNotificationsRead();
            });
        }

        /* Update notifications */
        this.updateNotificationPanel();
    }

    /**
     * Toggle notification panel visibility
     */
    toggleNotifications() {
        const panel = document.getElementById('notificationPanel');
        if (panel.style.display === 'none' || !panel.classList.contains('show')) {
            panel.style.display = 'block';
            setTimeout(() => {
                panel.classList.add('show');
                panel.style.transform = 'translateY(0)';
                panel.style.opacity = '1';
            }, 10);
        } else {
            panel.classList.remove('show');
            panel.style.transform = 'translateY(-10px)';
            panel.style.opacity = '0';
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Mark all notifications as read
     */
    markAllNotificationsRead() {
        this.notifications.forEach(notification => {
            notification.isRead = true;
        });

        this.updateNotificationPanel();
        this.updateNotificationBadge();
    }

    /**
     * Mark a specific notification as read
     */
    markNotificationRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.isRead = true;
            this.updateNotificationPanel();
            this.updateNotificationBadge();
        }
    }

    /**
     * Update notification badge count
     */
    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        const badge = document.querySelector('.notification-badge');

        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    /**
     * Update notification panel content
     */
    updateNotificationPanel() {
        const content = document.querySelector('.notification-content');
        if (!content) return;

        content.innerHTML = '';

        if (this.notifications.length === 0) {
            content.innerHTML = `
                <div style="padding: 20px; text-align: center; color: var(--text-secondary);">
                    <i class="fas fa-bell-slash" style="font-size: 24px; margin-bottom: 10px;"></i>
                    <p>No notifications</p>
                </div>
            `;
            return;
        }

        this.notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.isRead ? 'read' : 'unread'}`;
            item.style.padding = '15px';
            item.style.borderBottom = '1px solid var(--border-color)';
            item.style.cursor = 'pointer';
            item.style.transition = 'background-color 0.2s ease';
            item.style.position = 'relative';
            item.style.backgroundColor = notification.isRead ? 'transparent' : 'rgba(109, 86, 193, 0.1)';

            let iconClass = 'fa-bell';
            let iconColor = 'var(--primary)';

            if (notification.type === 'alert') {
                iconClass = 'fa-exclamation-circle';
                iconColor = 'var(--warning)';
            } else if (notification.type === 'security') {
                iconClass = 'fa-shield-alt';
                iconColor = 'var(--error)';
            } else if (notification.type === 'transaction') {
                iconClass = 'fa-exchange-alt';
                iconColor = 'var(--success)';
            }

            item.innerHTML = `
                <div style="display: flex; align-items: flex-start;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background-color: ${notification.isRead ? 'var(--bg-elevated)' : iconColor + '20'}; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                        <i class="fas ${iconClass}" style="color: ${iconColor};"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">${notification.title}</div>
                        <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">${notification.message}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${notification.time}</div>
                    </div>
                    ${!notification.isRead ? `
                        <div class="unread-indicator" style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--primary); position: absolute; top: 15px; right: 15px;"></div>
                    ` : ''}
                </div>
            `;

            item.addEventListener('click', () => this.markNotificationRead(notification.id));
            content.appendChild(item);
        });

        this.updateNotificationBadge();
    }

    /**
     * Initialize accent color selector in settings
     */
    initAccentColors() {
        const accentColors = [
            { name: 'Stellar Blue', value: '#149ED9' },
            { name: 'Purple', value: '#6D56C1' },
            { name: 'Teal', value: '#00B8D4' },
            { name: 'Green', value: '#00A651' },
            { name: 'Orange', value: '#FF9900' },
            { name: 'Pink', value: '#E91E63' }
        ];

        /** Create the settings item for accent colors */
        const settingsContainer = document.querySelector('.settings-list');

        if (settingsContainer) {
            const accentItem = document.createElement('div');
            accentItem.className = 'settings-item';

            const settingInfo = document.createElement('div');
            settingInfo.className = 'setting-info';

            const accentTitle = document.createElement('h4');
            accentTitle.textContent = 'Accent Color';

            const accentDesc = document.createElement('p');
            accentDesc.textContent = 'Choose your preferred accent color';

            settingInfo.appendChild(accentTitle);
            settingInfo.appendChild(accentDesc);

            const colorHBox = document.createElement('div');
            colorHBox.className = 'accent-colors-container';
            colorHBox.style.display = 'flex';
            colorHBox.style.flexDirection = 'row';
            colorHBox.style.flexWrap = 'wrap';
            colorHBox.style.gap = '10px';

            accentColors.forEach(color => {
                const colorOption = document.createElement('div');
                colorOption.className = 'accent-color-option';
                colorOption.dataset.color = color.value;
                colorOption.style.width = '30px';
                colorOption.style.height = '30px';
                colorOption.style.borderRadius = '50%';
                colorOption.style.backgroundColor = color.value;
                colorOption.style.cursor = 'pointer';
                colorOption.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                colorOption.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                colorOption.style.border = this.accentColor === color.value ? '2px solid white' : '2px solid transparent';
                colorOption.title = color.name;

                colorOption.addEventListener('click', () => {
                    this.setAccentColor(color.value);
                    document.querySelectorAll('.accent-color-option').forEach(opt => {
                        opt.style.border = '2px solid transparent';
                    });
                    colorOption.style.border = '2px solid white';
                });

                colorOption.addEventListener('mouseover', () => {
                    colorOption.style.transform = 'scale(1.1)';
                    colorOption.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                });

                colorOption.addEventListener('mouseout', () => {
                    colorOption.style.transform = 'scale(1)';
                    colorOption.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                });

                colorHBox.appendChild(colorOption);
            });

            accentItem.appendChild(settingInfo);
            accentItem.appendChild(colorHBox);

            /** Insert after first setting item (theme toggle) */
            if (settingsContainer.firstChild) {
                settingsContainer.insertBefore(accentItem, settingsContainer.firstChild.nextSibling);
            } else {
                settingsContainer.appendChild(accentItem);
            }
        }

        /** Apply the initial accent color */
        this.setAccentColor(this.accentColor, false);
    }

    /**
     * Set accent color for the UI
     * @param {string} color - Hex color code for the accent color
     * @param {boolean} updateSelector - Whether to update the selector UI
     */
    setAccentColor(color, updateSelector = true) {
        this.accentColor = color;
        localStorage.setItem('accentColor', color);

        /** Create a style element to override CSS variables */
        let styleEl = document.getElementById('accent-color-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'accent-color-style';
            document.head.appendChild(styleEl);
        }

        /** Calculate lighter and darker versions of the accent color */
        const lighterColor = this.lightenDarkenColor(color, 20);
        const darkerColor = this.lightenDarkenColor(color, -20);

        /** Update the CSS variables for both dark and light themes */
        styleEl.textContent = `
            :root {
                --primary: ${color};
                --primary-light: ${lighterColor};
                --primary-dark: ${darkerColor};
                --accent: ${color};
                --chart-1: ${color};
                --chart-2: ${lighterColor};
                --chart-3: ${this.lightenDarkenColor(color, 30)};
                --chart-4: ${this.lightenDarkenColor(color, 40)};
                --chart-5: ${darkerColor};
                --primary-glow: ${color}40;
            }
            
            :root.light-theme {
                --primary: ${color};
                --primary-light: ${lighterColor};
                --primary-dark: ${darkerColor};
                --accent: ${color};
                --chart-1: ${color};
                --chart-2: ${lighterColor};
                --chart-3: ${this.lightenDarkenColor(color, 30)};
                --chart-4: ${this.lightenDarkenColor(color, 40)};
                --chart-5: ${darkerColor};
                --primary-glow: ${color}40;
            }
        `;

        /** Update charts with new colors */
        this.updateChartColors();

        /** Update selected color in UI */
        if (updateSelector) {
            document.querySelectorAll('.accent-color-option').forEach(opt => {
                opt.style.border = opt.dataset.color === color ? '2px solid white' : '2px solid transparent';
            });
        }

        /** Update logo color */
        const logoSpan = document.querySelector('.logo h1 span');
        if (logoSpan) {
            logoSpan.style.color = color;
        }

        const logoIcon = document.querySelector('.logo i');
        if (logoIcon) {
            logoIcon.style.color = color;
        }
    }

    /**
     * Lighten or darken a color
     * @param {string} color - Hex color code
     * @param {number} amount - Amount to lighten (positive) or darken (negative)
     * @returns {string} - New hex color
     */
    lightenDarkenColor(color, amount) {
        let usePound = false;

        if (color[0] === "#") {
            color = color.slice(1);
            usePound = true;
        }

        let num = parseInt(color, 16);

        let r = (num >> 16) + amount;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        let g = ((num >> 8) & 0x00FF) + amount;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        let b = (num & 0x0000FF) + amount;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    }

    /**
     * Update chart colors based on the current accent color
     */
    updateChartColors() {
        if (this.charts.portfolio) {
            this.charts.portfolio.data.datasets[0].backgroundColor = `${this.accentColor}33`;
            this.charts.portfolio.data.datasets[0].borderColor = this.accentColor;
            this.charts.portfolio.data.datasets[0].pointBackgroundColor = this.accentColor;
            this.charts.portfolio.update();
        }

        if (this.charts.portfolioGrowth) {
            this.charts.portfolioGrowth.data.datasets[0].backgroundColor = `${this.accentColor}33`;
            this.charts.portfolioGrowth.data.datasets[0].borderColor = this.accentColor;
            this.charts.portfolioGrowth.data.datasets[0].pointBackgroundColor = this.accentColor;
            this.charts.portfolioGrowth.update();
        }

        if (this.charts.assetDistribution) {
            const lighterColor = this.lightenDarkenColor(this.accentColor, 20);
            const darkerColor = this.lightenDarkenColor(this.accentColor, -20);

            this.charts.assetDistribution.data.datasets[0].backgroundColor = [
                this.accentColor,
                this.lightenDarkenColor(this.accentColor, 20),
                this.lightenDarkenColor(this.accentColor, 30),
                this.lightenDarkenColor(this.accentColor, 40),
                darkerColor
            ];
            this.charts.assetDistribution.update();

            /** Update legend colors */
            const legendItems = document.querySelectorAll('.legend-color');
            for (let i = 0; i < legendItems.length; i++) {
                if (i < 5) {
                    legendItems[i].style.backgroundColor = this.charts.assetDistribution.data.datasets[0].backgroundColor[i];
                }
            }
        }
    }

    /**
     * Format date for display
     */
    formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Switch between dashboard sections with animation
     */
    switchSection(section) {
        if (section === this.currentSection) return;

        /* Fade out current section */
        const currentSectionEl = document.getElementById(this.currentSection);
        currentSectionEl.style.animation = 'fadeOut 0.3s ease forwards';

        /* Update navigation */
        document.querySelector(`.sidebar-nav li.active`).classList.remove('active');
        document.querySelector(`.sidebar-nav a[data-section="${section}"]`).parentElement.classList.add('active');

        /* After animation finishes, switch sections */
        setTimeout(() => {
            document.querySelectorAll('.dashboard-section').forEach(el => {
                el.classList.remove('active');
                el.style.animation = '';
            });

            const newSectionEl = document.getElementById(section);
            newSectionEl.classList.add('active');
            newSectionEl.style.animation = 'fadeIn 0.5s ease forwards';

            this.currentSection = section;

            /* Re-render charts if needed */
            if (section === 'portfolio' && this.charts.portfolioGrowth) {
                this.charts.portfolioGrowth.update();
                this.charts.assetDistribution.update();
            }
        }, 300);
    }

    /**
     * Toggle dark/light mode
     */
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.getElementById('themeToggle').checked = this.darkMode;
        this.applyTheme();

        /* Update theme icon */
        const sunIcon = document.querySelector('#darkModeToggle .fa-sun');
        const moonIcon = document.querySelector('#darkModeToggle .fa-moon');

        if (this.darkMode) {
            sunIcon.style.display = 'inline-block';
            moonIcon.style.display = 'none';
            sunIcon.style.animation = 'spin 0.5s ease';
            setTimeout(() => {
                sunIcon.style.animation = '';
            }, 500);
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block';
            moonIcon.style.animation = 'spin 0.5s ease';
            setTimeout(() => {
                moonIcon.style.animation = '';
            }, 500);
        }
    }

    /**
     * Apply theme to the UI
     */
    applyTheme() {
        /* Toggle light-theme class on body and root */
        if (this.darkMode) {
            document.documentElement.classList.remove('light-theme');
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');

            /* Reset any light theme specific styles */
            this.removeLightModeStyles();
        } else {
            document.documentElement.classList.add('light-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');

            /* Apply light theme specific styles */
            this.applyLightModeStyles();
        }

        /* Update text in settings */
        const firstSettingItem = document.querySelector('.settings-item:first-child p');
        if (firstSettingItem) {
            firstSettingItem.textContent = this.darkMode ? 'Dark mode' : 'Light mode';
        }

        /* Update charts */
        Chart.defaults.color = this.darkMode ? 'rgba(224, 224, 224, 0.8)' : 'rgba(51, 51, 51, 0.8)';
        Chart.defaults.borderColor = this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.options.plugins.legend.labels.color = this.darkMode ? 'rgba(224, 224, 224, 0.8)' : '#333333';
                if (chart.options.plugins.tooltip) {
                    chart.options.plugins.tooltip.backgroundColor = this.darkMode ? '#1e1e1e' : '#ffffff';
                    chart.options.plugins.tooltip.titleColor = this.darkMode ? '#e0e0e0' : '#333333';
                    chart.options.plugins.tooltip.bodyColor = this.darkMode ? '#e0e0e0' : '#333333';
                    chart.options.plugins.tooltip.borderColor = this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                }
                chart.update();
            }
        });
    }

    /**
     * Apply specific styling improvements for light mode
     */
    applyLightModeStyles() {
        /* Create or update light mode style element */
        let lightStyleEl = document.getElementById('light-mode-enhancements');
        if (!lightStyleEl) {
            lightStyleEl = document.createElement('style');
            lightStyleEl.id = 'light-mode-enhancements';
            document.head.appendChild(lightStyleEl);
        }

        lightStyleEl.textContent = `
            /* Improve text contrast */
            body.light-theme {
                color: #333333;
            }
            
            /* Fix theme toggle icon colors */
            body.light-theme #darkModeToggle .fa-sun {
                color: #333333;
            }
            
            body.light-theme #darkModeToggle .fa-moon {
                color: #333333;
            }
            
            /* Improve card shadows for light mode */
            body.light-theme .card,
            body.light-theme .market-stat-card {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                border: 1px solid rgba(0, 0, 0, 0.08);
            }
            
            /* Better gradient for light mode balance summary */
            body.light-theme .balance-summary {
                background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
                border: 1px solid rgba(0, 0, 0, 0.05);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            
            /* Update chart grid colors for light mode */
            body.light-theme .chart-js-render-monitor {
                filter: invert(0) !important;
            }
            
            /* Better table row hover for light mode */
            body.light-theme tbody tr:hover {
                background-color: rgba(0, 0, 0, 0.03) !important;
            }
            
            /* Improve action button styling */
            body.light-theme .action-btn {
                color: #555555;
            }
            
            body.light-theme .action-btn:hover {
                color: var(--primary);
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            /* Improve form inputs for light mode */
            body.light-theme input, 
            body.light-theme select,
            body.light-theme textarea {
                border-color: rgba(0, 0, 0, 0.15);
                color: #333333;
            }
            
            /* Improve sidebar for light mode */
            body.light-theme .sidebar {
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
            }
            
            /* Update button styles for light mode */
            body.light-theme .btn.primary-btn {
                box-shadow: 0 4px 10px rgba(109, 86, 193, 0.25);
            }
            
            /* Menu items in light mode */
            body.light-theme .sidebar-nav a {
                color: #555555;
            }
            
            body.light-theme .sidebar-nav li.active a {
                color: var(--primary);
                font-weight: 600;
            }
            
            /* Transaction icons in light mode */
            body.light-theme .transaction-icon,
            body.light-theme .market-coin-icon {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            /* Update notification styles for light mode */
            body.light-theme #notificationPanel {
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }
            
            /* Fix top action buttons in light mode */
            body.light-theme .top-actions .action-btn {
                background-color: rgba(0, 0, 0, 0.05);
                color: #333333;
            }
            
            body.light-theme .top-actions .action-btn:hover {
                background-color: rgba(109, 86, 193, 0.1);
                color: var(--primary);
            }
            
            /* Demo mode banner */
            body.light-theme .demo-mode-banner {
                background-color: rgba(255, 153, 0, 0.1);
                border-color: rgba(255, 153, 0, 0.3);
            }
        `;

        /* Fix specific elements with JS for light mode */
        const sunIcon = document.querySelector('#darkModeToggle .fa-sun');
        if (sunIcon) {
            sunIcon.style.color = '#333333';
        }

        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.style.color = '#555555';
        });

        /* Update search bar for light mode */
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.style.backgroundColor = '#ffffff';
            searchBar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            searchBar.style.border = '1px solid rgba(0, 0, 0, 0.08)';
        }
    }

    /**
     * Remove light mode specific styling
     */
    removeLightModeStyles() {
        /* Remove light mode style element if it exists */
        const lightStyleEl = document.getElementById('light-mode-enhancements');
        if (lightStyleEl) {
            lightStyleEl.textContent = '';
        }

        /* Reset any element styles set by JS */
        const sunIcon = document.querySelector('#darkModeToggle .fa-sun');
        if (sunIcon) {
            sunIcon.style.color = '';
        }

        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.style.color = '';
        });

        /* Reset search bar styles */
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.style.backgroundColor = '';
            searchBar.style.boxShadow = '';
            searchBar.style.border = '';
        }
    }

    /**
     * Initialize all charts
     */
    initCharts() {
        /* Overview portfolio chart */
        const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
        this.charts.portfolio = new Chart(portfolioCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'XLM Holdings Value',
                    data: [8500, 9200, 10800, 12500, 11200, 14527],
                    backgroundColor: 'rgba(20, 158, 217, 0.2)',
                    borderColor: '#149ED9',
                    borderWidth: 2,
                    pointBackgroundColor: '#149ED9',
                    pointRadius: 4,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#e0e0e0',
                        bodyColor: '#e0e0e0',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });

        /* Portfolio growth chart */
        const growthCtx = document.getElementById('portfolioGrowthChart').getContext('2d');
        this.charts.portfolioGrowth = new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => i + 1),
                datasets: [{
                    label: 'XLM Value',
                    data: this.generateChartData(30, 10000, 15000),
                    backgroundColor: 'rgba(20, 158, 217, 0.2)',
                    borderColor: '#149ED9',
                    borderWidth: 2,
                    pointBackgroundColor: '#149ED9',
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });

        /* Asset distribution chart */
        const distributionCtx = document.getElementById('assetDistributionChart').getContext('2d');
        this.charts.assetDistribution = new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['XLM', 'yXLM', 'USDC', 'StellarX Token', 'AQUA'],
                datasets: [{
                    data: [45, 20, 15, 12, 8],
                    backgroundColor: [
                        '#149ED9', /* XLM blue color */
                        '#6EB6DD',
                        '#4CD6EE',
                        '#92CBDF',
                        '#3E7CB1'
                    ],
                    borderColor: 'rgba(0, 0, 0, 0)',
                    borderWidth: 2,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });

        /* Create legend items */
        const legendContainer = document.getElementById('distributionLegend');
        if (legendContainer) {
            legendContainer.innerHTML = '';
            const chartData = this.charts.assetDistribution.data;
            for (let i = 0; i < chartData.labels.length; i++) {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';

                const colorBox = document.createElement('span');
                colorBox.className = 'legend-color';
                colorBox.style.backgroundColor = chartData.datasets[0].backgroundColor[i];

                const label = document.createElement('span');
                label.textContent = `${chartData.labels[i]} (${chartData.datasets[0].data[i]}%)`;

                legendItem.appendChild(colorBox);
                legendItem.appendChild(label);
                legendContainer.appendChild(legendItem);
            }
        }
    }

    /**
     * Generate random chart data with trend
     */
    generateChartData(points, min, max) {
        const data = [];
        let value = min + Math.random() * (max - min) / 2;

        for (let i = 0; i < points; i++) {
            /* Create a general upward trend with random fluctuations */
            const change = Math.random() * 500 - 150;
            value = Math.max(min, Math.min(max, value + change));
            data.push(value);
        }

        return data;
    }

    /**
     * Filter Stellar operations by type
     */
    filterStellarOperations(type) {
        const allItems = document.querySelectorAll('.transaction-item');
        if (type === 'all') {
            allItems.forEach(item => item.style.display = 'flex');
        } else {
            allItems.forEach(item => {
                if (item.classList.contains(type)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    }

    /**
     * Update chart data based on selected time range
     */
    updateChartData(timeRange) {
        let points = 30;
        let min = 10000;
        let max = 15000;

        switch(timeRange) {
            case '1w':
                points = 7;
                min = 12000;
                max = 15000;
                break;
            case '1m':
                points = 30;
                min = 10000;
                max = 15000;
                break;
            case '3m':
                points = 90;
                min = 9000;
                max = 15000;
                break;
            case '1y':
                points = 365;
                min = 8000;
                max = 15000;
                break;
            case 'all':
                points = 730;
                min = 5000;
                max = 15000;
                break;
        }

        const newData = this.generateChartData(points, min, max);
        this.charts.portfolioGrowth.data.labels = Array.from({length: points}, (_, i) => i + 1);
        this.charts.portfolioGrowth.data.datasets[0].data = newData;
        this.charts.portfolioGrowth.update();
    }

    /**
     * Load Stellar-specific data for UI elements
     */
    loadStellarData() {
        /** Set timestamp with current date/time */
        document.getElementById('timestamp').textContent = '2025-05-16 14:10:21 UTC';

        /** Set current user from authentication data */
        const username = this.userData.username || 'Guest';
        document.getElementById('currentUser').textContent = username;

        /* If it's a demo account, add a visual indicator */
        if (this.isDemoAccount) {
            this.addDemoModeBanner();
        }

        /* Set profile initials */
        const initials = this.getInitials(username);
        const userInitials = document.getElementById('userInitial');
        const profileInitial = document.getElementById('profileInitial');
        if (userInitials && profileInitial) {
            userInitials.textContent = initials;
            profileInitial.textContent = initials;
        }

        /* Set user display information */
        const userDisplayName = document.getElementById('userDisplayName');
        const userEmail = document.getElementById('userEmail');
        if (userDisplayName && userEmail) {
            userDisplayName.textContent = username;
            // Email could be fetched from additional user data if available
            userEmail.textContent = `${username.toLowerCase()}@stellar.org`;
        }

        /* Display wallet address if available */
        const walletAddress = this.userData.walletAddress;
        if (walletAddress) {
            // Find elements to display wallet address if they exist
            const walletAddressElements = document.querySelectorAll('.wallet-address');
            walletAddressElements.forEach(element => {
                element.textContent = this.formatWalletAddress(walletAddress);
            });
        }

        /* Set wallet balance if connected to real API or use demo data */
        if (!this.isDemoAccount) {
            this.fetchWalletData()
                .then(data => {
                    this.updateWalletUI(data);
                })
                .catch(error => {
                    console.error('Error fetching wallet data:', error);
                    this.loadDemoWalletData();
                });
        } else {
            this.loadDemoWalletData();
        }

        /* Clear and update transaction list */
        const transactionsList = document.getElementById('recentTransactionsList');
        if (transactionsList) {
            transactionsList.innerHTML = '';
        }

        /* Clear market overview list */
        const marketList = document.getElementById('marketOverviewList');
        if (marketList) {
            marketList.innerHTML = '';
        }

        /* Load transaction history and market data */
        this.loadTransactionHistory();
        this.loadMarketOverview();
        this.populateStellarAssetsTable();
    }

    /**
     * Add a banner indicating demo mode
     */
    addDemoModeBanner() {
        // Check if banner already exists
        if (document.querySelector('.demo-mode-banner')) {
            return;
        }

        // Find a good location for the banner
        const container = document.querySelector('.dashboard-section.active') || document.body;

        // Create demo banner
        const banner = document.createElement('div');
        banner.className = 'demo-mode-banner';
        banner.style.backgroundColor = 'rgba(255, 153, 0, 0.1)';
        banner.style.border = '1px solid rgba(255, 153, 0, 0.3)';
        banner.style.borderRadius = '8px';
        banner.style.padding = '12px 16px';
        banner.style.marginBottom = '20px';
        banner.style.display = 'flex';
        banner.style.alignItems = 'center';
        banner.style.justifyContent = 'space-between';

        banner.innerHTML = `
            <div style="display: flex; align-items: center;">
                <i class="fas fa-info-circle" style="color: #FF9900; font-size: 18px; margin-right: 12px;"></i>
                <div>
                    <div style="font-weight: 500; margin-bottom: 4px;">Demo Account Mode</div>
                    <div style="font-size: 13px; opacity: 0.8;">
                        You're viewing sample data. <a href="#" style="color: var(--primary);">Learn more</a>
                    </div>
                </div>
            </div>
            <button id="createRealAccount" class="btn primary-btn" style="font-size: 14px; padding: 8px 16px;">
                Create Real Account
            </button>
        `;

        // Insert at the beginning of the active section
        const firstChild = container.firstChild;
        if (firstChild) {
            container.insertBefore(banner, firstChild);
        } else {
            container.appendChild(banner);
        }

        // Add event listener for the button
        document.getElementById('createRealAccount').addEventListener('click', () => {
            alert('This would redirect to account creation flow in a real application.');
        });
    }

    /**
     * Load transaction history for display
     */
    loadTransactionHistory() {
        const stellarOperations = [
            {
                type: 'receive',
                title: 'Received XLM',
                date: '16 May, 10:15',
                amount: '+250 XLM',
                fiat: '+$87.50',
                icon: 'fa-star'
            },
            {
                type: 'send',
                title: 'Sent XLM',
                date: '14 May, 09:15',
                amount: '-500 XLM',
                fiat: '-$175.00',
                icon: 'fa-paper-plane'
            },
            {
                type: 'swap',
                title: 'Swap XLM to USDC',
                date: '12 May, 18:22',
                amount: '300 XLM → 105 USDC',
                fiat: '$105.00',
                icon: 'fa-exchange-alt'
            },
            {
                type: 'trust',
                title: 'Created Trust Line',
                date: '10 May, 11:04',
                amount: 'AQUA Trust Line',
                fiat: 'Asset from ultrastellar.com',
                icon: 'fa-link'
            },
            {
                type: 'receive',
                title: 'Received AQUA',
                date: '10 May, 12:30',
                amount: '+1,500 AQUA',
                fiat: '+$22.50',
                icon: 'fa-star'
            }
        ];

        // Add username to transaction titles if it's a demo account 
        if (this.isDemoAccount) {
            const username = this.userData.username;
            stellarOperations[0].title = `Received XLM from StellarX`;
            stellarOperations[1].title = `Sent XLM to ${username === 'john' ? 'jim' : 'john'}`;
        }

        const transactionsList = document.getElementById('recentTransactionsList');
        if (!transactionsList) return;

        transactionsList.innerHTML = '';

        stellarOperations.forEach(op => {
            const li = document.createElement('li');
            li.className = `transaction-item ${op.type}`;

            li.innerHTML = `
                <div class="transaction-icon ${op.type}">
                    <i class="fas ${op.icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${op.title}</div>
                    <div class="transaction-date">${op.date}</div>
                </div>
                <div class="transaction-amount ${op.type === 'receive' ? 'positive' : op.type === 'send' ? 'negative' : ''}">
                    ${op.amount}<br>
                    <small>${op.fiat}</small>
                </div>
            `;

            /* Add subtle entrance animation */
            li.style.opacity = '0';
            li.style.transform = 'translateY(10px)';

            transactionsList.appendChild(li);

            /* Staggered animation */
            setTimeout(() => {
                li.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                li.style.opacity = '1';
                li.style.transform = 'translateY(0)';
            }, stellarOperations.indexOf(op) * 150);
        });
    }

    /**
     * Load market overview data
     */
    loadMarketOverview() {
        const stellarAssets = [
            { name: 'Stellar Lumens', symbol: 'XLM', price: '$0.35', change: '+2.4%', changeType: 'positive' },
            { name: 'Yield XLM', symbol: 'yXLM', price: '$0.37', change: '+3.7%', changeType: 'positive' },
            { name: 'USD Coin', symbol: 'USDC', price: '$1.00', change: '0.0%', changeType: 'neutral' },
            { name: 'AQUA', symbol: 'AQUA', price: '$0.015', change: '-1.2%', changeType: 'negative' }
        ];

        const marketList = document.getElementById('marketOverviewList');
        if (!marketList) return;

        marketList.innerHTML = '';

        stellarAssets.forEach(item => {
            const div = document.createElement('div');
            div.className = 'market-item';

            let iconHtml;
            if (item.symbol === 'XLM') {
                iconHtml = '<i class="fas fa-star"></i>';
            } else if (item.symbol === 'yXLM') {
                iconHtml = '<i class="fas fa-star-half-alt"></i>';
            } else if (item.symbol === 'USDC') {
                iconHtml = '<i class="fas fa-dollar-sign"></i>';
            } else {
                iconHtml = '<i class="fas fa-water"></i>';
            }

            div.innerHTML = `
                <div class="market-coin-icon">
                    ${iconHtml}
                </div>
                <div class="market-coin-details">
                    <div class="market-coin-name">${item.name}</div>
                    <div class="market-coin-symbol">${item.symbol}</div>
                </div>
                <div class="market-coin-price">${item.price}</div>
                <div class="market-coin-change ${item.changeType}">${item.change}</div>
            `;

            /* Add subtle entrance animation */
            div.style.opacity = '0';
            div.style.transform = 'translateY(10px)';

            marketList.appendChild(div);

            /* Staggered animation */
            setTimeout(() => {
                div.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                div.style.opacity = '1';
                div.style.transform = 'translateY(0)';
            }, stellarAssets.indexOf(item) * 150);
        });
    }

    /**
     * Get initials from username
     * @param {string} name - Username
     * @returns {string} Initials (up to 2 characters)
     */
    getInitials(name) {
        if (!name) return 'U';

        // Split by spaces, underscores, hyphens, or camelCase
        const parts = name.split(/[\s_-]+|(?=[A-Z])/).filter(part => part.length > 0);

        if (parts.length === 1) {
            // If single word, use first two characters
            return parts[0].substring(0, 2).toUpperCase();
        } else {
            // Otherwise use first character of first two parts
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
    }

    /**
     * Format wallet address for display (first 6 + last 4 chars)
     * @param {string} address - Full wallet address
     * @returns {string} Formatted address
     */
    formatWalletAddress(address) {
        if (!address || address.length < 10) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    /**
     * Fetch wallet data from API
     * @returns {Promise<object>} Wallet data
     */
    async fetchWalletData() {
        if (!this.userData.walletAddress) {
            throw new Error('No wallet address available');
        }

        try {
            const apiBaseUrl = 'http://localhost:8081/api';
            const response = await fetch(`${apiBaseUrl}/wallet/balance/${this.userData.walletAddress}`);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            throw error;
        }
    }

    /**
     * Update UI with wallet data
     * @param {object} data - Wallet data from API
     */
    updateWalletUI(data) {
        // Update balance display
        const balanceElement = document.querySelector('.balance');
        if (balanceElement && data.balance) {
            balanceElement.textContent = `${parseFloat(data.balance).toLocaleString()} XLM`;
        }

        // Update balance value in fiat
        const balanceValueElement = document.querySelector('.balance-value');
        if (balanceValueElement && data.balanceInFiat) {
            balanceValueElement.textContent = `$${parseFloat(data.balanceInFiat).toLocaleString()}`;
        }

        // Update charts if data contains historical values
        if (data.history && this.charts.portfolio) {
            this.updateChartWithRealData(this.charts.portfolio, data.history);
        }

        // Update asset table if data contains assets
        if (data.assets) {
            this.updateAssetsTable(data.assets);
        }
    }

    /**
     * Load demo wallet data when API is unavailable
     */
    loadDemoWalletData() {
        console.log("Loading demo wallet data");

        /* Demo balance data */
        const username = this.userData.username || 'Guest';
        const balanceAmount = username === 'john' ? 12584.35 : 15927.80;
        const balanceValue = balanceAmount * 0.35; /* XLM price $0.35 */

        /* Update balance display */
        const balanceElement = document.querySelector('.balance');
        if (balanceElement) {
            balanceElement.textContent = `${balanceAmount.toLocaleString()} XLM`;
        }

        /* Update balance value in fiat */
        const balanceValueElement = document.querySelector('.balance-value');
        if (balanceValueElement) {
            balanceValueElement.textContent = `$${balanceValue.toLocaleString()}`;
        }

        /* Demo assets for table */
        const demoAssets = [
            {
                name: 'Stellar Lumens',
                symbol: 'XLM',
                balance: username === 'john' ? '12,584.35' : '15,927.80',
                price: '$0.35',
                value: username === 'john' ? '$4,404.52' : '$5,574.73',
                change24h: '+2.4%'
            },
            {
                name: 'Yield XLM',
                symbol: 'yXLM',
                balance: username === 'john' ? '5,250.00' : '12,500.00',
                price: '$0.37',
                value: username === 'john' ? '$1,942.50' : '$4,625.00',
                change24h: '+3.7%'
            },
            {
                name: 'USD Coin',
                symbol: 'USDC',
                balance: username === 'john' ? '1,200.00' : '3,200.00',
                price: '$1.00',
                value: username === 'john' ? '$1,200.00' : '$3,200.00',
                change24h: '0.0%'
            },
            {
                name: 'AQUA',
                symbol: 'AQUA',
                balance: username === 'john' ? '75,000.00' : '125,000.00',
                price: '$0.015',
                value: username === 'john' ? '$1,125.00' : '$1,875.00',
                change24h: '-1.2%'
            },
            {
                name: 'StellarX Token',
                symbol: 'StellarX',
                balance: username === 'john' ? '650.00' : '850.00',
                price: '$2.50',
                value: username === 'john' ? '$1,625.00' : '$2,125.00',
                change24h: '+1.8%'
            }
        ];

        /* Update the assets table with demo data */
        this.updateAssetsTable(demoAssets);
    }

    /**
     * Populate Stellar assets table with default data
     */
    populateStellarAssetsTable() {
        const assetsTable = document.getElementById('assetsTableBody');
        if (!assetsTable) return;

        /* Clear table first */
        assetsTable.innerHTML = '';

        const stellarAssets = [
            {
                name: 'Stellar Lumens',
                symbol: 'XLM',
                balance: '45,285.00',
                price: '$0.35',
                value: '$15,849.75',
                change24h: '+2.4%',
                changeType: 'positive',
                icon: 'fa-star'
            },
            {
                name: 'Yield XLM',
                symbol: 'yXLM',
                balance: '12,500.00',
                price: '$0.37',
                value: '$4,625.00',
                change24h: '+3.7%',
                changeType: 'positive',
                icon: 'fa-star-half-alt'
            },
            {
                name: 'USD Coin',
                symbol: 'USDC',
                balance: '3,200.00',
                price: '$1.00',
                value: '$3,200.00',
                change24h: '0.0%',
                changeType: 'neutral',
                icon: 'fa-dollar-sign'
            },
            {
                name: 'AQUA',
                symbol: 'AQUA',
                balance: '125,000.00',
                price: '$0.015',
                value: '$1,875.00',
                change24h: '-1.2%',
                changeType: 'negative',
                icon: 'fa-water'
            },
            {
                name: 'StellarX Token',
                symbol: 'StellarX',
                balance: '850.00',
                price: '$2.50',
                value: '$2,125.00',
                change24h: '+1.8%',
                changeType: 'positive',
                icon: 'fa-star'
            }
        ];

        stellarAssets.forEach(asset => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>
                    <div class="asset-name">
                        <div class="market-coin-icon">
                            <i class="fas ${asset.icon}"></i>
                        </div>
                        <div class="asset-info">
                            <div class="name">${asset.name}</div>
                            <div class="symbol">${asset.symbol}</div>
                        </div>
                    </div>
                </td>
                <td>${asset.balance}</td>
                <td>${asset.price}</td>
                <td>${asset.value}</td>
                <td class="${asset.changeType}">${asset.change24h}</td>
                <td>
                    <div class="asset-actions">
                        <button class="asset-btn">Send</button>
                        <button class="asset-btn">Swap</button>
                    </div>
                </td>
            `;

            assetsTable.appendChild(row);
        });
    }

    /**
     * Update assets table with data from API or demo data
     * @param {Array} assets - Asset data
     */
    updateAssetsTable(assets) {
        const assetsTable = document.getElementById('assetsTableBody');
        if (!assetsTable) return;

        /* Clear existing rows */
        assetsTable.innerHTML = '';

        assets.forEach(asset => {
            const row = document.createElement('tr');

            /* Determine icon based on asset symbol */
            let icon = 'fa-star';
            if (asset.symbol === 'yXLM') icon = 'fa-star-half-alt';
            else if (asset.symbol === 'USDC') icon = 'fa-dollar-sign';
            else if (asset.symbol === 'AQUA') icon = 'fa-water';

            /* Determine change class */
            let changeType = 'neutral';
            if (asset.change24h && asset.change24h.startsWith('+')) {
                changeType = 'positive';
            } else if (asset.change24h && asset.change24h.startsWith('-')) {
                changeType = 'negative';
            }

            row.innerHTML = `
                <td>
                    <div class="asset-name">
                        <div class="market-coin-icon">
                            <i class="fas ${icon}"></i>
                        </div>
                        <div class="asset-info">
                            <div class="name">${asset.name}</div>
                            <div class="symbol">${asset.symbol}</div>
                        </div>
                    </div>
                </td>
                <td>${asset.balance}</td>
                <td>${asset.price}</td>
                <td>${asset.value}</td>
                <td class="${changeType}">${asset.change24h}</td>
                <td>
                    <div class="asset-actions">
                        <button class="asset-btn">Send</button>
                        <button class="asset-btn">Swap</button>
                    </div>
                </td>
            `;

            assetsTable.appendChild(row);
        });
    }

    /**
     * Update chart with real historical data
     * @param {Chart} chart - Chart.js instance
     * @param {Array} historyData - Historical data points
     */
    updateChartWithRealData(chart, historyData) {
        if (!chart || !historyData || !historyData.length) return;

        /* Extract labels and data values */
        const labels = historyData.map(item => item.date);
        const values = historyData.map(item => item.value);

        /* Update chart data */
        chart.data.labels = labels;
        chart.data.datasets[0].data = values;

        /* Update the chart */
        chart.update();
    }
}

/* Initialize dashboard when DOM is fully loaded */
document.addEventListener('DOMContentLoaded', function() {
    /* Create dashboard instance */
    const dashboard = new Dashboard();

    /* Add fade-in animations for section elements when they enter viewport */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .market-stat-card').forEach(card => {
        observer.observe(card);
    });

    /* Add Stellar logo to sidebar */
    const logo = document.querySelector('.logo h1');
    if (logo) {
        logo.innerHTML = '<span style="color:#149ED9">Stellar</span>Wallet';

        const logoIcon = document.querySelector('.logo i');
        if (logoIcon) {
            logoIcon.className = 'fas fa-star';
            logoIcon.style.color = '#149ED9';
        }
    }

    /* Update meta title */
    document.title = 'Stellar Wallet Dashboard';

    /* Add timestamp and user display if needed */
    if (!document.getElementById('timestamp')) {
        const header = document.querySelector('.top-bar-content');
        if (header) {
            const timestampElement = document.createElement('div');
            timestampElement.id = 'timestamp';
            timestampElement.className = 'timestamp';
            timestampElement.textContent = '2025-05-16 14:17:21';
            timestampElement.style.fontSize = '12px';
            timestampElement.style.opacity = '0.7';
            header.appendChild(timestampElement);
        }
    }

    if (!document.getElementById('currentUser')) {
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            const userElement = document.createElement('div');
            userElement.id = 'currentUser';
            userElement.className = 'current-user';
            userElement.textContent = 'biggiemedium';
            userElement.style.fontSize = '12px';
            userElement.style.opacity = '0.7';
            userInfo.appendChild(userElement);
        }
    }
});