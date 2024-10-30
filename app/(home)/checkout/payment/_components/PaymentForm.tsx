'use client';

import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { convertToSubcurrency } from '@/app/utils/utils';
import { useAppDispatch } from '@/app/stores/store';
import { clearCart } from '@/app/stores/cartSlices';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

type PaymentStep = 'input' | 'review';

const PaymentForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('i');

  const [step, setStep] = useState<PaymentStep>('input');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInitialSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);

    if (!stripe || !elements) {
      return;
    }

    try {
      const paymentElement = elements.getElement('payment');
      if (!paymentElement) {
        throw new Error('Payment Element not found');
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        return;
      }

      // Create payment intent
      const res = await axios.post('/api/create-payment-intent', {
        amount: convertToSubcurrency(amount),
      });
      const { data } = res;
      setClientSecret(data.clientSecret);

      // Move to review step
      setStep('review');
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setErrorMessage(undefined);

    try {
      if (!stripe || !elements || !clientSecret) {
        throw new Error('Stripe not initialized or missing client secret');
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          await axios.patch(`/api/order/${orderId}`, { status: 'paid' });
          toast.success('Order updated successfully');
          dispatch(clearCart());
          router.push(
            `/payment-success?amount=${amount}?redirect_status=${paymentIntent.status}`
          );
        } catch (apiError) {
          toast.error('Failed to update order status');
        }
      }
    } catch (error) {
      setErrorMessage('Payment confirmation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className='flex items-center justify-center'>
        <div
          className='text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white'
          role='status'
        >
          <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleInitialSubmit} className='rounded-md bg-white p-2'>
      {/* Always show PaymentElement, but disable it during review */}
      <div
        className={step === 'review' ? 'pointer-events-none opacity-50' : ''}
      >
        <div className='mb-2 bg-yellow-100 p-1 text-center text-xs'>
          🔔 This is a test mode. Use card: 4242 4242 4242 4242
        </div>
        <PaymentElement />
      </div>

      {step === 'input' && (
        <button
          type='submit'
          disabled={!stripe || loading}
          className='mt-2 w-full rounded-md bg-yellowColor p-4 font-bold text-white disabled:animate-pulse disabled:opacity-50'
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      )}

      {step === 'review' && (
        <div className='mt-4 space-y-4'>
          <div className='rounded-lg border border-gray-200 p-4'>
            <div className='space-y-2 text-sm text-gray-600'>
              <p>Amount to be charged: ${amount}</p>
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              type='button'
              onClick={() => setStep('input')}
              className='w-1/3 rounded-md border border-gray-300 p-4 font-bold text-gray-700 transition-all hover:bg-gray-50'
            >
              Back
            </button>

            <button
              type='button'
              onClick={handleConfirmPayment}
              disabled={loading}
              className='w-2/3 rounded-md bg-yellowColor p-4 font-bold text-white transition-all hover:bg-yellow-600 disabled:opacity-50'
            >
              {loading ? 'Processing...' : 'Authorize Payment'}
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className='mt-2 text-sm text-red-500'>{errorMessage}</div>
      )}
    </form>
  );
};

export default PaymentForm;
