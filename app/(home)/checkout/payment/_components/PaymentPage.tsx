'use client';

import { convertToSubcurrency } from '@/app/utils/utils';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
import { useAppDispatch, useAppSelector } from '@/app/stores/store';
import { clearCart, totalPriceSelector } from '@/app/stores/cartSlices';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PATH_SHOP } from '@/app/routes/router.path';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const amount = useAppSelector((state) => totalPriceSelector(state));
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | null>(
    null
  );
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleCashPayment = () => {
    // Handle cash payment logic here
    router.push(PATH_SHOP);
    dispatch(clearCart());
  };

  return (
    <div className='py-24'>
      <div className='container mx-auto'>
        <div className='mx-auto max-w-[600px] border p-7'>
          <h3 className='mb-5 text-xl font-semibold text-yellowColor'>
            Payment Information
          </h3>

          <div className='mb-6 grid grid-cols-2 gap-4'>
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`rounded-lg border p-4 text-center transition-all hover:border-yellowColor
                ${
                  paymentMethod === 'cash'
                    ? 'border-yellowColor bg-yellow-50'
                    : 'border-gray-200'
                }`}
            >
              <div className='mb-2'>
                <i className='fas fa-money-bill text-2xl text-yellowColor'></i>
              </div>
              Pay with Cash
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`rounded-lg border p-4 text-center transition-all hover:border-yellowColor
                ${
                  paymentMethod === 'card'
                    ? 'border-yellowColor bg-yellow-50'
                    : 'border-gray-200'
                }`}
            >
              <div className='mb-2'>
                <i className='fas fa-credit-card text-2xl text-yellowColor'></i>
              </div>
              Pay with Card
            </button>
          </div>

          {paymentMethod === 'cash' && (
            <div className='text-center'>
              <p className='mb-4 text-gray-600'>
                You have selected to pay with cash. You will be redirected to
                continue shopping.
              </p>
              <button
                onClick={handleCashPayment}
                className='w-full rounded-md bg-yellowColor p-4 font-bold text-white transition-all hover:bg-yellow-600'
              >
                Confirm Cash Payment (${(amount + 10).toFixed(2)})
              </button>
            </div>
          )}

          {paymentMethod === 'card' && amount > 0 && (
            <Elements
              stripe={stripePromise}
              options={{
                mode: 'payment',
                amount: convertToSubcurrency(amount),
                currency: 'usd',
              }}
            >
              <PaymentForm amount={parseFloat((amount + 10).toFixed(2))} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
