import React, { useState } from "react";
import { Package, Search, Filter } from "lucide-react";
import { useGetReceiverParcelsQuery } from "../../store/api/receiverApi";
import { Parcel } from "../../types/GlobalTypeDefinitions";

const OrderHistoryPage: React.FC = () => {
    const { data: parcelsData, isLoading } = useGetReceiverParcelsQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Access the array from the response
    // The query returns { data: Parcel[] } or similar structure based on receiverApi.ts logic
    const parcels = Array.isArray(parcelsData) ? parcelsData : (parcelsData as any)?.data || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'returned': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    const filteredParcels = Array.isArray(parcels) ? parcels.filter((parcel: Parcel) => {
        const matchesSearch = parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || parcel.currentStatus === statusFilter;
        return matchesSearch && matchesStatus;
    }) : [];

    if (isLoading) return <div className="p-8 text-center">Loading history...</div>;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Order History</h1>
                    <p className="text-muted-foreground">
                        View all your past deliveries and shipments.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by Tracking ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="returned">Returned</option>
                            <option value="in-transit">In Transit</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredParcels.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No orders found matching your criteria.
                        </div>
                    ) : (
                        filteredParcels.map((parcel: Parcel) => (
                            <div key={parcel._id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-muted rounded-lg">
                                        <Package className="h-6 w-6 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Parcel #{parcel.trackingId}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(parcel.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                    <div className="text-right">
                                        <p className="text-sm font-medium">৳{parcel.fee?.totalFee || 0}</p>
                                        <p className="text-xs text-muted-foreground">{parcel.fee?.isPaid ? 'Paid' : 'Unpaid'}</p>
                                    </div>
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(parcel.currentStatus)}`}>
                                        {parcel.currentStatus.charAt(0).toUpperCase() + parcel.currentStatus.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;
