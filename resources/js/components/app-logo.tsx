export default function AppLogo() {
    return (
        <>
            <div className="win95-raised flex size-8 shrink-0 items-center justify-center bg-[#c0c0c0] group-data-[collapsible=icon]:!border-0 group-data-[collapsible=icon]:!shadow-none group-data-[collapsible=icon]:size-6">
                <span className="material-symbols-outlined text-black text-lg group-data-[collapsible=icon]:text-sm">grid_view</span>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                <span className="mb-0.5 truncate leading-tight font-bold text-black uppercase tracking-wider">
                    DEV-CRAFT
                </span>
            </div>
        </>
    );
}
