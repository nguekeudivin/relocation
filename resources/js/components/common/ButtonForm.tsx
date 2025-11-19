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

export const SimpleButtonForm = forwardRef<HTMLButtonElement, ButtonFormProps>(({ data, children, route, options = {}, ...buttonProps }, ref) => {
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
            <button {...buttonProps} type="submit" ref={ref} className={`${buttonProps.className || ''}`}>
                {children}
            </button>
        </form>
    );
});

SimpleButtonForm.displayName = 'SimpleButtonForm';

ButtonForm.displayName = 'ButtonForm';
