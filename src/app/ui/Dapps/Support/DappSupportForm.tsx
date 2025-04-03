'use client'

// components/DappSupportForm.tsx
import React, { useActionState } from 'react';
import { FeatureRequestState, sendBugReport, sendFeatureRequest } from '@/lib/supportActions';
import toast from 'react-hot-toast';
import Loader from '../../Loader';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { AnimatedButton } from '../../animations/AnimatedButton';
import { useRank } from '@/context/RankContext';

interface DappSupportFormProps {
    requestType: string;
    icon: React.ReactElement;
    title: string;
    placeholder: string;
    submitText: string;
    submitButtonClasses: string;
}

function DappSupportForm({
    requestType,
    placeholder,
    submitText,
    submitButtonClasses,
}: DappSupportFormProps) {
    const initialState: FeatureRequestState = { message: null, errors: {} };

    const params = useParams();
    const appId = params.appId as string;
    const { user } = useAuth();
    const { rank } = useRank();

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: FeatureRequestState, _formData: FormData) => {
            let newState: FeatureRequestState;
            try {
                if (requestType === "feature") {
                    newState = await sendFeatureRequest(appId, user, rank, prevState, _formData);
                } else {
                    newState = await sendBugReport(appId, user, rank, prevState, _formData);
                }

                if (newState.message == "success") {
                    toast.success(`${requestType == "feature" ? "Support request" : "Bug report"} submitted successfully!`);
                }
                return newState;

            } catch (error) {
                console.error(error);
                toast.error(`${requestType == "feature" ? "Support request" : "Bug report"} submittion Failed!`);
                return initialState
            }
        }, initialState);

    return (
        <form action={formAction} className="space-y-3" aria-describedby='form-error'>
            {/* <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                {icon}
                {title}
            </h3> */}

            <input
                name="type"
                value={requestType}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                aria-describedby='sp-request-error'
                hidden readOnly
            />
            <div id='sp-request-error' aria-live="polite" aria-atomic="true">
                {state?.errors?.type &&
                    state.errors.type.map((error: string) => (
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
                name="description"
                placeholder={placeholder}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                aria-describedby='sp-message-error'
                rows={3}
            />
            <div id='sp-message-error' aria-live="polite" aria-atomic="true">
                {state?.errors?.description &&
                    state.errors.description.map((error: string) => (
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

            <AnimatedButton type="submit" disabled={isSubmitting} className={submitButtonClasses}>
                {isSubmitting ?
                    <div className="flex items-center justify-center">
                        <Loader />
                        Submitting...
                    </div> :
                    submitText
                }
            </AnimatedButton>
        </form>
    );
};

export default DappSupportForm;
