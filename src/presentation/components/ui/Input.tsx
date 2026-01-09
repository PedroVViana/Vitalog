'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-xs font-black uppercase tracking-widest text-muted">{label}</label>}
            <input
                className={`input ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-danger font-bold">{error}</p>}
        </div>
    );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = ({ label, error, className = '', ...props }: TextareaProps) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-xs font-black uppercase tracking-widest text-muted">{label}</label>}
            <textarea
                className={`textarea ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-danger font-bold">{error}</p>}
        </div>
    );
};
