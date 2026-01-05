import React, { useState } from "react";
import { Book, Plus, MapPin, Home, Trash2, Edit2, X } from "lucide-react";
import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../../store/api/authApi";
import { AddressBookEntry } from "../../types/GlobalTypeDefinitions";
import toast from "react-hot-toast";

const AddressBookPage: React.FC = () => {
    const { data: userData, isLoading } = useGetCurrentUserQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressBookEntry | null>(null);
    const [newAddress, setNewAddress] = useState<AddressBookEntry>({
        label: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Bangladesh",
        isDefault: false
    });

    const user = userData?.data;
    const addressBook = user?.addressBook || [];

    const handleAddAddress = async () => {
        if (!newAddress.label || !newAddress.street || !newAddress.city) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const updatedAddressBook = [...addressBook, newAddress];
            await updateProfile({ addressBook: updatedAddressBook } as any).unwrap();
            toast.success("Address added successfully");
            setShowAddForm(false);
            setNewAddress({
                label: "",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "Bangladesh",
                isDefault: false
            });
        } catch (error: any) {
            console.error("Failed to add address:", error);
            const errorData = error?.data || error;
            const errorMessage = errorData?.message || "Failed to add address. Please try again.";
            toast.error(`Error: ${errorMessage}`);
        }
    };

    const handleUpdateAddress = async () => {
        if (!editingAddress || !editingAddress.label || !editingAddress.street || !editingAddress.city) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const updatedAddressBook = addressBook.map((addr: AddressBookEntry) =>
                addr === editingAddress ? editingAddress : addr
            );
            await updateProfile({ addressBook: updatedAddressBook } as any).unwrap();
            toast.success("Address updated successfully");
            setEditingAddress(null);
        } catch (error: any) {
            console.error("Failed to update address:", error);
            toast.error("Failed to update address");
        }
    };

    const handleDeleteAddress = async (addressToDelete: AddressBookEntry) => {
        try {
            const updatedAddressBook = addressBook.filter((addr: AddressBookEntry) => addr !== addressToDelete);
            await updateProfile({ addressBook: updatedAddressBook } as any).unwrap();
            toast.success("Address deleted successfully");
        } catch (error) {
            console.error("Failed to delete address:", error);
            toast.error("Failed to delete address");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Address Book</h1>
                        <p className="text-muted-foreground">
                            Manage your saved pickup and delivery addresses.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Add New Address
                    </button>
                </div>

                {/* Add/Edit Form Modal */}
                {(showAddForm || editingAddress) && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    {editingAddress ? "Edit Address" : "Add New Address"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingAddress(null);
                                    }}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Label *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Home, Office"
                                        value={editingAddress ? editingAddress.label : newAddress.label}
                                        onChange={(e) => {
                                            if (editingAddress) {
                                                setEditingAddress({ ...editingAddress, label: e.target.value });
                                            } else {
                                                setNewAddress({ ...newAddress, label: e.target.value });
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Street Address *</label>
                                    <input
                                        type="text"
                                        placeholder="123 Main Street"
                                        value={editingAddress ? editingAddress.street : newAddress.street}
                                        onChange={(e) => {
                                            if (editingAddress) {
                                                setEditingAddress({ ...editingAddress, street: e.target.value });
                                            } else {
                                                setNewAddress({ ...newAddress, street: e.target.value });
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">City *</label>
                                        <input
                                            type="text"
                                            placeholder="Dhaka"
                                            value={editingAddress ? editingAddress.city : newAddress.city}
                                            onChange={(e) => {
                                                if (editingAddress) {
                                                    setEditingAddress({ ...editingAddress, city: e.target.value });
                                                } else {
                                                    setNewAddress({ ...newAddress, city: e.target.value });
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">State/Division</label>
                                        <input
                                            type="text"
                                            placeholder="Dhaka"
                                            value={editingAddress ? editingAddress.state : newAddress.state}
                                            onChange={(e) => {
                                                if (editingAddress) {
                                                    setEditingAddress({ ...editingAddress, state: e.target.value });
                                                } else {
                                                    setNewAddress({ ...newAddress, state: e.target.value });
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        placeholder="1212"
                                        value={editingAddress ? editingAddress.zipCode : newAddress.zipCode}
                                        onChange={(e) => {
                                            if (editingAddress) {
                                                setEditingAddress({ ...editingAddress, zipCode: e.target.value });
                                            } else {
                                                setNewAddress({ ...newAddress, zipCode: e.target.value });
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                                        disabled={isUpdating}
                                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        {isUpdating ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingAddress(null);
                                        }}
                                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Primary Address */}
                {user?.address && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Primary Address</h2>
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                    <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">Primary</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {user.address.street}
                                        <br />
                                        {user.address.city}, {user.address.state} {user.address.zipCode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Saved Addresses */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Saved Addresses</h2>
                    {addressBook.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No saved addresses yet. Add one to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addressBook.map((address: AddressBookEntry, index: number) => (
                                <div key={index} className="bg-card border border-border rounded-xl p-6 shadow-sm relative group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                                            <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{address.label || "Unnamed"}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {address.street}
                                                <br />
                                                {address.city}{address.state ? `, ${address.state}` : ""} {address.zipCode}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button
                                            onClick={() => setEditingAddress(address)}
                                            className="text-xs border border-border px-2 py-1 rounded hover:bg-muted flex items-center gap-1"
                                        >
                                            <Edit2 className="h-3 w-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(address)}
                                            className="text-xs border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
                                        >
                                            <Trash2 className="h-3 w-3" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressBookPage;
