import { StreamlitGallery } from "@/components/StreamlitGallery";

export const metadata = {
    title: 'Analytics Apps | David Dunn',
    description: 'A collection of interactive analytics dashboards and data visualization applications built with Streamlit.',
};

export default function AnalyticsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Analytics Dashboard Gallery</h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Explore a collection of interactive analytics dashboards, infographics, and data visualization applications.
                    Each app is built with Streamlit and powered by real-time data from our Supabase database.
                </p>
            </div>
            <StreamlitGallery />
        </div>
    );
}
