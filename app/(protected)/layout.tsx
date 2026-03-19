import SidebarLayoutWrapper from "./components/sidebar-layout-wrapper";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarLayoutWrapper>
            {children}
        </SidebarLayoutWrapper>
    );
}
