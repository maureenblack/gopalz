import Head from 'next/head';
import ProtectedRoute from '@/components/ProtectedRoute';
import TripForm from '@/components/TripForm';

export default function CreateTrip() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Create Trip - GoPalz</title>
        <meta name="description" content="Create a new adventure with GoPalz" />
      </Head>

      <TripForm />
    </ProtectedRoute>
  );
}
