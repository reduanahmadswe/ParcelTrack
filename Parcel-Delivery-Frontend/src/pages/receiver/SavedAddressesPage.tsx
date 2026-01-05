import React, { useState } from "react";
import { Home, Plus, Trash2, MapPin } from "lucide-react";
import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../../store/api/authApi";
import { toast } from "react-hot-toast";

const SavedAddressesPage: React.FC = () => {
    const { data: userData, isLoading } = useGetCurrentUserQuery();
    const [updateProfile] = useUpdateProfileMutation();
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: "Home",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Bangladesh"
    });

    const user = userData?.data;
    const addressBook = user?.addressBook || [];

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedBook = [...addressBook, { ...newAddress, isDefault: addressBook.length === 0 }];
            await updateProfile({ addressBook: updatedBook }).unwrap();
            toast.success("Address added successfully");
            setIsAdding(false);
            setNewAddress({
                label: "Home",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "Bangladesh"
            });
        } catch (error: any) {
            console.error("Failed to add address:", error);
            const errorData = error?.data || error;
            const errorMessage = errorData?.message ||
                (errorData?.error && JSON.stringify(errorData.error)) ||
                "Failed to add address. please try again.";

            toast.error(`Error: ${errorMessage}`);
        }
    };

    const handleDelete = async (index: number) => {
        try {
            const updatedBook = addressBook.filter((_, i) => i !== index);
            await updateProfile({ addressBook: updatedBook }).unwrap();
            toast.success("Address removed");
        } catch (error) {
            toast.error("Failed to remove address");
        }
    };

    if (isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Saved Addresses</h1>
                        <p className="text-muted-foreground">
                            Manage your delivery locations for faster checkout.
                        </p>
                    </div>
                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" /> Add New
                        </button>
                    )}
                </div>

                {isAdding && (
                    <div className="bg-card border border-border p-6 rounded-xl mb-6 animate-in slide-in-from-top-4">
                        <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                        <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                placeholder="Label (e.g. Home, Office)"
                                value={newAddress.label}
                                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                className="p-2 rounded border border-border bg-background"
                                required
                            />
                            <input
                                placeholder="Street Address"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                className="p-2 rounded border border-border bg-background"
                                required
                            />
                            <input
                                placeholder="City"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                className="p-2 rounded border border-border bg-background"
                                required
                            />
                            <input
                                placeholder="State/Division"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                className="p-2 rounded border border-border bg-background"
                                required
                            />
                            <input
                                placeholder="ZIP Code"
                                value={newAddress.zipCode}
                                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                className="p-2 rounded border border-border bg-background"
                                required
                            />
                            <div className="flex gap-2 md:col-span-2 mt-2">
                                <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">Save Address</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-border rounded hover:bg-muted">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Default user address (from registration) */}
                    {user?.address ? (
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                    <Home className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="font-semibold mb-1">Primary Address</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {user.address.street}<br />
                                {user.address.city}, {user.address.zipCode}
                            </p>
                            <span className="text-xs bg-muted px-2 py-1 rounded">Primary</span>
                        </div>
                    ) : (
                        <div className="bg-card border border-border border-dashed rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                            <Home className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground text-sm">No Primary Address Set</p>
                        </div>
                    )}

                    {/* Additional Saved Addresses */}
                    {addressBook.map((addr, idx) => (
                        <div key={idx} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <button
                                    onClick={() => handleDelete(idx)}
                                    className="text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <h3 className="font-semibold mb-1">{addr.label}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {addr.street}<br />
                                {addr.city}, {addr.zipCode}
                            </p>
                            {addr.isDefault && <span className="text-xs bg-muted px-2 py-1 rounded">Default</span>}
                        </div>
                    ))}

                    {(!user?.address && addressBook.length === 0) && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No saved addresses found. Add one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedAddressesPage;
