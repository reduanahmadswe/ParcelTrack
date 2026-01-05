import React, { useState } from "react";
import { BarChart, FileText, Download, Calendar } from "lucide-react";
import { useGetParcelStatsQuery } from "../../store/api/reportApi";
import jsPDF from "jspdf";

const ReportsPage: React.FC = () => {
    const [timeframe, setTimeframe] = useState("monthly");
    const { data: stats, isLoading } = useGetParcelStatsQuery(timeframe);

    const generatePDF = (title: string, data: any) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(title, 20, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Timeframe: ${timeframe}`, 20, 40);

        // Simple data dump for now
        let y = 60;
        Object.entries(data).forEach(([key, value]) => {
            doc.text(`${key}: ${value}`, 20, y);
            y += 10;
        });

        doc.save(`${title.toLowerCase().replace(" ", "_")}.pdf`);
    };

    if (isLoading) return <div className="p-8 text-center">Loading reports...</div>;

    return (
        <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6 xl:p-8">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">System Reports</h1>
                        <p className="text-muted-foreground">
                            View and download detailed analytics and operational reports.
                        </p>
                    </div>
                    <div className="flex gap-2 bg-muted p-1 rounded-lg">
                        {['daily', 'monthly', 'all'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeframe === t
                                    ? 'bg-background shadow-sm text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Financial Report */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                    <BarChart className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Financial Overview</h3>
                                    <p className="text-sm text-muted-foreground">Revenue analysis</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Collected</span>
                                    <span className="text-lg font-bold text-green-600">৳{stats?.totalRevenue || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Pending</span>
                                    <span className="text-lg font-bold text-orange-600">৳{(stats?.potentialRevenue || 0) - (stats?.totalRevenue || 0)}</span>
                                </div>
                                <div className="pt-2 border-t border-border mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Total Potential</span>
                                        <span className="text-sm font-bold">৳{stats?.potentialRevenue || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => generatePDF('Financial Report', {
                                'Collected Revenue': `৳${stats?.totalRevenue || 0}`,
                                'Pending Revenue': `৳${(stats?.potentialRevenue || 0) - (stats?.totalRevenue || 0)}`,
                                'Total Potential Revenue': `৳${stats?.potentialRevenue || 0}`,
                                'Total Parcels': stats?.totalParcels || 0
                            })}
                            className="w-full mt-6 py-2 px-4 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" /> Download PDF
                        </button>
                    </div>

                    {/* Delivery Performance */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Delivery Metrics</h3>
                                    <p className="text-sm text-muted-foreground">Performance stats</p>
                                </div>
                            </div>
                            {stats && (
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Success Rate</span>
                                            <span className="font-medium">{stats.totalParcels > 0 ? Math.round((stats.delivered / stats.totalParcels) * 100) : 0}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${stats.totalParcels > 0 ? (stats.delivered / stats.totalParcels) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/10 rounded-lg">
                                            <div className="text-xl font-bold text-green-600">{stats.delivered}</div>
                                            <div className="text-xs text-muted-foreground">Delivered</div>
                                        </div>
                                        <div className="text-center p-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                            <div className="text-xl font-bold text-red-600">{stats.returned + stats.cancelled}</div>
                                            <div className="text-xs text-muted-foreground">Failed/Cancelled</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => generatePDF('Delivery Performance', {
                                'Total Parcels': stats?.totalParcels,
                                'Delivered': stats?.delivered,
                                'Returned': stats?.returned,
                                'Cancelled': stats?.cancelled,
                                'Success Rate': `${stats?.totalParcels > 0 ? Math.round((stats?.delivered / stats?.totalParcels) * 100) : 0}%`
                            })}
                            className="w-full mt-6 py-2 px-4 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" /> Download PDF
                        </button>
                    </div>

                    {/* Parcel Volume Report */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Parcel Volume</h3>
                                    <p className="text-sm text-muted-foreground">Traffic overview</p>
                                </div>
                            </div>
                            {stats && (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center py-2 border-b border-border">
                                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Total Requests</span>
                                        <span className="font-medium">{stats.totalParcels}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border">
                                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> In Progress</span>
                                        <span className="font-medium">{stats.pending + stats.approved + stats.inTransit + stats.dispatched}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border">
                                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Urgent</span>
                                        <span className="font-medium">{stats.urgentParcels}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => generatePDF('Parcel Volume Report', {
                                'Total Requests': stats?.totalParcels,
                                'Active Parcels': stats?.pending + stats?.approved + stats?.inTransit + stats?.dispatched,
                                'Urgent Parcels': stats?.urgentParcels,
                            })}
                            className="w-full mt-6 py-2 px-4 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" /> Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
