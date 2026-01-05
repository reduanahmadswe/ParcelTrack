import React, { useState, useEffect } from "react";
import { Bell, Clock, Shield, Save } from "lucide-react";
import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../../store/api/authApi";
import { toast } from "react-hot-toast";

const DeliveryPreferencesPage: React.FC = () => {
    const { data: userData } = useGetCurrentUserQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    // Default state
    const [preferences, setPreferences] = useState<{
        deliveryTime: 'any' | 'morning' | 'afternoon' | 'evening';
        notifications: boolean;
        newsletter: boolean;
    }>({
        deliveryTime: 'any',
        notifications: true,
        newsletter: false
    });

    useEffect(() => {
        if (userData?.data?.preferences) {
            setPreferences(prev => ({
                ...prev,
                ...userData.data.preferences
            }));
        }
    }, [userData]);

    const handleSave = async () => {
        try {
            await updateProfile({ preferences }).unwrap();
            toast.success("Preferences updated successfully");
        } catch (error) {
            toast.error("Failed to update preferences");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Delivery Preferences</h1>
                        <p className="text-muted-foreground">
                            Customize how and when you want to receive your parcels.
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" /> {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="max-w-2xl space-y-6">
                    {/* Delivery Time */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Preferred Delivery Experience</h3>
                        </div>
                        <div className="space-y-3">
                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${preferences.deliveryTime === 'any' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                                <input
                                    type="radio"
                                    name="time"
                                    checked={preferences.deliveryTime === 'any'}
                                    onChange={() => setPreferences({ ...preferences, deliveryTime: 'any' })}
                                    className="accent-red-500"
                                />
                                <div>
                                    <span className="block font-medium text-sm">Anytime (9 AM - 8 PM)</span>
                                    <span className="text-xs text-muted-foreground">Standard delivery hours</span>
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${preferences.deliveryTime === 'morning' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                                <input
                                    type="radio"
                                    name="time"
                                    checked={preferences.deliveryTime === 'morning'}
                                    onChange={() => setPreferences({ ...preferences, deliveryTime: 'morning' })}
                                    className="accent-red-500"
                                />
                                <div>
                                    <span className="block font-medium text-sm">Morning Only (9 AM - 12 PM)</span>
                                    <span className="text-xs text-muted-foreground">Receive packages before noon</span>
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${preferences.deliveryTime === 'afternoon' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                                <input
                                    type="radio"
                                    name="time"
                                    checked={preferences.deliveryTime === 'afternoon'}
                                    onChange={() => setPreferences({ ...preferences, deliveryTime: 'afternoon' })}
                                    className="accent-red-500"
                                />
                                <div>
                                    <span className="block font-medium text-sm">Afternoon (12 PM - 5 PM)</span>
                                    <span className="text-xs text-muted-foreground">Mid-day delivery</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Notification Settings</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-sm font-medium">Order Updates</span>
                                    <span className="text-xs text-muted-foreground">Receive SMS and Email notifications about your parcel status</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle accent-red-500 h-5 w-5"
                                    checked={preferences.notifications}
                                    onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <div>
                                    <span className="block text-sm font-medium">Newsletter</span>
                                    <span className="text-xs text-muted-foreground">Receive updates about new features and promotions</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle accent-red-500 h-5 w-5"
                                    checked={preferences.newsletter}
                                    onChange={(e) => setPreferences({ ...preferences, newsletter: e.target.checked })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPreferencesPage;
