import { Outlet, useSearchParams } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import PublishModal from "./PublishModal";
import { useState } from "react";

function Layout() {
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || "";
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSearch = (value) => {
        if (value) {
            setSearchParams({ q: value });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar
                searchQuery={searchQuery}
                setSearchQuery={handleSearch}
                onPublishClick={() => setIsPublishModalOpen(true)}
            />

            {isPublishModalOpen && (
                <PublishModal
                    onClose={() => setIsPublishModalOpen(false)}
                    onSuccess={() => {
                        setRefreshTrigger(prev => prev + 1);
                    }}
                />
            )}

            <main style={{ flex: 1 }}>
                <Outlet context={{ searchQuery, refreshTrigger, setRefreshTrigger }} />
            </main>

            <Footer />
        </div>
    );
}

export default Layout;
