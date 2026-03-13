import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Globe,
  Moon,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";

export function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  const handleChangePassword = () => {
    toast.info("Password change feature coming soon!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Settings
        </h1>
        <p className="text-slate-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Profile Information
              </h2>
              <p className="text-sm text-slate-500">
                Update your personal details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" defaultValue="John" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                defaultValue="john.doe@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                defaultValue="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State"
                defaultValue="456 Oak Avenue, San Francisco, CA"
              />
            </div>

            <div>
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                defaultValue="P-10423"
                disabled
                className="bg-slate-50"
              />
            </div>

            <Button
              onClick={handleSaveProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Notifications</h2>
              <p className="text-sm text-slate-500">
                Manage how you receive updates
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Email Notifications</Label>
                <p className="text-sm text-slate-500">
                  Receive updates via email
                </p>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notif">SMS Notifications</Label>
                <p className="text-sm text-slate-500">
                  Receive text message alerts
                </p>
              </div>
              <Switch
                id="sms-notif"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminder-notif">Appointment Reminders</Label>
                <p className="text-sm text-slate-500">
                  Get reminded before appointments
                </p>
              </div>
              <Switch
                id="reminder-notif"
                checked={appointmentReminders}
                onCheckedChange={setAppointmentReminders}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="promo-notif">Promotional Emails</Label>
                <p className="text-sm text-slate-500">
                  Receive offers and updates
                </p>
              </div>
              <Switch
                id="promo-notif"
                checked={promotionalEmails}
                onCheckedChange={setPromotionalEmails}
              />
            </div>

            <Button
              onClick={handleSaveNotifications}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Security & Privacy
              </h2>
              <p className="text-sm text-slate-500">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Password</Label>
              <p className="text-sm text-slate-500 mb-3">
                Last changed 45 days ago
              </p>
              <Button
                onClick={handleChangePassword}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-slate-500">
                  Add an extra layer of security
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Preferences</h2>
              <p className="text-sm text-slate-500">
                Customize your experience
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </Label>
                <p className="text-sm text-slate-500">
                  Switch to dark theme
                </p>
              </div>
              <Switch id="dark-mode" />
            </div>

            <Separator />

            <div>
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
              >
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
              >
                <option>Pacific Time (PT)</option>
                <option>Eastern Time (ET)</option>
                <option>Central Time (CT)</option>
                <option>Mountain Time (MT)</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
