'use client'

// components/DappSupportForm.tsx
import React, { useEffect, useActionState } from 'react';
import { sendSupportRequest, State } from '@/lib/supportActions';
import toast from 'react-hot-toast';
import Loader from '../../Loader';

interface DappSupportFormProps {
    requestType: string;
    icon: React.ReactElement;
    title: string;
    placeholder: string;
    submitText: string;
    submitButtonClasses: string;
}

// const DappSupportForm: React.FC<DappSupportFormProps> = ({
//     requestType,
//     icon,
//     title,
//     placeholder,
//     submitText,
//     submitButtonClasses,
// }) => 

function DappSupportForm({
    requestType,
    // icon,
    // title,
    placeholder,
    submitText,
    submitButtonClasses,
}: DappSupportFormProps) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction, isSubmitting] = useActionState(sendSupportRequest, initialState)

    useEffect(() => {
        if (state.message === 'success') {
            toast.success('Support request submitted successfully!');
        }
    }, [state.message]);

    return (
        <form action={formAction} className="space-y-3" aria-describedby='form-error'>
            {/* <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                {icon}
                {title}
            </h3> */}

            <input
                name="request"
                value={requestType}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                aria-describedby='sp-request-error'
                hidden readOnly
            />
            <div id='sp-request-error' aria-live="polite" aria-atomic="true">
                {state?.errors?.request &&
                    state.errors.request.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                        </p>
                    ))}
            </div>

            <input
                name="title"
                placeholder={`Title for your ${requestType} request`}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                aria-describedby='sp-title-error'
            />
            <div id='sp-title-error' aria-live="polite" aria-atomic="true">
                {state?.errors?.title &&
                    state.errors.title.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                        </p>
                    ))}
            </div>

            <textarea
                name="message"
                placeholder={placeholder}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                aria-describedby='sp-message-error'
                rows={3}
            />
            <div id='sp-message-error' aria-live="polite" aria-atomic="true">
                {state?.errors?.message &&
                    state.errors.message.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                        </p>
                    ))}
            </div>

            {/* Form Error */}
            <div id='form-error' aria-live="polite" aria-atomic="true">
                {state?.message && state?.message != "success" &&
                    <p className="text-sm text-red-500">
                        {state.message}
                    </p>
                }
            </div>

            <button type="submit" disabled={isSubmitting} className={submitButtonClasses}>
                {isSubmitting ?
                    <div className="flex items-center justify-center">
                        <Loader />
                        Submitting...
                    </div> :
                    submitText
                }
            </button>
        </form>
    );
};

export default DappSupportForm;
