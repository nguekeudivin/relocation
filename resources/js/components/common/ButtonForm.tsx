import { useForm } from '@inertiajs/react';
import React, { forwardRef } from 'react';
import { Button } from '../ui/button';

interface ButtonFormProps extends React.ComponentProps<typeof Button> {
    route: string;
    options?: any;
    children: React.ReactNode;
    data?: any;
}

export const ButtonForm = forwardRef<HTMLButtonElement, ButtonFormProps>(({ data, children, route, options = {}, ...buttonProps }, ref) => {
    const { post, processing, transform } = useForm();

    return (
        <form
            method="post"
            onSubmit={(e) => {
                e.preventDefault();
                transform(() => ({
                    ...data,
                }));
                post(route, options);
            }}
        >
            <Button {...buttonProps} type="submit" ref={ref} loading={processing} className={`${buttonProps.className || ''}`}>
                {children}
            </Button>
        </form>
    );
});

ButtonForm.displayName = 'ButtonForm';
