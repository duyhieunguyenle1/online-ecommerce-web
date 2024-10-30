import Link from 'next/link';
import { PATH_SHOP } from '@/app/routes/router.path';

type Props = {
  searchParams: { amount: string };
};

export default function PaymentSuccessPage({ searchParams }: Props) {
  const { amount } = searchParams;

  return (
    <div className='h-fit bg-gray-50 py-24'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-[600px] rounded-lg bg-white p-8 text-center shadow-md'>
          <div className='mb-6'>
            <svg
              className='mx-auto h-12 w-12 text-green-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>

          <h1 className='mb-4 text-2xl font-bold text-gray-800'>
            Payment Successful!
          </h1>

          <p className='mb-6 text-gray-600'>Amount paid: ${amount}</p>

          <Link
            href={PATH_SHOP}
            className='inline-block rounded-md bg-yellowColor px-6 py-3 font-semibold text-white transition-all hover:bg-yellow-600'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
