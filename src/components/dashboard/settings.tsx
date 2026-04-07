"use client";

import { useState } from "react";
import { Bell, Shield, Eye, LogOut, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    applicationUpdates: true,
    twoFactor: false,
    privateProfile: false,
    dataCollection: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Notification Settings */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">
            Notifications
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              description: "Receive email updates about your applications",
            },
            {
              key: "pushNotifications",
              label: "Push Notifications",
              description: "Get push notifications on your devices",
            },
            {
              key: "weeklyDigest",
              label: "Weekly Digest",
              description: "Receive a weekly summary of new opportunities",
            },
            {
              key: "applicationUpdates",
              label: "Application Updates",
              description:
                "Notify me when there are updates on my applications",
            },
          ].map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/20 p-4"
            >
              <div>
                <p className="font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <button
                onClick={() => handleToggle(key as keyof typeof settings)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  settings[key as keyof typeof settings]
                    ? "bg-accent"
                    : "bg-secondary/50"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    settings[key as keyof typeof settings]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/20 p-4">
            <div>
              <p className="font-medium text-foreground">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() => handleToggle("twoFactor")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.twoFactor ? "bg-accent" : "bg-secondary/50"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings.twoFactor ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <button className="w-full rounded-lg border border-border/30 bg-secondary/20 p-4 text-left hover:bg-secondary/30 transition-colors">
            <p className="font-medium text-foreground">Change Password</p>
            <p className="text-sm text-muted-foreground">
              Update your password regularly
            </p>
          </button>

          <button className="w-full rounded-lg border border-border/30 bg-secondary/20 p-4 text-left hover:bg-secondary/30 transition-colors">
            <p className="font-medium text-foreground">Manage Sessions</p>
            <p className="text-sm text-muted-foreground">
              View and manage your active sessions
            </p>
          </button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Privacy</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/20 p-4">
            <div>
              <p className="font-medium text-foreground">Private Profile</p>
              <p className="text-sm text-muted-foreground">
                Make your profile visible only to you
              </p>
            </div>
            <button
              onClick={() => handleToggle("privateProfile")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.privateProfile ? "bg-accent" : "bg-secondary/50"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings.privateProfile ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/20 p-4">
            <div>
              <p className="font-medium text-foreground">Data Collection</p>
              <p className="text-sm text-muted-foreground">
                Allow us to collect data to improve recommendations
              </p>
            </div>
            <button
              onClick={() => handleToggle("dataCollection")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.dataCollection ? "bg-accent" : "bg-secondary/50"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings.dataCollection ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 backdrop-blur-xl">
        <h2 className="mb-6 text-xl font-semibold text-red-400">Danger Zone</h2>

        <div className="space-y-4">
          <button className="w-full rounded-lg border border-border/30 bg-secondary/20 p-4 text-left hover:bg-secondary/30 transition-colors flex items-center gap-3">
            <LogOut className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium text-foreground">
                Logout from All Devices
              </p>
              <p className="text-sm text-muted-foreground">
                Sign out from all your active sessions
              </p>
            </div>
          </button>

          <button className="w-full rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-left hover:bg-red-500/20 transition-colors flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-400">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          className="border-border/50 hover:bg-secondary/30"
        >
          Discard Changes
        </Button>
        <Button className="bg-accent hover:bg-accent/80 text-background px-8 py-2.5 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
