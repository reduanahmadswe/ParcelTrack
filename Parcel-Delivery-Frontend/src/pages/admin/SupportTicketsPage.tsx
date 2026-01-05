import React from "react";
import { MessageSquare, AlertCircle, CheckCircle } from "lucide-react";

const SupportTicketsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
                <p className="text-muted-foreground">
                    Manage user inquiries and support requests.
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Recent Tickets</h2>
                    <button className="text-sm text-primary hover:underline">View All</button>
                </div>
                <div className="p-6 text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No new tickets</h3>
                    <p className="text-muted-foreground mt-2">All caught up! There are no pending support tickets at the moment.</p>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketsPage;
