import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Radar,
  CheckCircle2,
  Monitor,
  Sun,
  Moon,
  Package,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const CHART_DATA_OPTIONS = [
  {
    id: "sales",
    label: "Sales Overview",
    description: "Revenue trends across months",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "orders",
    label: "Orders Overview",
    description: "Order volume across months",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "inventory",
    label: "Inventory Overview",
    description: "Stock levels by category",
    icon: Package,
    color: "from-green-500 to-emerald-500",
  },
];

const CHART_TYPE_OPTIONS = [
  { id: "area", label: "Area", description: "Gradient fill", icon: Activity },
  { id: "bar", label: "Bar", description: "Solid columns", icon: BarChart3 },
  { id: "line", label: "Line", description: "Trend line", icon: TrendingUp },
  { id: "pie", label: "Pie", description: "Proportional", icon: PieChart },
  { id: "radar", label: "Radar", description: "Multi-axis", icon: Radar },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const [chartData, setChartData] = useState(() => {
    return localStorage.getItem("dashboard_chart_data") || "sales";
  });
  const [chartType, setChartType] = useState(() => {
    return localStorage.getItem("dashboard_chart_type") || "area";
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("dashboard_chart_data", chartData);
    localStorage.setItem("dashboard_chart_type", chartType);
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [chartData, chartType]);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e2875] to-[#4338ca] flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Customize your dashboard experience</p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-sm animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Auto-saved</span>
          </div>
        )}
      </div>

      {/* Appearance Section */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="px-6 py-4 border-b" style={{ backgroundColor: isDark ? '#0d1117' : '#f9fafb', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            {isDark ? <Moon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /> : <Sun className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />}
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</h3>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>Choose your preferred visual theme</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Mode Card */}
            <button
              onClick={() => setTheme('dark')}
              className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${isDark
                  ? 'border-[#1e2875] bg-[#1e2875]/10'
                  : 'hover:border-gray-400'
                }`}
              style={!isDark ? { borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' } : {}}
            >
              {isDark && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
              )}
              <div className="w-full h-20 rounded-lg mb-3 overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                <div className="h-full bg-[#0a0e1a] flex items-center p-3 gap-2">
                  <div className="w-8 h-full bg-[#1e2875] rounded" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-16 bg-gray-700 rounded" />
                    <div className="h-2 w-24 bg-gray-800 rounded" />
                    <div className="h-2 w-12 bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" style={{ color: isDark ? '#a78bfa' : 'var(--text-muted)' }} />
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Easier on the eyes, perfect for low-light</p>
            </button>

            {/* Light Mode Card */}
            <button
              onClick={() => setTheme('light')}
              className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${!isDark
                  ? 'border-[#1e2875] bg-blue-50'
                  : 'hover:border-gray-500'
                }`}
              style={isDark ? { borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' } : {}}
            >
              {!isDark && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </div>
              )}
              <div className="w-full h-20 rounded-lg mb-3 overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                <div className="h-full bg-gray-100 flex items-center p-3 gap-2">
                  <div className="w-8 h-full bg-[#1e2875] rounded" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-16 bg-gray-300 rounded" />
                    <div className="h-2 w-24 bg-gray-200 rounded" />
                    <div className="h-2 w-12 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" style={{ color: !isDark ? '#f59e0b' : 'var(--text-muted)' }} />
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Light Mode</p>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Clean and bright, great for daytime</p>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Chart Section */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="px-6 py-4 border-b" style={{ backgroundColor: isDark ? '#0d1117' : '#f9fafb', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Dashboard Chart</h3>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>Choose what data to display and how to visualize it</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Data Source Selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Data Source
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CHART_DATA_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = chartData === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setChartData(option.id)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${isSelected
                        ? "border-[#1e2875] bg-[#1e2875]/10"
                        : "hover:border-gray-500"
                      }`}
                    style={!isSelected ? { borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' } : {}}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{option.label}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderColor: 'var(--border-color)' }} className="border-t" />

          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Chart Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {CHART_TYPE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = chartType === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setChartType(option.id)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                        ? "border-[#1e2875] bg-[#1e2875]/10"
                        : "hover:border-gray-500"
                      }`}
                    style={!isSelected ? { borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' } : {}}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${isSelected ? "bg-[#1e2875]/30 text-blue-400" : ""
                      }`}
                      style={!isSelected ? { backgroundColor: isDark ? 'rgba(55,65,81,0.5)' : 'rgba(229,231,235,0.5)', color: 'var(--text-muted)' } : {}}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`text-sm font-medium ${isSelected ? "text-blue-400" : ""}`}
                      style={!isSelected ? { color: 'var(--text-muted)' } : {}}
                    >
                      {option.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Hint */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Live Preview</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Your dashboard chart will show{' '}
              <span className="text-blue-400 font-medium">
                {CHART_DATA_OPTIONS.find(o => o.id === chartData)?.label}
              </span>{' '}
              data as a{' '}
              <span className="text-purple-400 font-medium">
                {CHART_TYPE_OPTIONS.find(o => o.id === chartType)?.label} Chart
              </span>.
              Changes are saved automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;