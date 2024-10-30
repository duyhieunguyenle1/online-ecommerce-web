import HeroSection from '@/app/components/Hero&Title/HeroSection';
import PaymentForm from './_components/PaymentPage';

const PaymentPage = async () => {
  return (
    <>
      <HeroSection title={'Checkout'} />
      <PaymentForm />
    </>
  );
};

export default PaymentPage;
