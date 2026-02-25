export default function AppLogo() {
    return (
        <>
            <div className="flex size-8 shrink-0 items-center justify-center group-data-[collapsible=icon]:size-6">
                <img
                    src="/newIcons/navbarIcon.png"
                    alt="DEV-CRAFT"
                    className="w-8 h-8 group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:h-7 bg-transparent"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-semibold text-foreground uppercase tracking-widest">
                    DEV-CRAFT
                </span>
            </div>
        </>
    );
}
