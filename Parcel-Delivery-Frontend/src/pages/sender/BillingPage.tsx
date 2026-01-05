import React from "react";
import { CreditCard, Download, Clock } from "lucide-react";

const BillingPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Billing & Invoices</h1>
                <p className="text-muted-foreground">
                    View your payment history and download invoices.
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Invoice ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-muted/30">
                                    <td className="px-6 py-4 font-medium">INV-2023-00{i}</td>
                                    <td className="px-6 py-4">Oct {10 + i}, 2023</td>
                                    <td className="px-6 py-4">৳ {1200 * i}.00</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                                            Paid
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                            <Download className="h-3 w-3" /> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
