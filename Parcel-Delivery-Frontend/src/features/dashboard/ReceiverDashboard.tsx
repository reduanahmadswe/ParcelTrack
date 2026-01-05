"use client";

import { Package, Calendar, MapPin, Eye, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import { getStatusColor } from "../../utils/HelperUtilities";
import { Parcel } from "../../types/GlobalTypeDefinitions";
import ParcelDetailsModal from "../../components/modals/ParcelDetailsModal";
import { useGetReceiverParcelsQuery } from "../../store/api/receiverApi";

export default function ReceiverDashboard() {
    const { user } = useAuth();
    const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: parcelsData,
        isLoading,
        isFetching,
        refetch
    } = useGetReceiverParcelsQuery(undefined, {
        refetchOnFocus: false,
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: true,
    });

    // Extract parcels array from response
    const parcels = Array.isArray(parcelsData?.data) ? parcelsData.data : [];

    const handleViewParcel = (parcel: Parcel) => {
        setSelectedParcel(parcel);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedParcel(null);
    };

    const stats = {
        total: parcels.length,
        pending: parcels.filter((p) =>
            ["requested", "approved"].includes(p.currentStatus)
        ).length,
        inTransit: parcels.filter((p) =>
            ["dispatched", "in-transit"].includes(p.currentStatus)
        ).length,
        delivered: parcels.filter((p) => p.currentStatus === "delivered").length,
    };

    const recentParcels = parcels.slice(0, 5);

    if (isLoading) {
        return (
            <ProtectedRoute allowedRoles={["receiver"]}>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={["receiver"]}>
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-50/50 via-transparent to-blue-50/50 dark:from-red-950/20 dark:to-blue-950/20 border border-border rounded-xl p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">
                                    Receiver Dashboard
                                </h1>
                                <p className="text-muted-foreground">
                                    Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>! Track your incoming parcels.
                                </p>
                            </div>
                            <button
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Parcels</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                                    <Calendar className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                                    <MapPin className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.inTransit}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                                    <Package className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Parcels */}
                    <div className="bg-card border border-border rounded-xl shadow-sm">
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-foreground">Recent Parcels</h2>
                                <Link
                                    to="/receiver/history"
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {recentParcels.length === 0 ? (
                                <div className="text-center py-12 px-6">
                                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        No parcels yet
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your incoming parcels will appear here.
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Tracking ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Sender
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {recentParcels.map((parcel) => (
                                            <tr
                                                key={parcel._id}
                                                className="hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
                                                                <Package className="h-5 w-5 text-red-600" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-foreground">
                                                                {parcel.trackingId}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-foreground">
                                                        {parcel.senderInfo?.name || "N/A"}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {parcel.senderInfo?.phone || ""}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                            parcel.currentStatus
                                                        )}`}
                                                    >
                                                        {parcel.currentStatus
                                                            .replace("-", " ")
                                                            .toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                    {new Date(parcel.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleViewParcel(parcel)}
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                        title="View parcel details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to="/receiver/history"
                            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-red-200 dark:hover:border-red-800 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full group-hover:scale-110 transition-transform">
                                    <Package className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Order History</h3>
                                    <p className="text-sm text-muted-foreground">View all parcels</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/receiver/addresses"
                            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-200 dark:hover:border-blue-800 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full group-hover:scale-110 transition-transform">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Saved Addresses</h3>
                                    <p className="text-sm text-muted-foreground">Manage addresses</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/receiver/preferences"
                            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-purple-200 dark:hover:border-purple-800 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full group-hover:scale-110 transition-transform">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Preferences</h3>
                                    <p className="text-sm text-muted-foreground">Delivery settings</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Parcel Details Modal */}
            <ParcelDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                parcel={selectedParcel}
            />
        </ProtectedRoute>
    );
}
