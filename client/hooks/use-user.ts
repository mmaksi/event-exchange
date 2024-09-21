import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface IUser {
  id: string;
}

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/users/current-user');
        if (data.currentUser?.id) setCurrentUser(data.currentUser);
      } catch (error) {
        router.push('/signup');
      }
    };

    fetchUser();
  }, []);

  return currentUser;
};

export default useCurrentUser;
