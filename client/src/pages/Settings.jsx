import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';
import { UserContext } from '../UserContext';
import { MdPerson, MdTune, MdNotifications, MdPalette, MdExtension, MdViewModule, MdViewList, MdDarkMode, MdLightMode, MdNotificationsActive, MdNotificationsNone, MdSecurity, MdBackup, MdBrush } from "react-icons/md";

const tabs = [
  { key: "profile", label: "Profile", icon: <MdPerson /> },
  { key: "preferences", label: "Preferences", icon: <MdTune /> },
  { key: "notifications", label: "Notifications", icon: <MdNotifications /> },
  { key: "appearance", label: "Appearance", icon: <MdPalette /> },
  { key: "personalization", label: "Personalization", icon: <MdBrush /> },
  { key: "security", label: "Security", icon: <MdSecurity /> },
  { key: "export", label: "Export/Backup", icon: <MdBackup /> },
  { key: "integrations", label: "Integrations", icon: <MdExtension /> },
];

const sidebarStyle = (darkMode) => ({
  minWidth: 200,
  borderRight: `1px solid ${darkMode ? "#334155" : "#e5e7eb"}`,
  background: darkMode ? "#0f172a" : "#f4f6f8",
  padding: "2rem 1.5rem 2rem 2rem", // Add right padding
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const tabButtonStyle = (active, darkMode) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  background: active ? (darkMode ? "#334155" : "#e5e7eb") : "transparent",
  color: active ? (darkMode ? "#fff" : "#222") : (darkMode ? "#cbd5e1" : "#222"),
  border: "none",
  borderRadius: 6,
  padding: "0.7rem 1rem",
  fontWeight: active ? 600 : 500,
  fontSize: "1rem",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 0.15s, color 0.15s",
});

const sectionStyle = {
  marginBottom: "2.5rem",
};

const labelStyle = {
  fontWeight: 500,
  fontSize: "1rem",
  marginBottom: 4,
  display: "block",
};

const descStyle = {
  color: "#64748b",
  fontSize: "0.97rem",
  marginBottom: 10,
};

const inputStyle = (darkMode) => ({
  padding: "0.6rem 0.8rem",
  borderRadius: "6px",
  border: darkMode ? "1px solid #475569" : "1px solid #cbd5e1",
  fontSize: "1rem",
  fontFamily: "inherit",
  backgroundColor: darkMode ? "#334155" : "#ffffff",
  color: darkMode ? "#f8fafc" : "#222222",
  minWidth: 0,
  marginBottom: 12,
});

const buttonStyle = (darkMode) => ({
  padding: "0.7rem 1.2rem",
  borderRadius: 6,
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  marginTop: 8,
});

export default function Settings() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { name, setName } = useContext(UserContext);

  // State for tabs
  const [activeTab, setActiveTab] = useState("profile");

  // Settings state (mock + real)
  const [email, setEmail] = useState(() => localStorage.getItem('settings_email') || '');
  const [defaultStatus, setDefaultStatus] = useState(() => localStorage.getItem('settings_defaultStatus') || 'APPLIED');
  const [defaultSort, setDefaultSort] = useState(() => localStorage.getItem('settings_defaultSort') || 'date');
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('settings_notifications');
    return stored ? JSON.parse(stored) : false;
  });
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('settings_fontSize') || 'medium');
  const [compactMode, setCompactMode] = useState(() => {
    const stored = localStorage.getItem('settings_compactMode');
    return stored ? JSON.parse(stored) : false;
  });
  const [saveStatus, setSaveStatus] = useState(false);

  // Mock settings
  const [apiToken, setApiToken] = useState("sk-1234-xxxx");
  const [slackIntegration, setSlackIntegration] = useState(false);

  // New state for dashboard quote
  const [dashboardQuote, setDashboardQuote] = useState(() => localStorage.getItem('settings_dashboardQuote') || '');

  useEffect(() => {
    let size;
    if (fontSize === 'small') size = '14px';
    else if (fontSize === 'large') size = '20px';
    else size = '16px'; // medium
    document.documentElement.style.setProperty('--font-size-base', size);
  }, [fontSize]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('settings_name', name);
    localStorage.setItem('settings_email', email);
    localStorage.setItem('settings_defaultStatus', defaultStatus);
    localStorage.setItem('settings_defaultSort', defaultSort);
    localStorage.setItem('settings_notifications', JSON.stringify(notifications));
    localStorage.setItem('settings_fontSize', fontSize);
    localStorage.setItem('settings_compactMode', JSON.stringify(compactMode));
    setName(name);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 1200);
  };

  // --- Tab Content Renderers ---
  function renderProfile() {
    return (
      <form onSubmit={handleSave} style={{ maxWidth: 500 }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Name</div>
          <div style={descStyle}>This will be used for your greeting and profile.</div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle(darkMode)}
          />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Email</div>
          <div style={descStyle}>Used for notifications and account recovery.</div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle(darkMode)}
          />
        </div>
        <button type="submit" style={buttonStyle(darkMode)}>Save Profile</button>
      </form>
    );
  }

  function renderPreferences() {
    return (
      <form onSubmit={handleSave} style={{ maxWidth: 500 }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Default Job Status</div>
          <div style={descStyle}>Choose the default status for new job applications.</div>
          <select
            value={defaultStatus}
            onChange={e => setDefaultStatus(e.target.value)}
            style={inputStyle(darkMode)}
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="REJECTED">Rejected</option>
            <option value="OFFER">Offer</option>
          </select>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Default Sort Order</div>
          <div style={descStyle}>How jobs are sorted by default on your dashboard.</div>
          <select
            value={defaultSort}
            onChange={e => setDefaultSort(e.target.value)}
            style={inputStyle(darkMode)}
          >
            <option value="date">Date</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Font Size</div>
          <div style={descStyle}>Adjust the base font size for the app.</div>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            style={inputStyle(darkMode)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Compact Mode</div>
          <div style={descStyle}>Switch between grid and list layouts for your dashboard.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setCompactMode(true)}
              style={{
                ...buttonStyle(darkMode),
                background: compactMode ? "#3b82f6" : (darkMode ? "#334155" : "#e5e7eb"),
                color: compactMode ? "#fff" : (darkMode ? "#f8fafc" : "#222"),
                fontWeight: compactMode ? 700 : 500,
                padding: "0.4rem 0.9rem",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MdViewModule /> Grid
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setCompactMode(false)}
              style={{
                ...buttonStyle(darkMode),
                background: !compactMode ? "#3b82f6" : (darkMode ? "#334155" : "#e5e7eb"),
                color: !compactMode ? "#fff" : (darkMode ? "#f8fafc" : "#222"),
                fontWeight: !compactMode ? 700 : 500,
                padding: "0.4rem 0.9rem",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MdViewList /> List
            </button>
          </div>
        </div>
        <button type="submit" style={buttonStyle(darkMode)}>Save Preferences</button>
      </form>
    );
  }

  function renderNotifications() {
    return (
      <form onSubmit={handleSave} style={{ maxWidth: 500 }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Enable Notifications</div>
          <div style={descStyle}>Receive email or in-app notifications for job updates.</div>
          <button
            type="button"
            aria-label="Toggle notifications"
            onClick={() => setNotifications(n => !n)}
            style={{
              ...buttonStyle(darkMode),
              background: notifications ? "#3b82f6" : (darkMode ? "#334155" : "#e5e7eb"),
              color: notifications ? "#fff" : (darkMode ? "#f8fafc" : "#222"),
              borderRadius: "50%",
              width: 56, // increased size
              height: 56, // increased size
              fontSize: "2rem", // increased font size
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {notifications
              ? <MdNotificationsActive size={32} />
              : <MdNotificationsNone size={32} />}
          </button>
        </div>
        <button type="submit" style={buttonStyle(darkMode)}>Save Notification Settings</button>
      </form>
    );
  }

  function renderAppearance() {
    return (
      <form onSubmit={handleSave} style={{ maxWidth: 500 }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Theme</div>
          <div style={descStyle}>Switch between light and dark mode.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              aria-label="Dark mode"
              onClick={() => setDarkMode(true)}
              style={{
                ...buttonStyle(darkMode),
                background: darkMode ? "#3b82f6" : (darkMode ? "#334155" : "#e5e7eb"),
                color: darkMode ? "#fff" : (darkMode ? "#f8fafc" : "#222"),
                fontWeight: darkMode ? 700 : 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MdDarkMode /> Dark
            </button>
            <button
              type="button"
              aria-label="Light mode"
              onClick={() => setDarkMode(false)}
              style={{
                ...buttonStyle(darkMode),
                background: !darkMode ? "#3b82f6" : (darkMode ? "#334155" : "#e5e7eb"),
                color: !darkMode ? "#fff" : (darkMode ? "#f8fafc" : "#222"),
                fontWeight: !darkMode ? 700 : 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MdLightMode /> Light
            </button>
          </div>
        </div>
        <button type="submit" style={buttonStyle(darkMode)}>Save Appearance</button>
      </form>
    );
  }

  function renderIntegrations() {
    return (
      <form onSubmit={e => { e.preventDefault(); setSaveStatus(true); setTimeout(() => setSaveStatus(false), 1200); }} style={{ maxWidth: 500 }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>API Token</div>
          <div style={descStyle}>Use this token to access the Job Tracker API.</div>
          <input
            type="text"
            value={apiToken}
            onChange={e => setApiToken(e.target.value)}
            style={inputStyle(darkMode)}
            readOnly
          />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Slack Integration</div>
          <div style={descStyle}>Enable Slack notifications for job updates.</div>
          <button
            type="button"
            onClick={() => setSlackIntegration(v => !v)}
            style={{
              ...buttonStyle(darkMode),
              background: slackIntegration ? "#3b82f6" : (darkMode ? "#334155" : "#e5e7eb"),
              color: slackIntegration ? "#fff" : (darkMode ? "#f8fafc" : "#222"),
              fontWeight: slackIntegration ? 700 : 500,
            }}
          >
            {slackIntegration ? "Disable Slack" : "Enable Slack"}
          </button>
        </div>
        <button type="submit" style={buttonStyle(darkMode)}>Save Integrations</button>
      </form>
    );
  }

  function renderSecurity() {
    return (
      <form style={{ maxWidth: 500 }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Change Password</div>
          <div style={descStyle}>Update your account password.</div>
          <input type="password" placeholder="Current password" style={inputStyle(darkMode)} disabled />
          <input type="password" placeholder="New password" style={inputStyle(darkMode)} disabled />
          <button type="button" style={buttonStyle(darkMode)} disabled>Change Password</button>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Two-Factor Authentication</div>
          <div style={descStyle}>Add an extra layer of security to your account.</div>
          <button type="button" style={buttonStyle(darkMode)} disabled>Enable 2FA</button>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Active Sessions</div>
          <div style={descStyle}>Manage devices logged into your account.</div>
          <ul>
            <li>Chrome on Windows 10 <button style={{ marginLeft: 8 }} disabled>Revoke</button></li>
            <li>Safari on iPhone <button style={{ marginLeft: 8 }} disabled>Revoke</button></li>
          </ul>
        </div>
      </form>
    );
  }

  function renderExport() {
    return (
      <div style={{ maxWidth: 500 }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Export Data</div>
          <div style={descStyle}>Download your job applications as CSV or JSON.</div>
          <button type="button" style={buttonStyle(darkMode)} disabled>Export as CSV</button>
          <button type="button" style={{ ...buttonStyle(darkMode), marginLeft: 8 }} disabled>Export as JSON</button>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Import Backup</div>
          <div style={descStyle}>Restore your data from a backup file.</div>
          <input type="file" style={inputStyle(darkMode)} disabled />
          <button type="button" style={buttonStyle(darkMode)} disabled>Import</button>
        </div>
      </div>
    );
  }

  function renderPersonalization() {
    // Save dashboard quote with other settings
    const handlePersonalizationSave = (e) => {
      e.preventDefault();
      localStorage.setItem('settings_dashboardQuote', dashboardQuote);
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 1200);
    };

    return (
      <form onSubmit={handlePersonalizationSave} style={{ maxWidth: 500 }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Profile Picture</div>
          <div style={descStyle}>Upload or select an avatar for your profile.</div>
          <input type="file" style={inputStyle(darkMode)} disabled />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Accent Color</div>
          <div style={descStyle}>Choose a highlight color for the app.</div>
          <input type="color" style={{ ...inputStyle(darkMode), width: 50, height: 30, padding: 0 }} disabled />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Dashboard Quote</div>
          <div style={descStyle}>Set a custom motivational quote for your dashboard.</div>
          <input
            type="text"
            placeholder="Your quote..."
            value={dashboardQuote}
            onChange={e => setDashboardQuote(e.target.value)}
            style={inputStyle(darkMode)}
          />
        </div>
        <button type="submit" style={buttonStyle(darkMode)}>Save Personalization</button>
      </form>
    );
  }

  // Helper to get current tab label
  const currentTabLabel = tabs.find(tab => tab.key === activeTab)?.label || "";

  // --- Main Layout ---
  return (
    <div style={{
      display: "flex",
      minHeight: "calc(100vh - 72px)",
      background: darkMode ? "#0f172a" : "#f4f6f8",
    }}>
      {/* Sidebar */}
      <nav style={sidebarStyle(darkMode)}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18, color: darkMode ? "#fff" : "#222" }}>
          Settings
        </h3>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={tabButtonStyle(activeTab === tab.key, darkMode)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: "2.5rem 3rem",
        maxWidth: 700,
        margin: "0 auto",
        background: darkMode ? "#0f172a" : "#f4f6f8",
      }}>
        {/* Dynamic Title and Divider */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: darkMode ? "#fff" : "#222",
            letterSpacing: 0.2,
            textTransform: "capitalize"
          }}>
            {currentTabLabel}
          </h2>
          <div style={{
            height: 1,
            background: darkMode ? "#334155" : "#e5e7eb",
            margin: "16px 0 0 0"
          }} />
        </div>
        {activeTab === "profile" && renderProfile()}
        {activeTab === "preferences" && renderPreferences()}
        {activeTab === "notifications" && renderNotifications()}
        {activeTab === "appearance" && renderAppearance()}
        {activeTab === "personalization" && renderPersonalization()}
        {activeTab === "security" && renderSecurity()}
        {activeTab === "export" && renderExport()}
        {activeTab === "integrations" && renderIntegrations()}
        {/* Save Confirmation Modal */}
        {saveStatus && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}>
            <div style={{
              background: darkMode ? "#23263a" : "#fff",
              color: darkMode ? "#f8fafc" : "#222",
              padding: "2rem 2.5rem",
              borderRadius: 16,
              boxShadow: "0 2px 24px rgba(0,0,0,0.22)",
              fontSize: 22,
              fontWeight: 600,
              textAlign: "center",
            }}>
              Settings Saved!
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
