export const Display = ({ cond, children, className = '' }: any) => {
    if (!cond) return null;

    return <div className={className}>{children}</div>;
};

Display.displayName = 'Display';
